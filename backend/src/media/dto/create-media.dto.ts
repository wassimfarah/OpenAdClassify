import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { MediaType } from '@prisma/client';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsString()
  @IsNotEmpty()
  adId: string;  
}
