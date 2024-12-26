import { Module } from '@nestjs/common';
import { EvenementService } from './evenement.service';
import { EvenementController } from './evenement.controller';

@Module({
  controllers: [EvenementController],
  providers: [EvenementService],
})
export class EvenementModule {}
