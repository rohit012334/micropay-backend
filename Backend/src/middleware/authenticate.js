import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

/**
 * Protects routes: expects Authorization: Bearer <token>.
 * Sets req.user = { id: userId }.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Token required"));
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = { id: payload.userId };
    next();
  } catch (err) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
  }
}
