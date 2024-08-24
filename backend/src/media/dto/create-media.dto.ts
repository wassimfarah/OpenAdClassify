import { IsString, IsEnum } from 'class-validator';
import { MediaType } from '@prisma/client';

export class CreateMediaDto {
  @IsString()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;
}
