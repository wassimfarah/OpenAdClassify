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
  createdById: number; 

  @IsOptional()
  @IsString({ each: true })
  mediaIds?: string[];

  @IsOptional()
  @IsInt()
  numberOfImpressions?: number = 0; 

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
