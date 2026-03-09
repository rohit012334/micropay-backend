import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  upsertBusinessProfileHandler,
  getBusinessProfileHandler,
} from "../controller/businessProfile.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", upsertBusinessProfileHandler); 
router.get("/", getBusinessProfileHandler);

export default router;
