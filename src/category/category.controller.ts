import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategory } from './dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @UseGuards(JwtGuard, AdminGuard)
  @Get('/all')
  getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @Get('/search')
  searchCategory(@Query() query: any){
    return this.categoryService.searchCategory(query)
  }
  @UseGuards(JwtGuard, AdminGuard)
  @Patch('/update/:id')
  updateCategory(@Body() dto: UpdateCategory, @Param('id') id: string) {
    return this.categoryService.updateCategory(dto, id);
  }
  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
