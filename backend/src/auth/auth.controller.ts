import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from '@/user/dto/register.dto';
import { SigninDto } from './dto/SigninDto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Post('signin')
  async signIn(@Body() signinDto: SigninDto): Promise<any> {
    return this.authService.signin(signinDto);
  }
}
