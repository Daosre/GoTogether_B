import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InsertEventDto, signinDTO, signupDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(@Body() dto: signupDTO) {
    return this.authService.signup(dto);
  }
  @Post('/signin')
  signin(@Body() dto: signinDTO) {
    return this.authService.signin(dto);
  }
  @Patch('/activate/:token')
  activateAccount(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }
}
