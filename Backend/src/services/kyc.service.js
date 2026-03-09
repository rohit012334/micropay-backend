import { prisma } from "../config/prismaClient.js";
import bcrypt from "bcrypt";
import env from "../config/env.js";
import { getSmsClient } from "../sms/smsClientFactory.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { getOrCreateWalletInTx } from "./wallet.service.js";

const OTP_SALT_ROUNDS = 10;

function generateOtp() {
  return "1234";
}

async function upsertKycDetailForUserId(
  tx,
  userId,
  { fullName, address, dob, gender, documentType, documentNumber }
) {
  const dobDate = new Date(dob);

  const data = {
    userId,
    fullName,
    address,
    dob: dobDate,
    gender,
    documentType,
    documentNumber,
  };

  const existingKyc = await tx.kycDetail.findUnique({
    where: { userId },
  });

  return existingKyc
    ? tx.kycDetail.update({
      where: { userId },
      data,
    })
    : tx.kycDetail.create({
      data,
    });
}


async function upsertKycDraftForUserId(
  tx,
  userId,
  otpId,
  { fullName, address, dob, gender, documentType, documentNumber }
) {
  const dobDate = new Date(dob);

  return tx.kycDraft.upsert({
    where: { userId },
    update: {
      otpId,
      fullName,
      address,
      dob: dobDate,
      gender,
      documentType,
      documentNumber,
    },
    create: {
      userId,
      otpId,
      fullName,
      address,
      dob: dobDate,
      gender,
      documentType,
      documentNumber,
    },
  });
}


export async function submitKycDetailsAndSendOtp({
  phoneNumber,
  countryCode = "+91",
  fullName,
  address,
  dob,
  gender,
  documentType,
  documentNumber,
}) {
  const fullPhone = `${countryCode}${phoneNumber}`;

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, OTP_SALT_ROUNDS);

  const expiresAt = new Date(
    Date.now() + env.otpExpiryMinutes * 60 * 1000
  );

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { phoneNumber: fullPhone },
    });

    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "User not found for this phone number"
      );
    }

    if (!user.isPhoneVerified) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Phone is not verified"
      );
    }

    if (user.isKycVerified) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "KYC is already verified"
      );
    }

    const existingDraft = await tx.kycDraft.findUnique({
      where: { userId: user.id },
    });

    if (existingDraft?.otpId) {
      await tx.otp.updateMany({
        where: {
          id: existingDraft.otpId,
          consumedAt: null,
        },
        data: { consumedAt: new Date() },
      });
    }

    const createdOtp = await tx.otp.create({
      data: {
        userId: user.id,
        codeHash: otpHash,
        expiresAt,
      },
    });

    await upsertKycDraftForUserId(
      tx,
      user.id,
      createdOtp.id,
      { fullName, address, dob, gender, documentType, documentNumber }
    );
  });

  // const smsClient = getSmsClient();

  const message = `Your KYC verification code is ${otp}. It will expire in ${env.otpExpiryMinutes} minutes.`;

  // await smsClient.sendSms(fullPhone, message);

  return {
    phoneNumber: fullPhone,
    expiresAt,
    otp,
  };
}


export async function verifyKycOtpAndComplete({
  phoneNumber,
  countryCode = "+91",
  otp,
}) {
  const fullPhone = `${countryCode}${phoneNumber}`;

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { phoneNumber: fullPhone },
    });

    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "User not found for this phone number"
      );
    }

    if (!user.isPhoneVerified) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Phone is not verified"
      );
    }

    if (user.isKycVerified) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "KYC is already verified"
      );
    }

    const draft = await tx.kycDraft.findUnique({
      where: { userId: user.id },
    });

    if (!draft) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "No pending KYC request. Please submit details first."
      );
    }

    const draftOtp = await tx.otp.findUnique({
      where: { id: draft.otpId },
    });

    if (!draftOtp || draftOtp.consumedAt) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "No active OTP found. Please request a new one."
      );
    }

    if (draftOtp.expiresAt < new Date()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "OTP has expired. Please request a new one."
      );
    }

    const isMatch = await bcrypt.compare(
      otp,
      draftOtp.codeHash
    );

    if (!isMatch) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid OTP"
      );
    }

    await tx.otp.update({
      where: { id: draftOtp.id },
      data: { consumedAt: new Date() },
    });

    const kyc = await upsertKycDetailForUserId(
      tx,
      user.id,
      {
        fullName: draft.fullName,
        address: draft.address,
        dob: draft.dob,
        gender: draft.gender,
        documentType: draft.documentType,
        documentNumber: draft.documentNumber,
      }
    );

    await tx.user.update({
      where: { id: user.id },
      data: { isKycVerified: true },
    });

    await tx.kycDraft.delete({
      where: { userId: user.id },
    });

    // Automatically create wallet after KYC verification
    await getOrCreateWalletInTx(tx, user.id);

    return kyc;
  });
}


export async function getKycStatusForUser({
  phoneNumber,
  countryCode = "+91",
}) {
  const fullPhone = phoneNumber?.startsWith("+")
    ? phoneNumber
    : `${countryCode}${phoneNumber}`;

  const user = await prisma.user.findUnique({
    where: { phoneNumber: fullPhone },
  });

  if (!user) {
    return {
      hasKycDetails: false,
      isKycVerified: false,
    };
  }

  const kyc = await prisma.kycDetail.findUnique({
    where: { userId: user.id },
  });

  return {
    hasKycDetails: Boolean(kyc),
    isKycVerified: user.isKycVerified,
  };
}