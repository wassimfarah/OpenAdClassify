// prisma/set-timezone.ts
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function setTimezone() {
  try {
    const timezone = process.env.DATABASE_TIMEZONE;
    await prisma.$executeRawUnsafe(`ALTER DATABASE "${process.env.DB_NAME}" SET timezone TO '${timezone}'`);
    console.log(`Database timezone set to ${timezone}`);
  } catch (error) {
    console.error('Error setting timezone:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setTimezone();
