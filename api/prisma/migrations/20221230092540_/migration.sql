-- AlterTable
ALTER TABLE "users" ADD COLUMN     "referrerId" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
