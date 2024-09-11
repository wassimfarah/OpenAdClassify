import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsInt } from 'class-validator';
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
  minimumPrice?: number;

  @IsOptional()
  @IsEnum(AdType)
  type?: AdType;

  @IsOptional() 
  @IsBoolean()
  acceptMessages: boolean;

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
  @IsInt()
  createdById?: number;

  @IsOptional()
  @IsString({ each: true })
  mediaIds?: string[];

  @IsOptional()
  updatedAt?: Date;
}
