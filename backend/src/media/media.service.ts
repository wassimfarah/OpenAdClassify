import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { convertUtcToOffset } from 'src/utils/common/time.util';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MediaService {
  private readonly utcOffsetHours: number;

  constructor(private readonly prisma: PrismaService) {
    this.utcOffsetHours = parseInt(process.env.UTC_HOURS_OFFSET, 10);
  }

  async create(createMediaDto: CreateMediaDto) {
    const { url, type } = createMediaDto;
    return this.prisma.media.create({
      data: {
        url,
        type,
      },
    });
  }

  async update(id: string, updateMediaDto: UpdateMediaDto) {
    return this.prisma.media.update({
      where: { id },
      data: updateMediaDto,
    });
  }

  async findAll() {
    const mediaList = await this.prisma.media.findMany();
    return mediaList.map(media => ({
      ...media,
      createdAt: convertUtcToOffset(media.createdAt, this.utcOffsetHours),
      updatedAt: convertUtcToOffset(media.updatedAt, this.utcOffsetHours),
    }));
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return {
      ...media,
      createdAt: convertUtcToOffset(media.createdAt, this.utcOffsetHours),
      updatedAt: convertUtcToOffset(media.updatedAt, this.utcOffsetHours),
    };
  }

  async remove(id: string) {
    return this.prisma.media.delete({
      where: { id },
    });
  }
}
