import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prismaClient.js";
import env from "../config/env.js";
import { getSmsClient } from "../sms/smsClientFactory.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

/** Generate unique referral code (e.g. 8-char alphanumeric). */
function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

function generateCinId() {
  return Math.floor(10000000000 + Math.random() * 90000000000).toString();
}

const OTP_LENGTH = 4;
const OTP_SALT_ROUNDS = 10;
const MPIN_SALT_ROUNDS = 10;

function generateOtp() {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

// function generateOtp() {
//   return "1234";
// }

export async function loginuser(phoneNumber, countryCode, mpin) {
  const fullPhone = `${countryCode}${phoneNumber}`;

  const user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.isPhoneVerified) {
    throw new ApiError(httpStatus.NOT_FOUND, "User is not verified");
  }

  if (!user.mpinHash) {
    throw new ApiError(httpStatus.BAD_REQUEST, "MPIN not set for this user");
  }

  const isMatch = await bcrypt.compare(mpin, user.mpinHash);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid MPIN");
  }

  const token = jwt.sign(
    { userId: user.id },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  // Store token in DB for session verification
  await prisma.refreshToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { phoneNumber: fullPhone, token, userId: user.id };
}

const REFERRAL_POINTS_PER_SIGNUP = Number(process.env.REFERRAL_POINTS_PER_SIGNUP) || 100;

export async function sendOtpForPhone(phoneNumber, countryCode = "+91", referralCodeInput) {
  const fullPhone = `${countryCode}${phoneNumber}`;

  let user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    let newUserReferralCode = generateReferralCode();
    while (await prisma.user.findUnique({ where: { referralCode: newUserReferralCode } })) {
      newUserReferralCode = generateReferralCode();
    }
    user = await prisma.user.create({
      data: {
        phoneNumber: fullPhone,
        referralCode: newUserReferralCode,
      },
    });
  }

  if (user.isPhoneVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number is already verified");
  }

  let referrerId = null;
  const code = typeof referralCodeInput === "string" ? referralCodeInput.trim().toUpperCase() : "";
  if (code) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!referrer) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid referral code");
    }
    if (referrer.id === user.id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "You cannot use your own referral code");
    }
    referrerId = referrer.id;
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  await prisma.otp.create({
    data: {
      userId: user.id,
      codeHash: otpHash,
      expiresAt,
      ...(referrerId && { referrerId }),
    },
  });

  const smsClient = await getSmsClient();
  await smsClient.sendSms(
  fullPhone,
  `Welcome to Micrope Your verification code is ${otp} It is valid for 5 minutes. Please do not share this code with anyone. Karzpe Fintech Pvt Ltd`,
  { dltTemplateId: process.env.DLT_TEMPLATE_OTP_REGISTRATION }
);

  return { phoneNumber: fullPhone, expiresAt, otp };
}

export async function verifyOtpForPhone(phoneNumber, otp, countryCode = "+91") {
  const fullPhone = `${countryCode}${phoneNumber}`;

  const user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found for this phone number");
  }

  if (user.isPhoneVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number is already verified");
  }

  const latestOtp = await prisma.otp.findFirst({
    where: { userId: user.id, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!latestOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No active OTP found. Please request a new one.");
  }

  if (latestOtp.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired. Please request a new one.");
  }

  const isMatch = await bcrypt.compare(otp, latestOtp.codeHash);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const cinId = generateCinId();
  const userUpdateData = { isPhoneVerified: true, cinId };
  if (latestOtp.referrerId) {
    userUpdateData.referredById = latestOtp.referrerId;
  }

  const txSteps = [
    prisma.user.update({
      where: { id: user.id },
      data: userUpdateData,
    }),
    prisma.otp.update({
      where: { id: latestOtp.id },
      data: { consumedAt: new Date() },
    }),
  ];
  if (latestOtp.referrerId) {
    txSteps.push(
      prisma.user.update({
        where: { id: latestOtp.referrerId },
        data: { points: { increment: REFERRAL_POINTS_PER_SIGNUP } },
      })
    );
  }
  await prisma.$transaction(txSteps);

  return {
    phoneNumber: fullPhone,
    referredByReferral: Boolean(latestOtp.referrerId),
  };
}

export async function setupMpinForPhone(phoneNumber, mpin, countryCode = "+91") {
  const fullPhone = `${countryCode}${phoneNumber}`;

  const user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found for this phone number");
  }

  if (!user.isPhoneVerified) {
    throw new ApiError(httpStatus.FORBIDDEN, "Phone number is not verified");
  }

  const mpinHash = await bcrypt.hash(mpin, MPIN_SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { mpinHash },
  });

  return { phoneNumber: fullPhone };
}

export async function sendOtpForForgetMpin(phoneNumber, countryCode = "+91") {
  const fullPhone = `${countryCode}${phoneNumber}`;

  let user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });


  if (!user.isPhoneVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not registered signup first");
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);
  const expiresAt = new Date(Date.now() + env.otpExpiryMinutes * 60 * 1000);

  await prisma.otp.create({
    data: {
      userId: user.id,
      codeHash: otpHash,
      expiresAt,
    },
  });

  const smsClient = await getSmsClient();
  await smsClient.sendSms(
  fullPhone,
  `${otp} is your Micrope M-pin reset OTP. Valid for the next 5 minutes. Please do not share this code with anyone. karzpe fintech pvt ltd`,
  { dltTemplateId: process.env.DLT_TEMPLATE_MPIN_RESET }
);

  return { phoneNumber: fullPhone, expiresAt, otp };
}

export async function ForgetverifyOtpForPhone(phoneNumber, otp, countryCode = "+91") {
  const fullPhone = `${countryCode}${phoneNumber}`;

  const user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found for this phone number");
  }

  if (!user.isPhoneVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not registered signup first");
  }


  const latestOtp = await prisma.otp.findFirst({
    where: { userId: user.id, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!latestOtp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid otp or otp has been expired. Please request a new one.");
  }

  if (latestOtp.expiresAt < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired. Please request a new one.");
  }

  const isMatch = await bcrypt.compare(otp, latestOtp.codeHash);
  if (!isMatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { isPhoneVerified: true },
    }),
    prisma.otp.update({
      where: { id: latestOtp.id },
      data: { consumedAt: new Date() },
    }),
  ]);

  return { phoneNumber: fullPhone };
}

export async function resetMpinForPhone(phoneNumber, mpin, countryCode = "+91") {
  const fullPhone = `${countryCode}${phoneNumber}`;

  const user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found for this phone number");
  }

  const mpinHash = await bcrypt.hash(mpin, MPIN_SALT_ROUNDS);

  await prisma.user.update({
    where: { id: user.id },
    data: { mpinHash },
  });

  return { phoneNumber: fullPhone };
}

export async function logoutUser(token) {
  try {
    await prisma.refreshToken.delete({
      where: { token },
    });
    return { success: true };
  } catch (err) {
    return { success: true };
  }
}


