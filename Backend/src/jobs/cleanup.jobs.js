import { prisma } from "../config/prismaClient.js";

/**
 * Deletes idempotency keys that have passed their expiry time.
 */
export const cleanupExpiredKeys = async () => {
    try {
        const { count } = await prisma.idempotencyKey.deleteMany({
            where: { expiresAt: { lt: new Date() } }
        });
        if (count > 0) {
            console.log(`[Idempotency Cleanup] Deleted ${count} expired keys`);
        }
    } catch (error) {
        console.error("[Idempotency Cleanup] Error:", error.message);
    }
};

/**
 * Deletes OTPs that have expired or been consumed.
 */
export const cleanupOldOtps = async () => {
    try {
        const { count } = await prisma.otp.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { consumedAt: { not: null } }
                ]
            }
        });
        if (count > 0) {
            console.log(`[OTP Cleanup] Deleted ${count} old/consumed OTPs`);
        }
    } catch (error) {
        console.error("[OTP Cleanup] Error:", error.message);
    }
};

/**
 * Deletes expired sessions (Refresh Tokens).
 */
export const cleanupOldSessions = async () => {
    try {
        const { count } = await prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() } }
        });
        if (count > 0) {
            console.log(`[Session Cleanup] Deleted ${count} expired refresh tokens`);
        }
    } catch (error) {
        console.error("[Session Cleanup] Error:", error.message);
    }
};
