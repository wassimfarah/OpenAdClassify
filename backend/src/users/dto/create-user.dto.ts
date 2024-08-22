import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn  } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  // @IsString()
  // @IsNotEmpty()
  // @IsIn(['user', 'admin']) // Validate that role is either 'user' or 'admin'
  // role: 'user' | 'admin'; // Ensure the role is one of these values
}
