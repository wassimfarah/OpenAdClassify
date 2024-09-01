// src/auth/guards/refresh-token-auth.guard.ts

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.['refresh_token']; // Retrieve refresh_token from cookies

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const secretKey = this.configService.get<string>('JWT_REFRESH_SECRET');
      const payload = this.jwtService.verify(refreshToken, { secret: secretKey });
      
      // Attach both the decoded token payload and the refresh token itself
      request.user = { ...payload, refreshToken }; 

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

