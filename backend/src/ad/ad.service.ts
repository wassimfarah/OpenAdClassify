import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { convertUtcToOffset } from 'src/utils/common/time.util';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AdService {
  private readonly utcOffsetHours: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {
    this.utcOffsetHours = parseInt(process.env.UTC_HOURS_OFFSET, 10);
  }

  private async getBase64ImageFromMedia(mediaItem: any): Promise<string> {
    try {
      const urlPath = mediaItem.url;
      const parts = urlPath.split('/');
      const baseName = parts.length > 2 ? parts.slice(2).join('/') : parts[0];

      // Determine the folder path based on media type
      let folderPath: string;
      folderPath = '';
      const fullPath = `${folderPath}/${baseName}`;

      // Fetch the base64 image from the correct path
      return await this.mediaService.getBase64Image(fullPath);
    } catch (error) {
      console.error('Error fetching image for media item:', error.message);
      throw new Error(`Failed to fetch image for media item: ${mediaItem.id || 'unknown'}`);
    }
  }

  private convertAdTimes(ad: any): any {
    return {
      ...ad,
      createdAt: convertUtcToOffset(ad.createdAt, this.utcOffsetHours),
      updatedAt: convertUtcToOffset(ad.updatedAt, this.utcOffsetHours),
    };
  }

  private async processAdMedia(ad: any): Promise<any> {
    // Process all media items and add their base64 representation
    const mediaWithBase64Promises = ad.media.map(async (mediaItem: any) => {
      const b64 = await this.getBase64ImageFromMedia(mediaItem);
      return { ...mediaItem, b64 };
    });

    const mediaWithBase64 = await Promise.all(mediaWithBase64Promises);

    return {
      ...ad,
      mediaData: mediaWithBase64, // Now contains an array of media items with `b64`
    };
  }

  async create(createAdDto: CreateAdDto) {
    try {
      const {
        title, description, price, minimumPrice, type,
        acceptOffer, acceptMessages, acceptExchange, location,
        adStatus, categoryId, subcategoryId, createdById, mediaIds,
      } = createAdDto;

      const ad = await this.prisma.ad.create({
        data: {
          title, description, price, minimumPrice, type,
          acceptOffer, acceptMessages, acceptExchange, location, adStatus,
          category: { connect: { id: categoryId } },
          subcategory: { connect: { id: subcategoryId } },
          createdBy: { connect: { id: createdById } },
          media: { connect: mediaIds?.map((id) => ({ id })) || [] },
        },
      });

      return createSuccessResponse({ adId: ad.id }, 'Ad created successfully');
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Failed to create the ad', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const ads = await this.prisma.ad.findMany({
        include: { media: true },
      });

      const adsWithConvertedTimes = ads.map(ad => this.convertAdTimes(ad));
      const adsWithMedia = await Promise.all(adsWithConvertedTimes.map(ad => this.processAdMedia(ad)));

      return createSuccessResponse(adsWithMedia, 'Ads fetched successfully');
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Failed to fetch ads', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const ad = await this.prisma.ad.findUnique({
        where: { id },
        include: { media: true, createdBy: true },
      });

      if (!ad) {
        throw new HttpException(
          createErrorResponse('Ad not found', 'The requested ad does not exist'),
          HttpStatus.NOT_FOUND,
        );
      }

      const adWithConvertedTimes = this.convertAdTimes(ad);
      const mediaWithBase64Promises = ad.media.map(async mediaItem => ({
        b64: await this.getBase64ImageFromMedia(mediaItem),
      }));

      const mediaWithBase64 = await Promise.all(mediaWithBase64Promises);
      adWithConvertedTimes.mediaData = mediaWithBase64;

      return createSuccessResponse({ ad: adWithConvertedTimes }, 'Ad fetched successfully');
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Failed to fetch the ad', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateAdDto: UpdateAdDto) {
    try {
      const updatedAd = await this.prisma.ad.update({
        where: { id },
        data: {
          ...updateAdDto,
          media: {
            connect: updateAdDto.mediaIds?.map(id => ({ id })) || [],
          },
        },
      });

      if (!updatedAd) {
        throw new HttpException(
          createErrorResponse('Ad not found', 'The requested ad does not exist'),
          HttpStatus.NOT_FOUND,
        );
      }

      return createSuccessResponse(updatedAd, 'Ad updated successfully');
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Failed to update the ad', error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const deletedAd = await this.prisma.ad.delete({
        where: { id },
      });

      if (!deletedAd) {
        throw new HttpException(
          createErrorResponse('Ad not found', 'The requested ad does not exist'),
          HttpStatus.NOT_FOUND,
        );
      }

      return createSuccessResponse(deletedAd, 'Ad deleted successfully');
    } catch (error) {
      throw new HttpException(
        createErrorResponse('Failed to delete the ad', error.message),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
