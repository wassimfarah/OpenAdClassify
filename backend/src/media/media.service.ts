import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

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
    return this.prisma.media.findMany();
  }

  async findOne(id: string) {
    return this.prisma.media.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.media.delete({
      where: { id },
    });
  }
}
