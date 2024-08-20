import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService, // Inject ConfigService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };

    // Retrieve token expiration from environment variables
    const accessTokenExpiry = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    const refreshTokenExpiry = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: accessTokenExpiry }),
      refresh_token: this.generateRefreshToken(user.id, refreshTokenExpiry),
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: this.configService.get<string>('JWT_REFRESH_SECRET') });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Retrieve token expiration from environment variables
      const accessTokenExpiry = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
      const refreshTokenExpiry = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');

      return {
        access_token: this.jwtService.sign({ sub: user.id, username: user.username }, { expiresIn: accessTokenExpiry }),
        refresh_token: this.generateRefreshToken(user.id, refreshTokenExpiry),
      };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateRefreshToken(userId: number, refreshTokenExpiry: string) {
    return this.jwtService.sign({ sub: userId }, { secret: this.configService.get<string>('JWT_REFRESH_SECRET'), expiresIn: refreshTokenExpiry });
  }
}
