/*
  Warnings:

  - You are about to drop the column `username` on the `users_conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users_conversations" DROP COLUMN "username",
ADD COLUMN     "title" VARCHAR(100) NOT NULL DEFAULT 'Anonymous';
