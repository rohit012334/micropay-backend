import httpStatus from "http-status";
import { createBeneficiary,listBeneficiaries,getBeneficiaryById,updateBeneficiary, deleteBeneficiary,} from "../services/beneficiary.service.js";
import { validate } from "../middleware/validate.js";
import {
  createBeneficiarySchema,
  updateBeneficiarySchema,
  beneficiaryIdParamSchema,
} from "../validation/beneficiary.validation.js";

export const createBeneficiaryHandler = [
  validate(createBeneficiarySchema),
  async (req, res, next) => {
    try {
      const data = await createBeneficiary(req.user.id, req.body);
      return res.status(httpStatus.CREATED).json({ success: true, message: "Beneficiary added", data });
    } catch (err) {
      next(err);
    }
  },
];

export const listBeneficiariesHandler = [
  async (req, res, next) => {
    try {
      const data = await listBeneficiaries(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const getBeneficiaryHandler = [
  validate(beneficiaryIdParamSchema),
  async (req, res, next) => {
    try {
      const data = await getBeneficiaryById(req.user.id, req.params.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const updateBeneficiaryHandler = [
  validate(updateBeneficiarySchema),
  async (req, res, next) => {
    try {
      const data = await updateBeneficiary(req.user.id, req.params.id, req.body);
      return res.status(httpStatus.OK).json({ success: true, message: "Beneficiary updated", data });
    } catch (err) {
      next(err);
    }
  },
];

export const deleteBeneficiaryHandler = [
  validate(beneficiaryIdParamSchema),
  async (req, res, next) => {
    try {
      await deleteBeneficiary(req.user.id, req.params.id);
      return res.status(httpStatus.OK).json({ success: true, message: "Beneficiary deleted" });
    } catch (err) {
      next(err);
    }
  },
];
