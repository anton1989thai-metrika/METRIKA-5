-- Add IMAP UID and mailbox tracking
ALTER TABLE "Email" ADD COLUMN "imapUid" INTEGER;
ALTER TABLE "Email" ADD COLUMN "imapMailbox" TEXT;

DROP INDEX IF EXISTS "Email_userId_messageId_key";
DROP INDEX IF EXISTS "Email_userId_imapMailbox_imapUid_idx";

CREATE UNIQUE INDEX "Email_userId_imapMailbox_imapUid_key" ON "Email"("userId", "imapMailbox", "imapUid");
