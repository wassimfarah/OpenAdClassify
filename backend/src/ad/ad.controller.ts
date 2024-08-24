import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AdService } from './ad.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { createErrorResponse } from 'src/utils/common/response.util';

@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Post()
  async create(@Body() createAdDto: CreateAdDto) {
    try {
      return await this.adService.create(createAdDto);
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Error creating ad', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.adService.findAll();
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Error fetching ads', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.adService.findOne(id);
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Error fetching ad', error.message),
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateAdDto: UpdateAdDto) {
    try {
      return await this.adService.update(id, updateAdDto);
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Error updating ad', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.adService.remove(id);
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Error deleting ad', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
