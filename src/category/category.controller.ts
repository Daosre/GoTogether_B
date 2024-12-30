import { Body, Controller, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategory } from './dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  getAllCategory() {
    return this.categoryService.getAllCategory();
  }

  @Get('/search')
  searchCategory(@Query() query: any){
    return this.categoryService.searchCategory(query)
  }

  @Patch('/update/:id')
  updateCategory(@Body() dto: UpdateCategory, @Param('id') id: string) {
    return this.categoryService.updateCategory(dto, id);
  }

  @Delete('/delete/:id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
}
