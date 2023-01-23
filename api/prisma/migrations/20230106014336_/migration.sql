-- CreateEnum
CREATE TYPE "Notification_channels" AS ENUM ('WEB', 'MOBILE');

-- CreateTable
CREATE TABLE "notification_channels" (
    "pId" UUID NOT NULL,
    "userId" INTEGER NOT NULL,
    "channel" "Notification_channels" NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_channels_pId_key" ON "notification_channels"("pId");

-- AddForeignKey
ALTER TABLE "notification_channels" ADD CONSTRAINT "notification_channels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
