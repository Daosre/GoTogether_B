import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { userJwt } from 'src/utils/const';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { updateUserDTO } from './dto/user.update.dto';
import { Throttle } from '@nestjs/throttler';
import { Cron } from '@nestjs/schedule';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Get('/participantList/:id')
  participantList(@GetUser() user: userJwt, @Param('id') id: string) {
    return this.userService.participantList(id, user);
  }
  @Throttle({ default: { ttl: 10000, limit: 4 } })
  @Patch('/participate/:id')
  participate(@GetUser() user: User, @Param('id') id: string) {
    return this.userService.participate(id, user);
  }
  @Delete('/event/:eventId/user/:userId')
  removeParticipant(
    @GetUser() user: userJwt,
    @Param('eventId') eventId: string,
    @Param('userId') userId: string,
  ) {
    return this.userService.removeParticipant(eventId, userId, user);
  }
  @UseGuards(AdminGuard)
  @Get('/List')
  searchUser(@Query() query: any) {
    return this.userService.searchUser(query);
  }
  @UseGuards(AdminGuard)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() dto: updateUserDTO) {
    return this.userService.updateUser(id, dto);
  }
  @UseGuards(AdminGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
  @Cron('1 * * * * *')
  deleteInactiveAccount() {
    return this.userService.deleteInactiveAccount();
  }
}
