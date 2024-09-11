/*
  Warnings:

  - You are about to drop the column `seenAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "seenAt" TIMESTAMP(3);

