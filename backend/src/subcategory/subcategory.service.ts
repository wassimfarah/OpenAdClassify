import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    return this.prisma.subcategory.create({
      data: createSubcategoryDto,
    });
  }

  async update(id: string, updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.prisma.subcategory.update({
      where: { id },
      data: updateSubcategoryDto,
    });
  }

  async findAll() {
    return this.prisma.subcategory.findMany();
  }

  async findOne(id: string) {
    return this.prisma.subcategory.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.subcategory.delete({
      where: { id },
    });
  }
}
