import { IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  name: string;

  @IsString()
  categoryId: string; // Assuming you want to validate the category relation
}
