import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { idempotencyMiddleware } from "../middleware/idempotency.middleware.js";
import {
  getBalanceHandler,
  w2wTransferHandler,
  bankPayoutHandler,
  getLedgerHandler,
} from "../controller/wallet.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/balance", getBalanceHandler);
router.post("/transfer", idempotencyMiddleware, w2wTransferHandler);
router.post("/payout", idempotencyMiddleware, bankPayoutHandler);
router.get("/ledger", getLedgerHandler);

export default router;
