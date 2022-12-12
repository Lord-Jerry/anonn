/*
  Warnings:

  - You are about to drop the `secrets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `secrets_reactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "secrets" DROP CONSTRAINT "secrets_userId_fkey";

-- DropForeignKey
ALTER TABLE "secrets_reactions" DROP CONSTRAINT "secrets_reactions_secretId_fkey";

-- DropForeignKey
ALTER TABLE "secrets_reactions" DROP CONSTRAINT "secrets_reactions_userId_fkey";

-- DropTable
DROP TABLE "secrets";

-- DropTable
DROP TABLE "secrets_reactions";

-- CreateTable
CREATE TABLE "journals" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_reactions" (
    "id" SERIAL NOT NULL,
    "pId" UUID NOT NULL,
    "journalId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "love" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journal_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "journals_id_key" ON "journals"("id");

-- CreateIndex
CREATE UNIQUE INDEX "journals_pId_key" ON "journals"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_reactions_id_key" ON "journal_reactions"("id");

-- CreateIndex
CREATE UNIQUE INDEX "journal_reactions_pId_key" ON "journal_reactions"("pId");

-- CreateIndex
CREATE UNIQUE INDEX "journal_reactions_journalId_userId_key" ON "journal_reactions"("journalId", "userId");

-- AddForeignKey
ALTER TABLE "journals" ADD CONSTRAINT "journals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_reactions" ADD CONSTRAINT "journal_reactions_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_reactions" ADD CONSTRAINT "journal_reactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
