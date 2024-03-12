import { IS_PUBLIC_KEY, UserEntity } from '@app/common';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly accountRepo: Repository<UserEntity>;
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {
    this.accountRepo = this.dataSource.getRepository(UserEntity);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = AuthGuard.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ADMIN_SECRET,
      });

      console.log(payload, `payload`);

      if (!payload.id) {
        return false;
      }

      const account = await this.accountRepo.findOne({
        where: {
          id: payload.id,
        },
      });

      if (!account) return false;

      request['user'] = account;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private static extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
