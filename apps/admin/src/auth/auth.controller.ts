import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Me, Public, UserEntity } from '@app/common';
import { AuthService } from './auth.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
@ApiTags('Auth api')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }

  @Patch('password')
  async updatePassword(
    @Body() data: UpdatePasswordDto,
    @Me() user: UserEntity,
  ) {
    return await this.authService.updatePassword(data, user);
  }
}
