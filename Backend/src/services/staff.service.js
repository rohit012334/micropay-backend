import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { prisma } from "../config/prismaClient.js";

/** Authenticate Staff (Admin or Manager) */
export async function loginStaff(email, password) {
    const staff = await prisma.staff.findUnique({
        where: { email }
    });

    if (!staff) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid staff credentials");
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid staff credentials");
    }

    const token = jwt.sign(
        { staffId: staff.id, role: staff.role },
        env.jwtSecret,
        { expiresIn: "7d" }
    );

    // Staff tokens are JWT-only; RefreshToken table is for User sessions (userId FK to User)

    // ADMIN has full access; response should reflect that for frontend
    const isAdmin = String(staff.role).toUpperCase() === "ADMIN";
    const permissions = isAdmin
        ? {
            canManageUsers: true,
            canManageCards: true,
            canViewBills: true,
            canViewTaxes: true,
            canManageBanners: true,
            canManageFAQs: true,
            canSendNotifications: true
        }
        : {
            canManageUsers: staff.canManageUsers,
            canManageCards: staff.canManageCards,
            canViewBills: staff.canViewBills,
            canViewTaxes: staff.canViewTaxes,
            canManageBanners: staff.canManageBanners,
            canManageFAQs: staff.canManageFAQs,
            canSendNotifications: staff.canSendNotifications
        };

    return {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        permissions,
        token
    };
}

/** [ADMIN ONLY] Create a new Manager */
export async function createManager(adminId, data) {
    const admin = await prisma.staff.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== 'ADMIN') {
        throw new ApiError(httpStatus.FORBIDDEN, "Only admins can add managers");
    }

    const existing = await prisma.staff.findUnique({ where: { email: data.email } });
    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "Staff email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await prisma.staff.create({
        data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "MANAGER",
            // Permissions
            canManageUsers: data.canManageUsers || false,
            canManageCards: data.canManageCards || false,
            canViewBills: data.canViewBills || false,
            canViewTaxes: data.canViewTaxes || false,
            canManageBanners: data.canManageBanners || false,
            canManageFAQs: data.canManageFAQs || false,
            canSendNotifications: data.canSendNotifications || false
        }
    });
}

/** [ADMIN ONLY] Get all staff members */
export async function getAllManagers() {
    return await prisma.staff.findMany({
        where: { role: "MANAGER" },
        orderBy: { createdAt: "desc" }
    });
}

/** [ADMIN ONLY] Delete a staff member */
export async function deleteStaff(id) {
    return await prisma.staff.delete({ where: { id } });
}
