import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";
import { encrypt } from "../utils/encrypt.js";

export async function addCard(userId, data) {
  const { holderName, cardNumber, cvv, expiryMonth, expiryYear } = data;
  const cardNumberStr = String(cardNumber).replace(/\s/g, "");
  const lastFour = cardNumberStr.slice(-4);

  const existing = await prisma.cardDetail.findFirst({
    where: {
      userId,
      lastFour,
      expiryMonth: Number(expiryMonth),
      expiryYear: Number(expiryYear),
    },
  });

  if (existing) {
    const error = new Error("Card already added");
    error.statusCode = 409;
    throw error;
  }

  const cardNumberEncrypted = encrypt(cardNumberStr);
  const cvvEncrypted = cvv ? encrypt(String(cvv)) : null;

  const card = await prisma.cardDetail.create({
    data: {
      userId,
      holderName,
      cardNumberEncrypted,
      lastFour,
      cvvEncrypted,
      expiryMonth: Number(expiryMonth),
      expiryYear: Number(expiryYear),
    },
  });

  return maskCard(card);
}

function maskCard(card) {
  return {
    id: card.id,
    holderName: card.holderName,
    lastFour: card.lastFour,
    expiryMonth: card.expiryMonth,
    expiryYear: card.expiryYear,
    createdAt: card.createdAt,
  };
}

export async function listCards(userId) {
  const list = await prisma.cardDetail.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return list.map(maskCard);
}

export async function getCardById(userId, id) {
  const card = await prisma.cardDetail.findFirst({
    where: { id, userId },
  });
  if (!card) throw new ApiError(httpStatus.NOT_FOUND, "Card not found");
  return maskCard(card);
}

export async function deleteCard(userId, id) {
  const card = await prisma.cardDetail.findFirst({
    where: { id, userId },
  });
  if (!card) throw new ApiError(httpStatus.NOT_FOUND, "Card not found");
  await prisma.cardDetail.delete({ where: { id } });
  return { deleted: true };
}
