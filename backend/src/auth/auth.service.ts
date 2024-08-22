import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id, user.username, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.generateAccessToken(user.id, user.username, user.role);
      const refreshToken = this.generateRefreshToken(user.id);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateAccessToken(userId: number, username: string, role: string) {
    const payload = { sub: userId, username, role };
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    return this.jwtService.sign(payload, { expiresIn });
  }

  private generateRefreshToken(userId: number) {
    const payload = { sub: userId };
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return this.jwtService.sign(payload, { secret, expiresIn });
  }
}
