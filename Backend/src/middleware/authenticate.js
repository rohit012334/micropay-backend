import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { prisma } from "../config/prismaClient.js";

/**
 * Protects routes: expects Authorization: Bearer <token>.
 * Sets req.user = { id: userId }.
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Token required"));
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret);

    // DB check: Verify if this specific token exists and is not expired
    const session = await prisma.refreshToken.findUnique({
      where: { token }
    });

    if (!session || session.expiresAt < new Date()) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, "Session expired or invalid. Please login again."));
    }

    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
  }
}
