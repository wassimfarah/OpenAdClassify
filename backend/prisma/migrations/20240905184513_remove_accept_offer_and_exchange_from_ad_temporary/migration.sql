/*
  Warnings:

  - You are about to drop the column `acceptExchange` on the `Ad` table. All the data in the column will be lost.
  - You are about to drop the column `acceptOffer` on the `Ad` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ad" DROP COLUMN "acceptExchange",
DROP COLUMN "acceptOffer";
