import { Controller, Post, Put, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @Post()
  async create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    try {
      const subcategory = await this.subcategoryService.create(createSubcategoryDto);
      return createSuccessResponse(subcategory, 'Subcategory successfully created');
    } catch (error) {
      return createErrorResponse('Failed to create subcategory', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    try {
      const subcategory = await this.subcategoryService.update(id, updateSubcategoryDto);
      return createSuccessResponse(subcategory, 'Subcategory successfully updated');
    } catch (error) {
      return createErrorResponse('Failed to update subcategory', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const subcategories = await this.subcategoryService.findAll();
      return createSuccessResponse(subcategories, 'Subcategories fetched successfully');
    } catch (error) {
      return createErrorResponse('Failed to fetch subcategories', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const subcategory = await this.subcategoryService.findOne(id);
      if (!subcategory) {
        return createErrorResponse('Subcategory not found', 'No subcategory found with the given ID', HttpStatus.NOT_FOUND);
      }
      return createSuccessResponse(subcategory, 'Subcategory fetched successfully');
    } catch (error) {
      return createErrorResponse('Failed to fetch subcategory', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('by-category/:categoryId')
  async findAllSubcategoriesByCategoryId(@Param('categoryId') categoryId: string) {
    try {
      const subcategories = await this.subcategoryService.findAllSubcategoriesByCategoryId(categoryId);
      return createSuccessResponse(subcategories, 'Subcategories fetched successfully by category ID');
    } catch (error) {
      return createErrorResponse('Failed to fetch subcategories', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.subcategoryService.remove(id);
      return createSuccessResponse(null, 'Subcategory successfully deleted');
    } catch (error) {
      return createErrorResponse('Failed to delete subcategory', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
