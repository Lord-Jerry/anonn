/*
  Warnings:

  - You are about to drop the `_conversationsTousers` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `conversations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_conversationsTousers" DROP CONSTRAINT "_conversationsTousers_A_fkey";

-- DropForeignKey
ALTER TABLE "_conversationsTousers" DROP CONSTRAINT "_conversationsTousers_B_fkey";

-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "creatorId" INTEGER NOT NULL,
ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "_conversationsTousers";

-- CreateTable
CREATE TABLE "users_conversations" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_conversations_id_key" ON "users_conversations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_conversations_pId_key" ON "users_conversations"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_id_key" ON "messages"("id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_pId_key" ON "messages"("pId");

-- AddForeignKey
ALTER TABLE "users_conversations" ADD CONSTRAINT "users_conversations_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_conversations" ADD CONSTRAINT "users_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
