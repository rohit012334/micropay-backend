import httpStatus from "http-status";
import { getBalance, w2wTransferByPhone, bankPayout, getLedger, } from "../services/wallet.service.js";
import { validate } from "../middleware/validate.js";
import {
  w2wTransferSchema,
  bankPayoutSchema,
  ledgerQuerySchema,
} from "../validation/wallet.validation.js";

export const getBalanceHandler = [
  async (req, res, next) => {
    try {
      const data = await getBalance(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const w2wTransferHandler = [
  validate(w2wTransferSchema),
  async (req, res, next) => {
    try {
      const data = await w2wTransferByPhone(req.user.id, {
        toPhoneNumber: req.body.toPhoneNumber,
        toCountryCode: req.body.toCountryCode,
        amountPaise: req.body.amountPaise,
        idempotencyKey: req.headers["idempotency-key"],
      });
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Transfer completed",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
];

export const bankPayoutHandler = [
  validate(bankPayoutSchema),
  async (req, res, next) => {
    try {
      const data = await bankPayout(req.user.id, {
        beneficiaryId: req.body.beneficiaryId,
        amountPaise: req.body.amountPaise,
        idempotencyKey: req.headers["idempotency-key"],
      });
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Payout initiated",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
];

export const getLedgerHandler = [
  validate(ledgerQuerySchema),
  async (req, res, next) => {
    try {
      const data = await getLedger(req.user.id, {
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        cursor: req.query.cursor,
      });
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];
