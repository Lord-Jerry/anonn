/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `users_conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users_conversations" DROP COLUMN "updatedAt";
