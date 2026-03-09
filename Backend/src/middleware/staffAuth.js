import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { prisma } from "../config/prismaClient.js";

/**
 * Staff Authentication Middleware
 * Expects Authorization: Bearer <staff_token>
 * Sets req.staff = { id, role, email, ...permissions }
 */
export async function authenticateStaff(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Staff token required"));
    }

    const token = authHeader.slice(7);
    try {
        const payload = jwt.verify(token, env.jwtSecret);

        // For staff, we use a slightly different verification from regular users
        // We can still use the RefreshToken model or a separate StaffSession model
        // Here, we check if the staff exists and is active
        const staff = await prisma.staff.findUnique({
            where: { id: payload.staffId }
        });

        if (!staff) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Staff account not found or disabled"));
        }

        req.staff = staff;
        next();
    } catch (err) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired staff token"));
    }
}

/**
 * Permission Middleware Creator
 * Checks if the logged-in staff has the required permission
 */
export function authorize(permission) {
    return (req, res, next) => {
        if (!req.staff) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, "Staff authentication required"));
        }

        // Admins have all permissions
        if (req.staff.role === "ADMIN") {
            return next();
        }

        // Check specific permission for managers
        if (req.staff[permission] === true) {
            return next();
        }

        return next(new ApiError(httpStatus.FORBIDDEN, "Access denied: Insufficient permissions"));
    };
}
