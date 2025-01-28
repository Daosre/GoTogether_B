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
import { Throttle } from '@nestjs/throttler';
import { userJwt } from 'src/utils/const';

@Controller('evenement')
export class EvenementController {
  constructor(private readonly evenementService: EvenementService) {}
  @Get('/mostRecent')
  mostRecent() {
    return this.evenementService.mostRecent();
  }
  @Get('/mostPopular')
  mostPopular() {
    return this.evenementService.mostPopular();
  }
  @Throttle({ default: { ttl: 10000, limit: 10 } })
  @Get('/search')
  searchEvent(@Query() query: any) {
    return this.evenementService.searchEvent(query);
  }
  @Throttle({ default: { ttl: 10000, limit: 10 } })
  @UseGuards(JwtGuard)
  @Get('/searchMyEvent')
  searchMyEvent(@Query() query: any, @GetUser() user: User) {
    return this.evenementService.searchMyEvent(query, user);
  }
  @Throttle({ default: { ttl: 10000, limit: 10 } })
  @UseGuards(JwtGuard)
  @Get('/searchMyParticipations')
  searchMyParticipations(@Query() query: any, @GetUser() user: User) {
    return this.evenementService.searchMyParticipations(query, user);
  }
  @Get('/:id')
  getById(@Param('id') id: string, @Query() query: any) {
    return this.evenementService.getById(id, query);
  }
  @Throttle({ default: { ttl: 60000, limit: 4 } })
  @UseGuards(JwtGuard)
  @Post('/create')
  insertEvenement(@Body() dto: eventDto, @GetUser() user: User) {
    return this.evenementService.insertEvenement(dto, user);
  }
  @Throttle({ default: { ttl: 60000, limit: 4 } })
  @UseGuards(JwtGuard)
  @Patch('/update/:id')
  updateEvenement(@Body() dto: eventDto, @Param('id') id: string, @GetUser() user:userJwt) {
    return this.evenementService.updateEvenement(dto, id,user);
  }
  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  deleteEvenement(@Param('id') id: string, @GetUser() user: userJwt) {
    return this.evenementService.deleteEvenement(id, user);
  }
}
