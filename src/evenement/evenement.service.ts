import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertEventDto } from './dto';

@Injectable()
export class EvenementService {
  constructor(private prisma: PrismaService) {}

  async getAllEvent() {
    return this.prisma.event.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async insertEvenement(dto: InsertEventDto, id: string) {
    const existingEvent = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (existingEvent) {
      throw new ForbiddenException('Id Existing');
    }
    await this.prisma.event.create({
      data: {
        ...dto,
        category: { connect: { id: 'id' } },
        user: { connect: { id: 'id' } },
      },
    });
    return { message: 'Success' };
  }
}
