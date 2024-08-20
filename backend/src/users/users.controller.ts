import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express'; // Import Request type for TypeScript

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request) {
    // Access the user from the request object
    const user = request.user;

    // Return user information
    return { user };
  }
}
