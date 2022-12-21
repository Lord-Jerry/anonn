-- AlterTable
ALTER TABLE "users_conversations" ADD COLUMN     "hasNewMessage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastReadMessageId" INTEGER;
