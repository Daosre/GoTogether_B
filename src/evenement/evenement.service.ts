import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { InsertEventDto, UpdateEventDto } from './dto';


@Injectable()
export class EvenementService {
  constructor(private prisma: PrismaService) {}

  async getAllEvent() {
    return this.prisma.event.findMany({
      orderBy: {
        id: 'asc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
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
    }
    delete dto.categoryName;

    await this.prisma.event.create({
      data: {
        ...dto,
        categoryId: category.id,
        userId: user.id,
      },
    });
    return { message: 'Success' };
  }

  async updateEvenement(dto: UpdateEventDto, id: string) {
    const existingEvenement = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingEvenement) {
      throw new ForbiddenException('Unexisting Id');
    }
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
    }
    delete dto.categoryName;

    await this.prisma.event.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
        categoryId: category.id,
      },
    });
    return { message: 'Updated' };
  }

  async deleteEvenement(id: string) {
    const existingEvenement = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingEvenement) {
      throw new ForbiddenException('Unexising Id');
    }
    await this.prisma.event.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Deleted' };
  }
}
