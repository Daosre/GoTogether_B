import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategory } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategory() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        name: true,
      },
    });
  }
  async updateCategory(dto: UpdateCategory, id: string) {
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
    await this.prisma.category.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Deleted' };
  }
}
