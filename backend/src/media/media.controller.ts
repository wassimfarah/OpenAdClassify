import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { UpdateMediaDto } from './dto/update-media.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
import * as fs from 'fs/promises';  // Use promises API for async operations
import * as path from 'path';
import { MediaType } from '@prisma/client';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { UseGuards } from '@nestjs/common';
import { request } from 'https';

// Define constants for file extensions and media types
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif'];
const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.wmv'];
const MEDIA_TYPE_DIRECTORIES = {
  avatar: 'profiles/avatars',
  image: 'ads/images',
  video: 'ads/videos'
};

// Helper function to determine upload directory and type
function getUploadDirectoryAndType(fileExtension: string, mediaType: string): { uploadDirectory: string, type: MediaType } {
  let type: MediaType;
  let uploadDirectory = './uploads';

  if (mediaType === 'avatar') {
    uploadDirectory = path.join(uploadDirectory, MEDIA_TYPE_DIRECTORIES.avatar);
    type = MediaType.IMAGE;
  } else if (IMAGE_EXTENSIONS.includes(fileExtension)) {
    uploadDirectory = path.join(uploadDirectory, MEDIA_TYPE_DIRECTORIES.image);
    type = MediaType.IMAGE;
  } else if (VIDEO_EXTENSIONS.includes(fileExtension)) {
    uploadDirectory = path.join(uploadDirectory, MEDIA_TYPE_DIRECTORIES.video);
    type = MediaType.VIDEO;
  } else {
    throw new HttpException('Unsupported file type', HttpStatus.BAD_REQUEST);
  }

  return { uploadDirectory, type };
}

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AccessTokenAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads'); // Temporary directory for initial upload
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('adId') adId: string,
    @Body('type') mediaType: string,
  ) {
    try {
      if (!adId) {
        throw new HttpException('adId is required', HttpStatus.BAD_REQUEST);
      }

      const fileExtension = extname(file.originalname).toLowerCase();
      const { uploadDirectory, type } = getUploadDirectoryAndType(fileExtension, mediaType);

      // Move file to the appropriate directory
      const tempPath = path.join('./uploads', file.filename);
      const finalPath = path.join(uploadDirectory, file.filename);

      await fs.rename(tempPath, finalPath);

      // Create media entry with dynamic type and URL
      const mediaUrl = `/uploads/${MEDIA_TYPE_DIRECTORIES[type.toLowerCase()]}/${file.filename}`;
      const media = await this.mediaService.create({
        url: mediaUrl,
        type,
        adId,
      });
      return createSuccessResponse(media, 'Media successfully created');
    } catch (error) {
      return createErrorResponse('Failed to create media', error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseGuards(AccessTokenAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads'); // Temporary directory for initial upload
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, uniqueSuffix);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMediaDto: UpdateMediaDto,
  ) {
    try {
      const existingMedia = await this.mediaService.findOne(id);
      if (!existingMedia) {
        throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
      }
  
      // If a new file is uploaded, update it
      if (file) {
        // Determine the new upload directory and type
        const fileExtension = extname(file.originalname).toLowerCase();
        const { uploadDirectory, type } = getUploadDirectoryAndType(fileExtension, updateMediaDto.type);
  
        // Remove the old file from the server
        await this.mediaService.deleteFile(existingMedia.url);
  
        // Move new file to the appropriate directory
        const tempPath = path.join('./uploads', file.filename);
        const finalPath = path.join(uploadDirectory, file.filename);
        await fs.rename(tempPath, finalPath);
  
        // Update file URL in the DTO
        updateMediaDto.url = `/uploads/${MEDIA_TYPE_DIRECTORIES[type.toLowerCase()]}/${file.filename}`;
        updateMediaDto.type = type;
      }
  
      const updatedMedia = await this.mediaService.update(id, updateMediaDto);
      return createSuccessResponse(updatedMedia, 'Media successfully updated');
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

  @Delete()
  @UseGuards(AccessTokenAuthGuard)
  async deleteMedia( @Body('id') id: string, @Req() req: any) {
    try {
      if (!id) {
        throw new HttpException('Media ID is required', HttpStatus.BAD_REQUEST);
      }
      // Proceed with deletion logic
      await this.mediaService.remove(id);
      return createSuccessResponse(null, 'Media successfully deleted');
    } catch (error) {
      return createErrorResponse('Failed to delete media', error.message, HttpStatus.BAD_REQUEST);
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
