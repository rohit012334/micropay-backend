import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 8000,
  databaseUrl: process.env.DATABASE_URL,
  otpExpiryMinutes: Number(process.env.OTP_EXPIRY_MINUTES || 5),
  smsProvider: process.env.SMS_PROVIDER || "dummy",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  encryptionKey: process.env.ENCRYPTION_KEY || "32-byte-key-for-aes-256-cbc!!", // must be 32 chars for AES-256
};

if (!env.databaseUrl) {
  console.warn("DATABASE_URL is not set. Prisma will fail without it.");
}

export default env;
