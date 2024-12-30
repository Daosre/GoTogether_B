import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, userJwt } from 'src/utils/const';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async participate(id: string, user: User) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            userParticipate: true,
          },
        },
      },
    });
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    const participateUser = await this.prisma.user_Participates_Event.findFirst(
      {
        where: {
          eventId: id,
          userId: user.id,
        },
      },
    );
    if (participateUser) {
      await this.prisma.user_Participates_Event.delete({
        where: {
          id: participateUser.id,
        },
      });
      return { message: 'Unsubscribe' };
    } else {
      if (
        existingEvent._count.userParticipate < existingEvent.maxParticipants
      ) {
        await this.prisma.user_Participates_Event.create({
          data: {
            userId: user.id,
            eventId: id,
          },
        });
        return { message: 'You are subscribe' };
      } else {
        return { message: 'This Event is full' };
      }
    }
  }
  async participantList(id: string, user: userJwt) {
    const existingEvent = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    if (existingEvent.userId !== user.id && user.role.name !== Role.ADMIN) {
      throw new ForbiddenException("You don't have permision");
    }
    return {
      data: await this.prisma.user_Participates_Event.findMany({
        where: {
          eventId: existingEvent.id,
        },
        include: {
          user: {
            select: {
              id: true,
              userName: true,
            },
          },
        },
      }),
    };
  }
  async removeParticipant(eventId: string, userId: string, user: userJwt) {
    const existingEvent = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (!existingEvent) {
      throw new NotFoundException('Event not found');
    }
    if (existingEvent.userId !== user.id && user.role.name !== Role.ADMIN) {
      throw new ForbiddenException("You don't have permision");
    }
    const existingUserParticipateEvent =
      await this.prisma.user_Participates_Event.findFirst({
        where: {
          userId: userId,
        },
      });
    if (!existingUserParticipateEvent) {
      throw new NotFoundException('Participant not found');
    }
    await this.prisma.user_Participates_Event.delete({
      where: { id: existingUserParticipateEvent.id },
    });
    return { message: 'Participant unsubscribe' };
  }
}
