import { Body, Controller, Post, Get, UseGuards, Req, UnauthorizedException, NotFoundException, Patch } from '@nestjs/common';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Request } from 'express';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util'; // Adjust the import path if needed
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/commun/decorators ';

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
  @UseGuards(AccessTokenAuthGuard)
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

  @Get('pending-messages/count')
  @UseGuards(AccessTokenAuthGuard)
  async getPendingMessageCount(@Req() request: Request) {
    const user = request.user as { sub: number };

    if (!user || !user.sub) {
      throw new UnauthorizedException('User not authenticated');
    }

    try {
      const userProfile = await this.usersService.findUserById(user.sub);
      return createSuccessResponse({ count: userProfile.pendingMessageCount }, 'Pending message count retrieved successfully');
    } catch (error) {
      return createErrorResponse('Failed to retrieve pending message count', error.message);
    }
  }

  @Post('pending-messages/count')
  @UseGuards(AccessTokenAuthGuard)
  async incrementPendingMessageCount(@Body() body: { userId: number }) {
    const { userId } = body;
  
    if (!userId) {
      throw new UnauthorizedException('User ID must be provided');
    }
  
    try {
      // Increment the pending message count by 1
      await this.usersService.incrementPendingMessageCountByOne(userId);
  
      return createSuccessResponse(null, 'Pending message count incremented successfully');
    } catch (error) {
      return createErrorResponse('Failed to increment pending message count', error.message);
    }
  }
  
@Patch('pending-messages/reset')
@UseGuards(AccessTokenAuthGuard)
async resetPendingMessageCount(@Req() request: Request) {

  const user = request.user as { sub: number };
console.log("reseting count!!!")

  if (!user || !user.sub) {
    throw new UnauthorizedException('User not authenticated');
  }

  try {
    await this.usersService.resetPendingMessageCount(user.sub);
    return createSuccessResponse(null, 'Pending message count reset successfully');
  } catch (error) {
    return createErrorResponse('Failed to reset pending message count', error.message);
  }
}

  @Post('admin-only')
  @UseGuards(AccessTokenAuthGuard, RolesGuard)
  @Roles('admin') // Only 'admin' can access this route
  adminOnlyAction(@Req() request) {
    return { message: 'Admin action performed' };
  }
}
