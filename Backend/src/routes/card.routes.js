import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  addCardHandler,
  listCardsHandler,
  getCardHandler,
  deleteCardHandler,
} from "../controller/card.controller.js";

const router = express.Router();

router.use(authenticate);

router.post("/", addCardHandler);
router.get("/", listCardsHandler);
router.get("/:id", getCardHandler);
router.delete("/:id", deleteCardHandler);

export default router;
