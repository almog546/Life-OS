-- DropForeignKey
ALTER TABLE "TimeLog" DROP CONSTRAINT "TimeLog_focusId_fkey";

-- AlterTable
ALTER TABLE "TimeLog" ALTER COLUMN "focusId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_focusId_fkey" FOREIGN KEY ("focusId") REFERENCES "Focus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
