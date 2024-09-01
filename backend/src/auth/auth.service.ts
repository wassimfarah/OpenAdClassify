import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly refreshTokenExpiry: number;
  private readonly accessTokenExpiry: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtAccessSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.refreshTokenExpiry = parseInt(this.configService.get<string>('REFRESH_TOKEN_EXPIRY'), 10);
    this.accessTokenExpiry = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    this.jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.jwtAccessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user.id, user.username, user.role);
    await this.storeRefreshToken(tokens.refresh_token);

    return tokens;
  }

  async refreshToken(token: string) {
    const storedToken = await this.redisService.get(`refreshToken:${token}`);
    if (storedToken !== token) {
      throw new ForbiddenException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(token, { secret: this.jwtRefreshSecret });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user) throw new UnauthorizedException('Invalid refresh token');

      const tokens = this.generateTokens(user.id, user.username, user.role);

      await this.redisService.del(`refreshToken:${storedToken}`);
      await this.storeRefreshToken(tokens.refresh_token);

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string, response: Response) {
    await this.redisService.del(`refreshToken:${refreshToken}`);
    this.clearAuthCookies(response);
  }

  private generateTokens(userId: number, username: string, role: string) {
    const payload = { sub: userId, username, role };
    const accessToken = this.jwtService.sign(payload, { secret: this.jwtAccessSecret, expiresIn: this.accessTokenExpiry });
    const refreshToken = this.jwtService.sign({ sub: userId }, { secret: this.jwtRefreshSecret, expiresIn: this.refreshTokenExpiry });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  private async storeRefreshToken(refreshToken: string) {
    await this.redisService.set(`refreshToken:${refreshToken}`, refreshToken, this.refreshTokenExpiry);
  }

  // Methods for handling cookies
  setAuthCookies(response: Response, tokens: { access_token: string; refresh_token: string }) {
    const isProduction = process.env.NODE_ENV === 'production';
    response.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
    response.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    });
  }

  clearAuthCookies(response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  }
}
