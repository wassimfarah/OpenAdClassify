import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { convertUtcToOffset } from 'src/utils/common/time.util';
import {
  createSuccessResponse,
  createErrorResponse,
} from 'src/utils/common/response.util';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AdService {
  private readonly utcOffsetHours: number;

  constructor(private readonly prisma: PrismaService) {
    this.utcOffsetHours = parseInt(process.env.UTC_HOURS_OFFSET, 10);
  }
  async create(createAdDto: CreateAdDto) {
    try {
      const {
        title,
        description,
        price,
        minimumPrice,
        type,
        acceptOffer,
        acceptMessages,
        acceptExchange,
        location,
        adStatus,
        categoryId,
        subcategoryId,
        createdById,
        mediaIds,
      } = createAdDto;

      const ad = await this.prisma.ad.create({
        data: {
          title,
          description,
          price,
          minimumPrice,
          type,
          acceptOffer,
          acceptMessages,
          acceptExchange,
          location,
          adStatus,
          category: {
            connect: { id: categoryId },
          },
          subcategory: {
            connect: { id: subcategoryId },
          },
          createdBy: {
            connect: { id: createdById },
          },
          media: {
            connect: mediaIds?.map((id) => ({ id })) || [],
          },
        },
      });
      return createSuccessResponse(ad, 'Ad created successfully');
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
        include: {
          media: true, // Include the media field when fetching all ads
        },
      });

      // Convert timestamps to the desired timezone based on the UTC offset
      const adsWithConvertedTimes = ads.map((ad) => ({
        ...ad,
        createdAt: convertUtcToOffset(ad.createdAt, this.utcOffsetHours),
        updatedAt: convertUtcToOffset(ad.updatedAt, this.utcOffsetHours),
      }));

      return createSuccessResponse(adsWithConvertedTimes, 'Ads fetched successfully');
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
        include: {
          media: true, // Include the media field when fetching a specific ad
          createdBy: true, // Include the user who created the ad
        },
      });
      if (!ad) {
        throw new HttpException(
          createErrorResponse('Ad not found', 'The requested ad does not exist'),
          HttpStatus.NOT_FOUND,
        );
      }
      
      // Convert timestamps to the desired timezone based on the UTC offset
      const adWithConvertedTimes = {
        ...ad,
        createdAt: convertUtcToOffset(ad.createdAt, this.utcOffsetHours),
        updatedAt: convertUtcToOffset(ad.updatedAt, this.utcOffsetHours),
      };
 
      return createSuccessResponse(adWithConvertedTimes, 'Ad fetched successfully');
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
            connect: updateAdDto.mediaIds?.map((id) => ({ id })) || [],
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
