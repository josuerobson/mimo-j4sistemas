-- AlterTable
ALTER TABLE "chat_conversations" ADD COLUMN "visitorPhone" TEXT;
ALTER TABLE "chat_conversations" ADD COLUMN "leadId" TEXT;

-- CreateIndex
CREATE INDEX "chat_conversations_leadId_idx" ON "chat_conversations"("leadId");

-- AddForeignKey
ALTER TABLE "chat_conversations" ADD CONSTRAINT "chat_conversations_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;