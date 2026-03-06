import crypto from "crypto";
import env from "../config/env.js";

const ALGO = "aes-256-cbc";
const IV_LENGTH = 16;
const KEY = Buffer.from(env.encryptionKey.slice(0, 32).padEnd(32, "0"), "utf8");

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  let encrypted = cipher.update(String(text), "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

export function decrypt(combined) {
  const [ivHex, encrypted] = combined.split(":");
  if (!ivHex || !encrypted) return null;
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
