import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { EmailModule } from './email/email.module';
import { EvenementModule } from './evenement/evenement.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    AuthModule,
    PrismaModule,
    EmailModule,
    CategoryModule,
    EvenementModule,
    UserModule,
  ],
})
export class AppModule {}
