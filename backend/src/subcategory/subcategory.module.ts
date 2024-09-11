import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryController } from './subcategory.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SubcategoryController],
  providers: [SubcategoryService, PrismaService],
})
export class SubcategoryModule {}
