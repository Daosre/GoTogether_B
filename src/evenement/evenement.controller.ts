import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { eventDto } from './dto';
import { EvenementService } from './evenement.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('evenement')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}

  @Get('/search')
  searchEvent(@Query() query: any) {
    return this.evenementService.searchEvent(query);
  }
  @Get('/searchMyEvent')
  searchMyEvent(@Query() query: any, @GetUser() user: User) {
    return this.evenementService.searchMyEvent(query, user);
  }
  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.evenementService.getById(id);
  }
  @Post('/create')
  insertEvenement(@Body() dto: eventDto, @GetUser() user: User) {
    return this.evenementService.insertEvenement(dto, user);
  }
  @Patch('/update/:id')
  updateEvenement(@Body() dto: eventDto, @Param('id') id: string) {
    return this.evenementService.updateEvenement(dto, id);
  }

  @Delete('/delete/:id')
  deleteEvenement(@Param('id') id: string) {
    return this.evenementService.deleteEvenement(id);
  }
}
