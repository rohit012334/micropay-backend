-- DropForeignKey
ALTER TABLE "KycDraft" DROP CONSTRAINT "KycDraft_otpId_fkey";

-- AlterTable
ALTER TABLE "idempotency_keys" ALTER COLUMN "expiresAt" SET DEFAULT (NOW() + INTERVAL '24 hours');

-- AddForeignKey
ALTER TABLE "KycDraft" ADD CONSTRAINT "KycDraft_otpId_fkey" FOREIGN KEY ("otpId") REFERENCES "Otp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
