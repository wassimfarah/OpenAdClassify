import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
@Module({
  imports: [PrismaModule, RedisModule],
  providers: [UsersService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
