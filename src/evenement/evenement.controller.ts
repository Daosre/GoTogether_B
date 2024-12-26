import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EvenementService } from './evenement.service';
import { InsertEventDto } from './dto';

@Controller('evenement')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}

  @Get('/all')
  getAllEvenement() {
    return this.evenementService.getAllEvent()
  }

  @Post('/create')
  insertEvenement(@Body() dto: InsertEventDto) {
    return this.evenementService.insertEvenement(dto)
  }
}
