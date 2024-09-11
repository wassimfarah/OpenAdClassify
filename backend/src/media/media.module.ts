import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { JwtService } from '@nestjs/jwt';
@Module({
  controllers: [MediaController],
  providers: [MediaService, PrismaService, AccessTokenAuthGuard, JwtService],
})
export class MediaModule {}
