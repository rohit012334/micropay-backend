import httpStatus from "http-status";
import { upload } from "../config/multer.js"; // ✅ controller mein chahiye, app.js mein nahi
import {
  getProfile,
  updateProfile,
  verifyPhoneChange,
  getAccountDetails,
  getReferralCode,
  getPoints,
  checkIn,
  getReferrals,
} from "../services/user.service.js";
import { validate } from "../middleware/validate.js";
import { updateProfileSchema, verifyPhoneChangeSchema } from "../validation/user.validation.js";

export const getProfileHandler = [
  async (req, res, next) => {
    try {
      const data = await getProfile(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const updateProfileHandler = [
  upload.single("profilePicture"), // ✅ multer pehle file parse karega
  validate(updateProfileSchema),
  async (req, res, next) => {
    try {
       const baseUrl = `${req.protocol}://${req.get("host")}`;
      const data = await updateProfile(req.user.id, req.body, req.file,baseUrl);
      return res.status(httpStatus.OK).json({
        success: true,
        message: data.otpSentToNewNumber ? "Profile updated; OTP sent to new number" : "Profile updated",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
];

export const verifyPhoneChangeHandler = [
  validate(verifyPhoneChangeSchema),
  async (req, res, next) => {
    try {
       const { phoneNumber, otp } = req.body;
      const data = await verifyPhoneChange(req.user.id, req.body.otp);
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Phone number updated successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  },
];

export const getAccountDetailsHandler = [
  async (req, res, next) => {
    try {
      const data = await getAccountDetails(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const getReferralCodeHandler = [
  async (req, res, next) => {
    try {
      const data = await getReferralCode(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const getPointsHandler = [
  async (req, res, next) => {
    try {
      const data = await getPoints(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const checkInHandler = [
  async (req, res, next) => {
    try {
      const data = await checkIn(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const getReferralsHandler = [
  async (req, res, next) => {
    try {
      const data = await getReferrals(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];
