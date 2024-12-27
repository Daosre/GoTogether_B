import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { EvenementService } from './evenement.service';
import { InsertEventDto } from './dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('evenement')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}

  @Get('/all')
  getAllEvenement() {
    return this.evenementService.getAllEvent();
  }

  @Post('/create')
  insertEvenement(@Body() dto: InsertEventDto, @GetUser() user: User) {
    return this.evenementService.insertEvenement(dto, user);
  }
}
