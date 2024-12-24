import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { EventModule } from './event/event.module';
import { EvenementModule } from './evenement/evenement.module';
import { CategoryModule } from './category/category.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }]),
    AuthModule,
    PrismaModule,
    EmailModule,
    EventModule,
    CategoryModule,
    EvenementModule,
  ],
})
export class AppModule {}
