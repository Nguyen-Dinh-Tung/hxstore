import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { Public } from '@app/common';
import { AuthService } from './auth.service';

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
}
