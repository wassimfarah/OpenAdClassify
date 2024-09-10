import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client'; // Import UserRole enum
import { convertUtcToOffset } from 'src/utils/common/time.util';

@Injectable()
export class UsersService {
  private readonly utcOffsetHours: number;

  constructor(private prisma: PrismaService) {
    this.utcOffsetHours = parseInt(process.env.UTC_HOURS_OFFSET, 10);
  }


  async register(createUserDto: CreateUserDto) {
    const { username, email, password, phoneNumber } = createUserDto;

    // Check if the username or email already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username or email already taken.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phoneNumber,
        role: UserRole.USER, // Use the UserRole enum
      },
    });
  }

  // New findUserById method
  async findUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        ads: true, 
      },
    });

    // Convert timestamps to the desired timezone
    const userWithConvertedTimes = {
      ...user,
      createdAt: convertUtcToOffset(user.createdAt, this.utcOffsetHours),
      updatedAt: convertUtcToOffset(user.updatedAt, this.utcOffsetHours),
    };

    return userWithConvertedTimes;
  }

  async incrementPendingMessageCountByOne(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { pendingMessageCount: { increment: 1 } }, // Increment the count by 1
    });
  }

  async resetPendingMessageCount(userId: number): Promise<void> {
    console.log("count reset!")
    await this.prisma.user.update({
      where: { id: userId },
      data: { pendingMessageCount: 0 }, // Reset the count to zero
    });
  }
  
}
