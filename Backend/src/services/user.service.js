import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import env from "../config/env.js";
import { getSmsClient } from "../sms/smsClientFactory.js";

const CHECK_IN_POINTS = 50;

function generateCinId() {
  return `CIN${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

const OTP_LENGTH = 4;
const OTP_SALT_ROUNDS = 10;
const MPIN_SALT_ROUNDS = 10;

function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function getProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      kyc: { select: { fullName: true } },
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
  const { kyc, ...rest } = user;
  return { ...rest, name: kyc?.fullName ?? null };
}

export async function updateProfile(userId, data, file, baseUrl) {
  const { phoneNumber, countryCode = "+91" } = data;
  const updateData = {};

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, phoneNumber: true },
  });
  if (!currentUser) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // Profile picture — no OTP
  if (file) {
    updateData.profilePicture = `${baseUrl}/uploads/profile/${file.filename}`;
  }

  // Phone number update — only send OTP when changing to a different number
  let otpSentToNewNumber = false;
  if (phoneNumber !== undefined && phoneNumber !== "") {
    const fullPhone = `${countryCode}${phoneNumber}`;

    // Same number as current user → no change, no OTP
    if (fullPhone === currentUser.phoneNumber) {
       throw new ApiError(httpStatus.CONFLICT, "you are already using this phone number");
    } else {
      // Different number: check if already used by another user
      const existing = await prisma.user.findFirst({
        where: { phoneNumber: fullPhone, NOT: { id: userId } },
      });
      if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "Phone number already in use");
      }

      // Send OTP to new number; phone will be updated after verifyPhoneChange
      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
      const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

      await prisma.otp.create({
        data: {
          userId,
          codeHash: otpHash,
          expiresAt,
          newPhoneNumber: fullPhone,
        },
      });

      const smsClient = await getSmsClient();
      await smsClient.sendSms(
        fullPhone,
        `Welcome to Micrope Your verification code is ${otp} It is valid for 5 minutes. Please do not share this code with anyone. Karzpe Fintech Pvt Ltd`,
        { dltTemplateId: process.env.DLT_TEMPLATE_OTP_REGISTRATION }
      );
      otpSentToNewNumber = true;
    }
  }

  if (Object.keys(updateData).length === 0 && !otpSentToNewNumber) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No valid fields to update");
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      phoneNumber: true,
      profilePicture: true,
      email: true,
    },
  });

  return { ...user, otpSentToNewNumber };
}

export async function verifyPhoneChange(userId, otp) {
  const latestOtp = await prisma.otp.findFirst({
    where: {
      userId,
      consumedAt: null,
      newPhoneNumber: { not: null },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latestOtp) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No pending phone change OTP. Request a new one from update profile."
    );
  }

  if (latestOtp.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired. Please request a new one.");
  }

  const isMatch = await bcrypt.compare(otp, latestOtp.codeHash);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const [user] = await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { phoneNumber: latestOtp.newPhoneNumber },
      select: { id: true, phoneNumber: true, profilePicture: true, email: true },
    }),
    prisma.otp.update({
      where: { id: latestOtp.id },
      data: { consumedAt: new Date() },
    }),
  ]);

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
