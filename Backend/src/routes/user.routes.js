import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  getProfileHandler,
  updateProfileHandler,
  getAccountDetailsHandler,
  getReferralCodeHandler,
  getPointsHandler,
  checkInHandler,
  getReferralsHandler,
} from "../controller/user.controller.js";

const router = express.Router();

router.use(authenticate);

router.get("/profile", getProfileHandler);
router.put("/profile", updateProfileHandler);
router.get("/account-details", getAccountDetailsHandler);
router.get("/referral-code", getReferralCodeHandler);
router.get("/points", getPointsHandler);
router.post("/check-in", checkInHandler);
router.get("/referrals", getReferralsHandler);   //testing pending

export default router;
