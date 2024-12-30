import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { pagination } from 'src/utils/pagination';
import { sentenceCase } from 'src/utils/sentenceCase';
import { UpdateCategory } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategory() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
  async searchCategory(query: any) {
    const take = 5;
    const skip = pagination(query.page, take);
    const search = sentenceCase(query.search);
    return await this.prisma.category.findMany({
      skip: skip,
      take: take,
      orderBy: {
        id: 'asc',
      },
      where: {
        name: { contains: search },
      },
    });
  }

  async updateCategory(dto: UpdateCategory, id: string) {
    dto.name = sentenceCase(dto.name);
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCategory) {
      throw new ForbiddenException('Unexisting Id');
    }
    await this.prisma.category.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
    return { message: 'Successfull' };
  }

  async deleteCategory(id: string) {
    const existingCategory = await this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCategory) {
      throw new ForbiddenException(' Unexisting Id');
    }
    await this.prisma.event.deleteMany({
      where: {
        categoryId: id,
      },
    });
    await this.prisma.category.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Deleted' };
  }
}
