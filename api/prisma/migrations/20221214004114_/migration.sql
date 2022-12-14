-- DropForeignKey
ALTER TABLE "poll_options" DROP CONSTRAINT "poll_options_pollId_fkey";

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_pollId_fkey" FOREIGN KEY ("pollId") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
