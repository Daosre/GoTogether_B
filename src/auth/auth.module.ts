import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAdminStrategy } from './strategy/admin.strategy';
import { JwtSrategy } from './strategy/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtSrategy,
    JwtAdminStrategy,
    EmailService,
  ],
})
export class AuthModule {}
