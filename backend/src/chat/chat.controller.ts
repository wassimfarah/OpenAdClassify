import { Controller, Post, Get, Body, Param, Req, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessTokenAuthGuard } from 'src/guards/access-token-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AccessTokenAuthGuard)
  @Post('create-or-find-conversation')
  async createOrFindConversation(
    @Body() body: { userIds: number; adId: string },
    @Req() req
  ) {
    const senderId = req.user.sub; 
    const receiverId = body.userIds; 
    console.log(senderId, receiverId, body)

    return this.chatService.createOrFindConversation([senderId, receiverId], body.adId);
  }

  @UseGuards(AccessTokenAuthGuard)
  @Get('conversations')
  async getConversations(@Req() req) {
    const userId = req.user.sub; // Authenticated user's ID
    return this.chatService.getConversations(userId);
  }

@UseGuards(AccessTokenAuthGuard)
@Get('messages/:conversationId')
async getMessages(@Param('conversationId') conversationId: string, @Req() req) {
  const userId = req.user.sub; 
  return this.chatService.getMessages(Number(conversationId)); 
}

@UseGuards(AccessTokenAuthGuard)
@Patch('mark-message-read/:conversationId/:messageId')
async markMessageAsRead(
  @Param('conversationId') conversationId: string,
  @Param('messageId') messageId: string,
  @Req() req
) {
  const userId = req.user.sub; // Current user's ID
  return this.chatService.markMessageAsRead(Number(conversationId), Number(messageId));
}


}
