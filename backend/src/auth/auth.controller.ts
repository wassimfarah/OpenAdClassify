import { Body, Controller, Post, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const tokens = await this.authService.login(loginDto);
      return createSuccessResponse(tokens, 'Login successful');
    } catch (error) {
      return createErrorResponse(
        'Login failed',
        error.message || 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    try {
      const newTokens = await this.authService.refreshToken(refreshToken);
      return createSuccessResponse(newTokens, 'Token refreshed successfully');
    } catch (error) {
      return createErrorResponse(
        'Token refresh failed',
        error.message || 'Invalid refresh token',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
