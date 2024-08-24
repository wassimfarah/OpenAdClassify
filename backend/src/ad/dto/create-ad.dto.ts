import { IsString, IsNumber, IsBoolean, IsEnum, IsOptional, IsInt } from 'class-validator';
import { AdType, AdStatus } from '@prisma/client';

export class CreateAdDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  desiredPrice: number;

  @IsNumber()
  minimumPrice: number;

  @IsEnum(AdType)
  type: AdType;

  @IsBoolean()
  acceptOffer: boolean;

  @IsBoolean()
  acceptMessages: boolean;

  @IsBoolean()
  acceptExchange: boolean;

  @IsString()
  location: string;

  @IsEnum(AdStatus)
  adStatus: AdStatus;

  @IsString()
  categoryId: string;

  @IsString()
  subcategoryId: string;

  @IsInt()
  createdById: number; // Added this to match your schema where `createdById` is an integer

  @IsOptional()
  @IsString({ each: true })
  mediaIds?: string[];

  @IsOptional()
  @IsInt()
  numberOfImpressions?: number = 0; // Default is 0, but can be overridden if provided

  // Timestamps are usually handled automatically by Prisma, but you can include them if needed
  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
