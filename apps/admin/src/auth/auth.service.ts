import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import { AppHttpBadRequest, UserErrors } from '@app/exceptions';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from '@app/common';
type TokenBodyType = {
  id: string;
};
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.userService.findOne({
      where: {
        username: data.username,
      },
    });

    if (!user) {
      throw new AppHttpBadRequest(UserErrors.ERROR_USER_NOT_FOUND);
    }

    if (user.password !== data.password) {
      throw new AppHttpBadRequest(UserErrors.ERROR_PASSWORD_WRONG);
    }

    const token = await this.generateToken({ id: user.id });

    return {
      docs: token,
    };
  }

  async generateToken(data: TokenBodyType) {
    const token = this.jwtService.signAsync(JSON.stringify(data), {
      secret: process.env.ADMIN_SECRET,
    });
    return token;
  }

  async updatePassword(data: UpdatePasswordDto, user: UserEntity) {
    if (data.ordPassword !== user.password) {
      throw new AppHttpBadRequest(UserErrors.ERROR_PASSWORD_WRONG);
    }

    await this.userService.update(user.id, { password: data.newPassword });

    return {
      success: true,
    };
  }
}
