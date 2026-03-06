import express from "express";
import { submitKyc, getKycStatus , verifyKycOtp } from "../controller/kyc.controller.js";

const router = express.Router();

router.post("/submit", submitKyc);
router.post("/verifykyc-otp", verifyKycOtp);
router.get("/status", getKycStatus);

export default router;
