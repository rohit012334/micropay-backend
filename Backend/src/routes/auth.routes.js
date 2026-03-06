import express from "express";
import { sendOtp, verifyOtp, setupMpin, forgetMpin, forgetMpinVerifyOtp, login ,resend , resetMpin } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/login", login);

router.post("/send-otp", sendOtp);

router.post("/resend-otp" , resend);

router.post("/verify-otp", verifyOtp);

router.post("/setup-mpin", setupMpin);

router.post("/forget-mpin", forgetMpin);

router.post("/forget-mpin-verify-otp", forgetMpinVerifyOtp);

router.put("/reset-mpin", resetMpin);


export default router;

