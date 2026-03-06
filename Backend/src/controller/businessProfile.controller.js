import httpStatus from "http-status";
import { upsertBusinessProfile, getBusinessProfile } from "../services/businessProfile.service.js";
import { validate } from "../middleware/validate.js";
import { upsertBusinessProfileSchema } from "../validation/businessProfile.validation.js";

export const upsertBusinessProfileHandler = [
  validate(upsertBusinessProfileSchema),
  async (req, res, next) => {
    try {
      const data = await upsertBusinessProfile(req.user.id, req.body);
      return res.status(httpStatus.OK).json({ success: true, message: "Business profile saved", data });
    } catch (err) {
      next(err);
    }
  },
];

export const getBusinessProfileHandler = [
  async (req, res, next) => {
    try {
      const data = await getBusinessProfile(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];
