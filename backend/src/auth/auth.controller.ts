import { Req, Body, Controller, Post, HttpStatus, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
import { Response, Request } from 'express';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly refreshTokenExpiry: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) {
    this.refreshTokenExpiry = parseInt(this.configService.get<string>('REFRESH_TOKEN_EXPIRY'), 10);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    try {
      const tokens = await this.authService.login(loginDto);

      // Store refresh token in Redis
      await this.redisService.set(`refreshToken:${tokens.refresh_token}`, tokens.refresh_token, this.refreshTokenExpiry);

      response.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      response.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return createSuccessResponse({ tokens }, 'Login successful');
    } catch (error) {
      return createErrorResponse(
        'Login failed',
        error.message || 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    try {
      const refreshToken = request.headers['authorization']?.split(' ')[1];

      // Check if the refresh token is valid and in Redis
      const storedToken = await this.redisService.get(`refreshToken:${refreshToken}`);
      if (storedToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newTokens = await this.authService.refreshToken(refreshToken);

      // Remove the old refresh token from Redis
      await this.redisService.del(`refreshToken:${refreshToken}`);

      // Store the new refresh token in Redis
      await this.redisService.set(`refreshToken:${newTokens.refresh_token}`, newTokens.refresh_token, this.refreshTokenExpiry);

      response.cookie('access_token', newTokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      response.cookie('refresh_token', newTokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
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
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    try {
      const refreshToken = request.cookies['refresh_token'];

      if (!refreshToken) {
        return createErrorResponse('No refresh token found', 'Refresh token is required for logout', HttpStatus.BAD_REQUEST);
      }

      await this.redisService.del(`refreshToken:${refreshToken}`);
      response.clearCookie('access_token');
      response.clearCookie('refresh_token');

      return createSuccessResponse({}, 'Logout successful');
    } catch (error) {
      return createErrorResponse(
        'Logout failed',
        error.message || 'Error during logout',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
