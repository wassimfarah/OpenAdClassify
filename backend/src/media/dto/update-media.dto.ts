import { IsString, IsEnum, IsOptional } from 'class-validator';
import { MediaType } from '@prisma/client';

export class UpdateMediaDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;
}
