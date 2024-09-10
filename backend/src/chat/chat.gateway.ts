import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('userConnected')
  handleUserConnected(
    @MessageBody() data: { userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`User connected: ${data.userId}, socket: ${client.id}`);
    this.chatService.addUserSocket(data.userId, client.id);
    console.log('User socket stored');
  }

  @SubscribeMessage('notifyReceiver')
  notifyReceiver(
    @MessageBody() data: { receiverId: number; conversationId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Notifying receiver: ${data.receiverId}`);
    
    const receiverSocketId = this.chatService.getUserSocketId(data.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('notifyReceiver', {
        message: 'You have a new message',
        conversationId: data.conversationId,
      });
      console.log(`Notification sent to socket: ${receiverSocketId}`);
    } else {
      console.log('Receiver not connected, unable to send notification.');
    }
  }

  @SubscribeMessage('messageSeen')
async handleMessageSeen(
  @MessageBody() data: { messageId: number; userId: number },
  @ConnectedSocket() client: Socket,
) {
  const { messageId, userId } = data;
  console.log("in event messageSeen");
  console.log(`Message seen by user: ${userId}, message ID: ${messageId}`);
  
  // Update message to mark it as seen
  await this.chatService.markMessageAsSeen(messageId);

  // Notify the sender that the message has been seen
  const senderSocketId = this.chatService.getUserSocketId(userId);
  if (senderSocketId) {
    this.server.to(senderSocketId).emit('messageSeen', { messageId });
  }
}

    // Join a specific room
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
      client.join(room);
      console.log(`Client ${client.id} joined room: ${room}`);
      this.server.to(room).emit('userJoined', `User ${client.id} has joined the room`);
    }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { conversationId: number; senderId: number; receiverId: number; content: string },
  ) {
    // Save message to the database
    const message = await this.chatService.sendMessage(
      data.senderId,
      data.receiverId, 
      data.conversationId,
      data.content,
    );

    // Emit the message to the clients in the conversation
    this.server.to(data.conversationId.toString()).emit('send_message', message);
  }
}
