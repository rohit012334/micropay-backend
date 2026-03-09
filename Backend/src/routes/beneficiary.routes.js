import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  createBeneficiaryHandler,
  listBeneficiariesHandler,
  getBeneficiaryHandler,
  updateBeneficiaryHandler,
  deleteBeneficiaryHandler,
} from "../controller/beneficiary.controller.js";
const router = express.Router();

router.use(authenticate);

router.post("/", createBeneficiaryHandler);
router.get("/", listBeneficiariesHandler);
router.get("/:id", getBeneficiaryHandler);
router.put("/:id", updateBeneficiaryHandler);   
router.delete("/:id", deleteBeneficiaryHandler);


export default router;