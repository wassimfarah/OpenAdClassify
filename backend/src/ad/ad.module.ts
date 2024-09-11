import { Module } from '@nestjs/common';
import { AdController } from './ad.controller';
import { AdService } from './ad.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { MediaService } from 'src/media/media.service';

@Module({
  controllers: [AdController],
  providers: [AdService, PrismaService, JwtService, AccessTokenAuthGuard, MediaService]
})
export class AdModule {}
