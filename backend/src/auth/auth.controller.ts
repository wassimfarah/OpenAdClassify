import { Req, Body, Controller, Post, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
import { Response, Request } from 'express';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { RefreshTokenAuthGuard } from 'src/guards/refresh-token-auth.guard';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from 'src/types/jwt-payload';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Inject UsersService

  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    try {
      const tokens = await this.authService.login(loginDto);

      this.authService.setAuthCookies(response, tokens);

      return createSuccessResponse({ tokens }, 'Login successful');
    } catch (error) {
      return createErrorResponse(
        'Login failed',
        error.message || 'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(RefreshTokenAuthGuard)
  @Post('refresh')
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    try {
      const { refreshToken } = request.user as any;
      const newTokens = await this.authService.refreshToken(refreshToken);

      this.authService.setAuthCookies(response, newTokens);

      return createSuccessResponse({}, 'Token refreshed successfully');
    } catch (error) {
      return createErrorResponse(
        'Token refresh failed',
        error.message || 'Invalid refresh token',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Get('verify-cookie')
  @UseGuards(AccessTokenAuthGuard)
  async verifyAccessTokenFromCookie(@Req() request: Request) {

    const user = request.user as JwtPayload; // Cast to JwtPayload
   // const userDetails = await this.usersService.findUserById(user.sub)
    return { message: 'Access Token from cookie is valid', loggedIn: true, user };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response, @Req() request: Request) {
    try {
      const refreshToken = request.cookies['refresh_token'];
      if (!refreshToken) {
        return createErrorResponse('No refresh token found', 'Refresh token is required for logout', HttpStatus.BAD_REQUEST);
      }

      await this.authService.logout(refreshToken, response);

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
