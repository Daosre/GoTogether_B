import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, userJwt } from 'src/utils/const';
import { isNextPage } from 'src/utils/isNextPage';
import { pagination } from 'src/utils/pagination';
import { updateUserDTO } from './dto/user.update.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async searchUser(query: any) {
    const take = 10;
    const skip = pagination(query.page, take);
    const search = query.search;
    const countUser = await this.prisma.user.count({
      where: {
        OR: [
          { email: { contains: search } },
          { userName: { contains: search } },
          { phone: { contains: search } },
        ],
      },
    });
    const nextPage = isNextPage(
      countUser,
      pagination(Number(query.page) + 1, take),
    );
    return {
      data: await this.prisma.user.findMany({
        skip: skip,
        take: take,
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          OR: [
            { email: { contains: search } },
            { userName: { contains: search } },
            { phone: { contains: search } },
          ],
        },
        omit: {
          roleId: true,
          gdpr: true,
          token: true,
          password: true,
        },
      }),
      isNextPage: nextPage,
    };
  }
  async updateUser(id: string, dto: updateUserDTO) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Updated successfully' };
  }
  async deleteUser(id: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
    return { message: 'User delete' };
  }

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
