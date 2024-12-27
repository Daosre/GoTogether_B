import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtSrategy } from './strategy/jwt.strategy';
import { JwtAdminStrategy } from './strategy/admin.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    EmailService,
    JwtSrategy,
    JwtAdminStrategy,
  ],
})
export class AuthModule {}
