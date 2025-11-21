-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "groupId" TEXT;

-- CreateIndex
CREATE INDEX "Message_groupId_idx" ON "Message"("groupId");
