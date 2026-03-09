import httpStatus from "http-status";
import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";

export async function upsertBusinessProfile(userId, data) {
   const { tradeName, gstNumber, businessType, email ,  turnover } = data;

   const existingEmail = await prisma.businessProfile.findFirst({
    where: { email, NOT: { userId } },
  });
  if (existingEmail) {
    throw new ApiError(httpStatus.CONFLICT, "Email already in use by another business profile");
  }

  const profile = await prisma.businessProfile.upsert({
    where: { userId },
    update: {
      tradeName,
      gstNumber,
      email,
      ...(businessType && { businessType }),
      ...(turnover && { turnover }),
    },
    create: {
      userId,
      tradeName,
      gstNumber,
      email,
      ...(businessType && { businessType }),
      ...(turnover && { turnover }),
    },
  });

  return profile;
}

export async function getBusinessProfile(userId) {
  const profile = await prisma.businessProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError(httpStatus.NOT_FOUND, "Business profile not found");
  }

  return profile;
}