-- CreateEnum
CREATE TYPE "User_conversation_status" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED');

-- AlterTable
ALTER TABLE "users_conversations" ADD COLUMN     "status" "User_conversation_status" NOT NULL DEFAULT 'ACTIVE';
