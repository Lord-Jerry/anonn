/*
  Warnings:

  - You are about to drop the `users_conversations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users_conversations" DROP CONSTRAINT "users_conversations_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "users_conversations" DROP CONSTRAINT "users_conversations_userId_fkey";

-- DropTable
DROP TABLE "users_conversations";

-- CreateTable
CREATE TABLE "users_conversations" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'Anonymous',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_conversations_id_key" ON "users_conversations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_conversations_pId_key" ON "users_conversations"("pId");

-- AddForeignKey
ALTER TABLE "users_conversations" ADD CONSTRAINT "users_conversations_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_conversations" ADD CONSTRAINT "users_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
