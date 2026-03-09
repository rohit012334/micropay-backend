import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const MIN_AMOUNT_PAISE = 1;
const MAX_AMOUNT_PAISE = 99_99_99_999; // ~1 crore rupees in paise

/**
 * Get or create wallet for user. One wallet per user.
 */
export async function getOrCreateWallet(userId) {
  let wallet = await prisma.wallet.findUnique({
    where: { userId },
  });
  if (wallet) return wallet;
  return prisma.wallet.create({
    data: { userId, balancePaise: 0, version: 0 },
  });
}

/**
 * Get balance for authenticated user.
 */
export async function getBalance(userId) {
  const wallet = await getOrCreateWallet(userId);
  return {
    walletId: wallet.id,
    balancePaise: wallet.balancePaise,
    balanceRupees: Number((wallet.balancePaise / 100).toFixed(2)),
  };
}

/**
 * Resolve phone number to userId for W2W. Throws if user not found.
 */
async function resolveToUserId(toPhoneNumber) {
  const user = await prisma.user.findUnique({
    where: { phoneNumber: toPhoneNumber },
    select: { id: true },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Recipient user not found");
  return user.id;
}

/**
 * Wallet-to-wallet transfer by recipient phone. Idempotent when idempotencyKey is provided.
 * Maintains balance + ledger in one transaction.
 */
export async function w2wTransferByPhone(fromUserId, { toPhoneNumber, toCountryCode, amountPaise, idempotencyKey }) {
  const fullPhone = `${toCountryCode}${toPhoneNumber}`;
  const toUserId = await resolveToUserId(fullPhone);
  return w2wTransfer(fromUserId, { toUserId, amountPaise, idempotencyKey });
}

/**
 * Wallet-to-wallet transfer by recipient userId. Idempotent when idempotencyKey is provided.
 * Maintains balance + ledger in one transaction.
 */
export async function w2wTransfer(fromUserId, { toUserId, amountPaise, idempotencyKey }) {
  if (amountPaise < MIN_AMOUNT_PAISE || amountPaise > MAX_AMOUNT_PAISE) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid amount");
  }
  if (fromUserId === toUserId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot transfer to self");
  }

  const result = await prisma.$transaction(async (tx) => {
    const fromWallet = await getOrCreateWalletInTx(tx, fromUserId);
    const toWallet = await getOrCreateWalletInTx(tx, toUserId);

    if (fromWallet.balancePaise < amountPaise) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }

    const newFromBalance = fromWallet.balancePaise - amountPaise;
    const newToBalance = toWallet.balancePaise + amountPaise;

    const updateFromCount = await tx.$executeRaw`
      UPDATE "Wallet"
      SET "balancePaise" = ${newFromBalance}, "version" = "version" + 1, "updatedAt" = NOW()
      WHERE id = ${fromWallet.id} AND "version" = ${fromWallet.version}
    `;
    if (updateFromCount !== 1) {
      throw new ApiError(httpStatus.CONFLICT, "Concurrent update; please retry");
    }

    const updatedToWallet = await tx.wallet.update({
      where: { id: toWallet.id },
      data: {
        balancePaise: { increment: amountPaise },
        version: { increment: 1 },
      },
    });

    const finalToBalance = updatedToWallet.balancePaise;

    const txn = await tx.walletTransaction.create({
      data: {
        type: "W2W_TRANSFER",
        amountPaise,
        status: "COMPLETED",
        idempotencyKey: idempotencyKey || undefined,
        fromWalletId: fromWallet.id,
        toWalletId: toWallet.id,
      },
    });

    await tx.ledgerEntry.createMany({
      data: [
        {
          walletId: fromWallet.id,
          transactionId: txn.id,
          entryType: "DEBIT",
          amountPaise,
          balanceAfterPaise: newFromBalance,
          refType: "W2W_TRANSFER_OUT",
        },
        {
          walletId: toWallet.id,
          transactionId: txn.id,
          entryType: "CREDIT",
          amountPaise,
          balanceAfterPaise: finalToBalance,
          refType: "W2W_TRANSFER_IN",
        },
      ],
    });

    return tx.walletTransaction.findUnique({
      where: { id: txn.id },
      include: { fromWallet: true, toWallet: true },
    });
  });

  return formatW2WTransaction(result);
}

/**
 * Bank payout: debit wallet and record beneficiary. Idempotent when idempotencyKey provided.
 */
export async function bankPayout(userId, { beneficiaryId, amountPaise, idempotencyKey }) {
  if (amountPaise < MIN_AMOUNT_PAISE || amountPaise > MAX_AMOUNT_PAISE) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid amount");
  }

  const beneficiary = await prisma.beneficiary.findFirst({
    where: { id: beneficiaryId, userId },
  });
  if (!beneficiary) {
    throw new ApiError(httpStatus.NOT_FOUND, "Beneficiary not found or not yours");
  }

  const result = await prisma.$transaction(async (tx) => {
    const wallet = await getOrCreateWalletInTx(tx, userId);
    if (wallet.balancePaise < amountPaise) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance");
    }
    const newBalance = wallet.balancePaise - amountPaise;

    const updateCount = await tx.$executeRaw`
      UPDATE "Wallet"
      SET "balancePaise" = ${newBalance}, "version" = "version" + 1, "updatedAt" = NOW()
      WHERE id = ${wallet.id} AND "version" = ${wallet.version}
    `;
    if (updateCount !== 1) {
      throw new ApiError(httpStatus.CONFLICT, "Concurrent update; please retry");
    }

    const txn = await tx.walletTransaction.create({
      data: {
        type: "BANK_PAYOUT",
        amountPaise,
        status: "COMPLETED",
        idempotencyKey: idempotencyKey || undefined,
        fromWalletId: wallet.id,
        beneficiaryId: beneficiary.id,
      },
    });

    await tx.ledgerEntry.create({
      data: {
        walletId: wallet.id,
        transactionId: txn.id,
        entryType: "DEBIT",
        amountPaise,
        balanceAfterPaise: newBalance,
        refType: "BANK_PAYOUT",
      },
    });

    return tx.walletTransaction.findUnique({
      where: { id: txn.id },
      include: { fromWallet: true, beneficiary: true },
    });
  });

  return formatPayoutTransaction(result);
}

/**
 * List ledger entries for user's wallet (statement). Paginated.
 */
export async function getLedger(userId, { limit = 50, cursor }) {
  const wallet = await getOrCreateWallet(userId);
  const take = Math.min(Math.max(1, limit), 100);

  const entries = await prisma.ledgerEntry.findMany({
    where: { walletId: wallet.id },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    include: {
      transaction: {
        select: {
          id: true,
          type: true,
          amountPaise: true,
          status: true,
          createdAt: true,
          toWallet: { select: { userId: true } },
          beneficiary: { select: { id: true, bankName: true, accountNumber: true } },
        },
      },
    },
  });

  const hasMore = entries.length > take;
  const list = hasMore ? entries.slice(0, take) : entries;
  const nextCursor = hasMore ? list[list.length - 1].id : null;

  return {
    entries: list.map((e) => ({
      id: e.id,
      entryType: e.entryType,
      amountPaise: e.amountPaise,
      balanceAfterPaise: e.balanceAfterPaise,
      refType: e.refType,
      createdAt: e.createdAt,
      transactionId: e.transactionId,
      transaction: e.transaction,
    })),
    nextCursor,
    hasMore,
  };
}

export async function getOrCreateWalletInTx(tx, userId) {
  let wallet = await tx.wallet.findUnique({ where: { userId } });
  if (wallet) return wallet;
  wallet = await tx.wallet.create({
    data: { userId, balancePaise: 0, version: 0 },
  });
  return wallet;
}

function formatW2WTransaction(txn) {
  return {
    id: txn.id,
    type: txn.type,
    amountPaise: txn.amountPaise,
    status: txn.status,
    fromWalletId: txn.fromWalletId,
    toWalletId: txn.toWalletId,
    createdAt: txn.createdAt,
  };
}

function formatPayoutTransaction(txn) {
  return {
    id: txn.id,
    type: txn.type,
    amountPaise: txn.amountPaise,
    status: txn.status,
    fromWalletId: txn.fromWalletId,
    beneficiaryId: txn.beneficiaryId,
    beneficiary: txn.beneficiary
      ? {
        id: txn.beneficiary.id,
        bankName: txn.beneficiary.bankName,
        accountNumber: txn.beneficiary.accountNumber,
        ifscCode: txn.beneficiary.ifscCode,
      }
      : null,
    createdAt: txn.createdAt,
  };
}
