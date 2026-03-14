import httpStatus from "http-status";
import { sendOtpForPhone, verifyOtpForPhone, setupMpinForPhone, sendOtpForForgetMpin, ForgetverifyOtpForPhone, loginuser, resetMpinForPhone, logoutUser, changeMpinForUser } from "../services/auth.service.js";
import { validate } from "../middleware/validate.js";
import { sendOtpSchema, verifyOtpSchema, setupMpinSchema, forgetMpinSchema, ForgetverifyOtpSchema, loginSchema, resetMpinSchema, changeMpinSchema } from "../validation/auth.validation.js";



export const login = [
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, countryCode, mpin } = req.body;
      const result = await loginuser(phoneNumber, countryCode, mpin);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          phoneNumber: result.phoneNumber,
          userId: result.userId,
          token: result.token,
        },
      });
    }

    catch (err) {
      return next(err);
    }
  },
];

export const sendOtp = [
  validate(sendOtpSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, countryCode, referralCode } = req.body;
      const result = await sendOtpForPhone(phoneNumber, countryCode, referralCode);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        data: { phoneNumber: result.phoneNumber, expiresAt: result.expiresAt },
        otp: result.otp,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const verifyOtp = [
  validate(verifyOtpSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, otp } = req.body;
      const result = await verifyOtpForPhone(phoneNumber, otp);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Phone verified successfully",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const setupMpin = [
  validate(setupMpinSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, mpin } = req.body;
      const result = await setupMpinForPhone(phoneNumber, mpin);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "MPIN set successfully",
        data: {
          phoneNumber: result.phoneNumber,
          token: result.token,
        }
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const forgetMpin = [
  validate(forgetMpinSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, countryCode } = req.body;
      const result = await sendOtpForForgetMpin(phoneNumber, countryCode);

      return res
        .status(200)
        .json({
          status: true,
          message: "OTP sent successfully",
          otp: result.otp,
        });
    } catch (err) {
      return next(err);
    }
  },
];

export const forgetMpinVerifyOtp = [
  validate(ForgetverifyOtpSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, otp } = req.body;
      const result = await ForgetverifyOtpForPhone(phoneNumber, otp);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Phone verified successfully",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const resetMpin = [
  validate(resetMpinSchema),
  async (req, res, next) => {
    try {
      const { phoneNumber, mpin } = req.body;
      const result = await resetMpinForPhone(phoneNumber, mpin);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "MPIN changed successfully",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const logout = [
  async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.slice(7);
      await logoutUser(token);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Logout successful",
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const changeMpin = [
  validate(changeMpinSchema),
  async (req, res, next) => {
    try {
      const { mpin } = req.body;
      const userId = req.user.id;
      const result = await changeMpinForUser(userId, mpin);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "MPIN changed successfully",
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const resend = sendOtp