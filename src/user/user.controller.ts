import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/auth/decorator';
import { Role, User } from '@prisma/client';
import { userJwt } from 'src/utils/const';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/participantList/:id')
  participantList(@GetUser() user: userJwt, @Param('id') id: string) {
    return this.userService.participantList(id, user);
  }
  @Patch('/participate/:id')
  participate(@GetUser() user: User, @Param('id') id: string) {
    return this.userService.participate(id, user);
  }
  @Delete("/event/:eventId/user/:userId")
  removeParticipant(@GetUser() user:userJwt, @Param("eventId") eventId: string, @Param("userId") userId: string){
    return this.userService.removeParticipant(eventId, userId, user);
  }
}
