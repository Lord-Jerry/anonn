/*
  Warnings:

  - You are about to drop the column `picture` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "picture",
ADD COLUMN     "avatar" TEXT;
