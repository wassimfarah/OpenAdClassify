import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { convertUtcToOffset } from 'src/utils/common/time.util';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Buffer } from 'buffer';
import { promises as fs } from 'fs';

dotenv.config();

@Injectable()
export class MediaService {
  private readonly utcOffsetHours: number;
  private readonly uploadsPath = join(__dirname, '..', '..', '..', 'uploads');

  constructor(private readonly prisma: PrismaService) {
    this.utcOffsetHours = parseInt(process.env.UTC_HOURS_OFFSET, 10);
  }

  async create(createMediaDto: CreateMediaDto) {
    const { url, type, adId } = createMediaDto;  // Include adId in the destructuring
    return this.prisma.media.create({
      data: {
        url,
        type,
        ad: {
          connect: { id: adId },  
        },
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
  
  async remove(id: string): Promise<void> {
  
    // Retrieve media record from database
    const media = await this.prisma.media.findUnique({ where: { id } });
  
    if (!media) {
      throw new NotFoundException('Media not found');
    }
  
  
      // Construct the file path directly from media.url
  const filePath = join(__dirname, '..', '..', '..', media.url.replace(/^\//, ''));
    try {
      // Check if file exists and then delete
      if (await fs.access(filePath).then(() => true).catch(() => false)) {
        await fs.unlink(filePath);
      } else {
      }
    } catch (error) {
      console.error(`Failed to delete file at path: ${filePath}`, error);
      throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  
    // Remove media record from database
    await this.prisma.media.delete({ where: { id } });
  }
  
  async deleteFile(fileUrl: string) {
   const filePath = fileUrl
    try {
      if (existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
      throw new HttpException('Failed to delete file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  // New file handling methods

  async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async getBase64Image(filename: string): Promise<string> {
    const filePath = join(this.uploadsPath, filename);
    if (!existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    // Create a read stream from the file
    const fileStream = createReadStream(filePath);
    // Convert the file stream to a buffer
    const fileBuffer = await this.streamToBuffer(fileStream);
    // Convert the buffer to a Base64 string
    return fileBuffer.toString('base64');
  }
}
