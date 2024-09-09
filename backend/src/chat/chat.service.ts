import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import your Prisma service
import { createSuccessResponse, createErrorResponse } from 'src/utils/common/response.util';
@Injectable()
export class ChatService {
  private userSocketMap: Map<number, string> = new Map(); // Map of userId to socketId

  constructor(private readonly prisma: PrismaService) {}
 
  // Store user's socket ID when they connect
  addUserSocket(userId: number, socketId: string) {
    this.userSocketMap.set(userId, socketId);
  }

    // Remove user's socket ID when they disconnect
    removeUserSocket(socketId: string) {
      for (const [userId, id] of this.userSocketMap.entries()) {
        if (id === socketId) {
          this.userSocketMap.delete(userId);
          break;
        }
      }
    }

    // Retrieve user's socket ID
    getUserSocketId(userId: number): string | undefined {
      return this.userSocketMap.get(userId);
    }

  // Method to create or find a conversation
  async createOrFindConversation(userIds: number[], adId: string): Promise<any> {
    if (userIds.length !== 2) {
      throw new Error('Exactly two user IDs are required');
    }

    // Note: userID1 is the sender
    const [userId1, userId2] = userIds;

    // Check if a conversation already exists with the provided user IDs and ad ID
    let conversation = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                id: userId1,
              },
            },
          },
          {
            participants: {
              some: {
                id: userId2,
              },
            },
          },
          {
            adId: adId,
          },
        ],
      },
    });

    // If conversation exists, return it
    if (conversation) {
        console.log("conversation exits! : ", conversation)
      return createSuccessResponse({conversation, userSenderId: userId1}, "success conversation fetching, exists, returning the conversation.");
    }

    // If no conversation exists, create a new one
    console.log("conversation doesn't exist")
    conversation = await this.prisma.conversation.create({
      data: {
        participants: {
          connect: userIds.map(id => ({ id })),
        },
        adId: adId,
      },
    });

    console.log("conversation: ", conversation)
    return createSuccessResponse({conversation, userSenderId: userId1}, "success conversation new creating,  returning the conversation.");
}

  async sendMessage(
    senderId: number,
    receiverId: number,
    conversationId: number,
    content: string,
  ) {
    // Save the message in the database
    const message = await this.prisma.message.create({
      data: {
        senderId: senderId,
        receiverId: receiverId,
        conversationId: conversationId,
        content: content,
      },
    });

    // Fetch the sender's details (e.g., username)
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicture: true,
      },
    });

    // Combine the message with the sender's details
    const messageWithSenderDetails = {
      ...message,
      sender,
    };

    return createSuccessResponse(messageWithSenderDetails, 'Message sent successfully.');
  }
      
  async getConversations(userId: number) {
    // Fetch conversations for the user, including ad details and last message
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        ad: true, // Include the related ad in the result
        participants: true, // Optional: Include participants if needed
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1, // Only get the last message
          select: {
            id: true,
            content: true,
            isRead: true,
            createdAt: true,
            receiverId: true, // Include receiverId in the last message selection
          },
        },
      },
    });
  
    // Map conversations to include lastMessage directly
    const result = conversations.map(conversation => {
      const lastMessage = conversation.messages[0] || null;
      return {
        ...conversation,
        lastMessage, // Add last message field to the response
      };
    });
  
    return createSuccessResponse(result, "All conversations associated with the user fetched");
  }
  
  

  async getMessages(conversationId: number): Promise<any> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  
    return createSuccessResponse(messages, "Messages fetched successfully along with user details.");
  }

  async markMessageAsRead(conversationId: number, messageId: number) {
    await this.prisma.message.updateMany({
      where: {
        conversationId: conversationId,
        id: messageId,
        isRead: false, // Optional check to update only if not already read
      },
      data: {
        isRead: true,
      },
    });
  }

  async markMessageAsSeen(messageId: number): Promise<void> {
    await this.prisma.message.update({
      where: { id: messageId },
      data: { seenAt: new Date(), isRead: true },
    });
  }
  
  
}




