import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { pagination } from 'src/utils/pagination';
import { sentenceCase } from 'src/utils/sentenceCase';
import { isNextPage } from 'src/utils/isNextPage';
import { eventDto } from './dto';

@Injectable()
export class EvenementService {
  constructor(private prisma: PrismaService) {}

  async mostRecent() {
    return {
      data: await this.prisma.event.findMany({
        include: {
          _count: true,
          category: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              userName: true,
            },
          },
        },
        omit: {
          userId: true,
          categoryId: true,
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 4,
      }),
    };
  }
  async mostPopular() {
    return {
      data: await this.prisma.event.findMany({
        include: {
          _count: true,
          category: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              userName: true,
            },
          },
        },
        orderBy: {
          userParticipate: { _count: 'desc' },
        },
        omit: {
          userId: true,
          categoryId: true,
          updatedAt: true,
        },
        take: 4,
      }),
    };
  }
  async searchEvent(query: any) {
    const take = 10;
    const skip = pagination(query.page, take);
    const search = query.search;
    const location = query.location;
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: search ? search : '',
      },
    });
    const countEvent = await this.prisma.event.count({
      where: {
        city: { contains: location },
        OR: [
          { name: { contains: search } },
          {
            categoryId: existingCategory ? existingCategory.id : '',
          },
        ],
      },
    });
    const nextPage = isNextPage(
      countEvent,
      pagination(Number(query.page) + 1, take),
    );
    return {
      data: await this.prisma.event.findMany({
        skip: skip,
        take: take,
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          city: { contains: location },
          OR: [
            { name: { contains: search } },
            {
              categoryId: existingCategory ? existingCategory.id : '',
            },
          ],
        },
        omit: {
          userId: true,
          categoryId: true,
          updatedAt: true,
        },
        include: {
          _count: {
            select: {
              userParticipate: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              userName: true,
            },
          },
        },
      }),
      countEvent: countEvent,
      isNextPage: nextPage,
    };
  }
  async searchMyEvent(query: any, user: User) {
    const take = 10;
    const skip = pagination(query.page, take);
    const search = query.search;
    const location = query.location;
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        name: search ? search : '',
      },
    });
    const countEvent = await this.prisma.event.count({
      where: {
        userId: user.id,
        city: { contains: location },
        OR: [
          { name: { contains: search } },
          {
            categoryId: existingCategory ? existingCategory.id : '',
          },
        ],
      },
    });
    const nextPage = isNextPage(
      countEvent,
      pagination(Number(query.page) + 1, take),
    );
    return {
      data: await this.prisma.event.findMany({
        skip: skip,
        take: take,
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          userId: user.id,
          city: { contains: location },
          OR: [
            { name: { contains: search } },
            {
              categoryId: existingCategory ? existingCategory.id : '',
            },
          ],
        },
        omit: {
          userId: true,
          categoryId: true,
          updatedAt: true,
        },
        include: {
          _count: {
            select: {
              userParticipate: true,
            },
          },
          category: {
            select: {
              name: true,
            },
          },
        },
      }),
      countEvent: countEvent,
      isNextPage: nextPage,
    };
  }
  async getById(id: string) {
    const existingEvent = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
      include: {
        _count: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            userName: true,
          },
        },
      },
    });
    if (!existingEvent) {
      throw new ForbiddenException('Event not found');
    }
    return { data: existingEvent };
  }

  async insertEvenement(dto: eventDto, user: User) {
    dto.categoryName = sentenceCase(dto.categoryName);
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

  async updateEvenement(dto: eventDto, id: string) {
    dto.categoryName = sentenceCase(dto.categoryName);
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
