import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertEventDto } from './dto';
import { User } from '@prisma/client';

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

  async insertEvenement(dto: InsertEventDto, user: User) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: dto.categoryName,
      },
    });

    let category = existingCategory;
    if (!existingCategory) {
      category = await this.prisma.category.create({
        data: {
          name: dto.categoryName,
        },
      });
      category = existingCategory;
    }
    await this.prisma.event.create({
      data: {
        ...dto,
        categoryId: existingCategory.id,
        userId: user.id,
      },
    });
    return { message: 'Success' };
  }
}
