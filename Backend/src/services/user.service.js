import crypto from "crypto";
import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const CHECK_IN_POINTS = 50;

function generateCinId() {
  return `CIN${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phoneNumber: true,
      email: true,
      profilePicture: true,
      cinId: true,
      referralCode: true,
      points: true,
      lastCheckInAt: true,
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return user;
}

export async function updateProfile(userId, data, file, baseUrl) {
    const { phoneNumber, countryCode = "+91" } = data;
  const updateData = {};

  // Phone number update
  if (phoneNumber !== undefined && phoneNumber !== "") {

    const fullPhone = `${countryCode}${phoneNumber}`;

    // Check duplicate — kisi aur ka toh nahi
    const existing = await prisma.user.findFirst({
      where: { phoneNumber : fullPhone, NOT: { id: userId } },
    });
    if (existing) {
      throw new ApiError(httpStatus.CONFLICT, "Phone number already in use");
    }
      updateData.phoneNumber = fullPhone;
  }

  // Profile picture — file aaya toh local path save karo
  if (file) {
    updateData.profilePicture = `${baseUrl}/uploads/profile/${file.filename}`;
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No valid fields to update");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      phoneNumber: true,
      profilePicture: true,
    },
  });

  return user;
}

export async function getAccountDetails(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { kyc: true },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const kyc = user.kyc;
  const panNumber =
    kyc && kyc.documentType === "PAN" ? kyc.documentNumber : null;
  return {
    fullName: kyc?.fullName ?? null,
    panNumber,
    loginNumber: user.phoneNumber,
  };
}

export async function getReferralCode(userId) {
  let user = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  if (!user.referralCode) {
    let code = crypto.randomBytes(4).toString("hex").toUpperCase();
    while (await prisma.user.findUnique({ where: { referralCode: code } })) {
      code = crypto.randomBytes(4).toString("hex").toUpperCase();
    }
    await prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });
    user = { referralCode: code };
  }
  return { referralCode: user.referralCode };
}

export async function getPoints(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  return { points: user.points };
}

export async function checkIn(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastCheckInAt: true, points: true },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastCheckIn = user.lastCheckInAt
    ? new Date(
        user.lastCheckInAt.getFullYear(),
        user.lastCheckInAt.getMonth(),
        user.lastCheckInAt.getDate()
      )
    : null;
  if (lastCheckIn && lastCheckIn.getTime() === todayStart.getTime()) {
    return {
      alreadyCheckedIn: true,
      points: user.points,
      message: "Already checked in today",
    };
  }
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      lastCheckInAt: now,
      points: { increment: CHECK_IN_POINTS },
    },
    select: { points: true, lastCheckInAt: true },
  });
  return {
    alreadyCheckedIn: false,
    points: updated.points,
    pointsEarned: CHECK_IN_POINTS,
    message: "Check-in successful",
  };
}

export async function getReferrals(userId) {
  const list = await prisma.user.findMany({
    where: { referredById: userId },
    select: {
      id: true,
      phoneNumber: true,
      createdAt: true,
    },
  });
  return { referrals: list };
}
