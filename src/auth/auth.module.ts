import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, EmailService],
})
export class AuthModule {}
