import { Controller, Post, Put, Get, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async create(@Body() createMediaDto: CreateMediaDto) {
    try {
      const media = await this.mediaService.create(createMediaDto);
      return createSuccessResponse(media, 'Media successfully created');
    } catch (error) {
      return createErrorResponse('Failed to create media', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    try {
      const media = await this.mediaService.update(id, updateMediaDto);
      return createSuccessResponse(media, 'Media successfully updated');
    } catch (error) {
      return createErrorResponse('Failed to update media', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      const media = await this.mediaService.findAll();
      return createSuccessResponse(media, 'Media fetched successfully');
    } catch (error) {
      return createErrorResponse('Failed to fetch media', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const media = await this.mediaService.findOne(id);
      if (!media) {
        return createErrorResponse('Media not found', 'No media found with the given ID', HttpStatus.NOT_FOUND);
      }
      return createSuccessResponse(media, 'Media fetched successfully');
    } catch (error) {
      return createErrorResponse('Failed to fetch media', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.mediaService.remove(id);
      return createSuccessResponse(null, 'Media successfully deleted');
    } catch (error) {
      return createErrorResponse('Failed to delete media', error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
