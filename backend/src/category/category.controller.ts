import { Controller, Post, Put, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryService.create(createCategoryDto);
      return createSuccessResponse(category, 'Category successfully created');
    } catch (error) {
      return createErrorResponse('Failed to create category', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryService.update(id, updateCategoryDto);
      return createSuccessResponse(category, 'Category successfully updated');
    } catch (error) {
      return createErrorResponse('Failed to update category', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const categories = await this.categoryService.findAll();
      return createSuccessResponse(categories, 'Categories fetched successfully');
    } catch (error) {
      return createErrorResponse('Failed to fetch categories', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const category = await this.categoryService.findOne(id);
      if (!category) {
        return createErrorResponse('Category not found', 'No category found with the given ID', HttpStatus.NOT_FOUND);
      }
      return createSuccessResponse(category, 'Category fetched successfully');
    } catch (error) {
      return createErrorResponse('Failed to fetch category', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.categoryService.remove(id);
      return createSuccessResponse(null, 'Category successfully deleted');
    } catch (error) {
      return createErrorResponse('Failed to delete category', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
