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

  async insertEvenement(dto: InsertEventDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: dto.categoryName
      },
    });

    let category = existingCategory
    if (!existingCategory){
      category = await this.prisma.category.create({
        data: {
          name: dto.categoryName
        }
      });
      category = existingCategory
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
