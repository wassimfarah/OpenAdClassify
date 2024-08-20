import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.generateRefreshToken(user.id),
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        access_token: this.jwtService.sign({ sub: user.id, username: user.username }),
        refresh_token: this.generateRefreshToken(user.id),
      };
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }

  private generateRefreshToken(userId: number) {
    return this.jwtService.sign({ sub: userId }, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' });
  }
}
