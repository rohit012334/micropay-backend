import httpStatus from "http-status";
import {submitKycDetailsAndSendOtp,verifyKycOtpAndComplete,getKycStatusForUser} from "../services/kyc.service.js";

import { validate } from "../middleware/validate.js";
import {submitKycSchema,getKycStatusSchema,} from "../validation/kyc.validation.js";



export const submitKyc = [
  validate(submitKycSchema),

  async (req, res, next) => {
    try {
      const {
        phoneNumber,
        countryCode,
        fullName,
        address,
        dob,
        gender,
        documentType,
        documentNumber,
      } = req.body;

      const result = await submitKycDetailsAndSendOtp({
        phoneNumber,
        countryCode,
        fullName,
        address,
        dob,
        gender,
        documentType,
        documentNumber,
      });

      return res.status(httpStatus.OK).json({
        success: true,
        message: "OTP sent successfully for KYC",
        data: {
          expiresAt: result.expiresAt,
        },
        otp: result.otp,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export const verifyKycOtp = [
  async (req, res, next) => {
    try {
      const { phoneNumber, countryCode, otp } = req.body;

      const kyc = await verifyKycOtpAndComplete({
        phoneNumber,
        countryCode,
        otp,
      });

      return res.status(httpStatus.OK).json({
        success: true,
        message: "KYC completed successfully",
        data: kyc,
      });
    } catch (err) {
      return next(err);
    }
  },
];


export const getKycStatus = [
  validate(getKycStatusSchema),

  async (req, res, next) => {
    try {
      const { phoneNumber, countryCode } = req.query;

      const status = await getKycStatusForUser({
        phoneNumber,
        countryCode,
      });

      return res.status(httpStatus.OK).json({
        success: true,
        message: "KYC status fetched successfully",
        data: status,
      });
    } catch (err) {
      return next(err);
    }
  },
];