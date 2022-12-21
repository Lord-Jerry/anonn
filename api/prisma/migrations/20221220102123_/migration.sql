/*
  Warnings:

  - Added the required column `conversation_username` to the `users_conversations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_conversations" ADD COLUMN     "conversation_username" VARCHAR(100) NOT NULL;
