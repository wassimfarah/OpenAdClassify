import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { AdType, AdStatus } from '@prisma/client';

export class UpdateAdDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  desiredPrice?: number;

  @IsOptional()
  @IsNumber()
  minimumPrice?: number;

  @IsOptional()
  @IsEnum(AdType)
  type?: AdType;

  @IsOptional()
  @IsBoolean()
  acceptOffer?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptMessages?: boolean;

  @IsOptional()
  @IsBoolean()
  acceptExchange?: boolean;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(AdStatus)
  adStatus?: AdStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  subcategoryId?: string;

  @IsOptional()
  @IsString()
  mediaIds?: string[];
}
