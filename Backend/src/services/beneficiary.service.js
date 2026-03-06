import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

export async function createBeneficiary(userId, data) {
  const { bankName, accountNumber, ifscCode } = data;
  const beneficiary = await prisma.beneficiary.create({
    data: { userId, bankName, accountNumber, ifscCode },
  });
  return beneficiary;
}

export async function listBeneficiaries(userId) {
  const list = await prisma.beneficiary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return list;
}

export async function getBeneficiaryById(userId, id) {
  const beneficiary = await prisma.beneficiary.findFirst({
    where: { id, userId },
  });
  if (!beneficiary) throw new ApiError(httpStatus.NOT_FOUND, "Beneficiary not found");
  return beneficiary;
}

export async function updateBeneficiary(userId, id, data) {
  await getBeneficiaryById(userId, id);
  const { bankName, accountNumber, ifscCode } = data;
  const beneficiary = await prisma.beneficiary.update({
    where: { id },
    data: { bankName, accountNumber, ifscCode },
  });
  return beneficiary;
}

export async function deleteBeneficiary(userId, id) {
  await getBeneficiaryById(userId, id);
  await prisma.beneficiary.delete({ where: { id } });
  return { deleted: true };
}
