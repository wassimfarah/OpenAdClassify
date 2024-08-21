import { Body, Controller, Post, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    try {
      const tokens = await this.authService.login(loginDto);

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'lax', // Adjust as needed
      });

      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'lax', // Adjust as needed
      });
      return createSuccessResponse({}, 'Login successful');
    } catch (error) {
      return createErrorResponse(
        'Login failed',
        error.message || 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string, @Res({ passthrough: true }) response: Response) {
    try {
      const newTokens = await this.authService.refreshToken(refreshToken);

      response.cookie('access_token', newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'lax', // Adjust as needed
      });

      response.cookie('refresh_token', newTokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        sameSite: 'lax', // Adjust as needed
      });

      return createSuccessResponse({}, 'Token refreshed successfully');
    } catch (error) {
      return createErrorResponse(
        'Token refresh failed',
        error.message || 'Invalid refresh token',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return createSuccessResponse({}, 'Logout successful');
  }
}
