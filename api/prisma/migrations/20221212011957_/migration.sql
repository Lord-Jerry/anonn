-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "picture" DROP NOT NULL;
