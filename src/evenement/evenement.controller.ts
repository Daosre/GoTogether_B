import { Controller, Get } from '@nestjs/common';
import { EvenementService } from './evenement.service';

@Controller('evenement')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}

  @Get('/all')
  getAllEvenement() {
    return this.evenementService.getAllEvent()
  }
}
