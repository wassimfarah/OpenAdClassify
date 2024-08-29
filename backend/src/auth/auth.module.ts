import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure environment variables are loaded
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY')
        },
      }),
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, RedisService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
