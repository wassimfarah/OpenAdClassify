import { Body, Controller, Post, Get, UseGuards, Req, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util'; // Adjust the import path if needed

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.register(createUserDto);
      return createSuccessResponse(user, 'User registered successfully');
    } catch (error) {
      return createErrorResponse('User registration failed', error.message);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: Request) {
    // Access the user from the request object
    const user = request.user as { sub: number }; // Ensure TypeScript knows the user structure

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      // Fetch user details from the database
      const userProfile = await this.usersService.findUserById(user.sub);
      if (!userProfile) {
        throw new NotFoundException('User not found');
      }

      // Return user information
      return createSuccessResponse(userProfile, 'User profile retrieved successfully');
    } catch (error) {
      return createErrorResponse('Failed to retrieve user profile', error.message);
    }
  }
}
