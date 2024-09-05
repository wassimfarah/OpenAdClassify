import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChatService, ChatGateway, AccessTokenAuthGuard, JwtService, PrismaService],
  controllers: [ChatController]
})
export class ChatModule {}
