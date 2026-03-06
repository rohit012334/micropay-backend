import httpStatus from "http-status";
import {
  addCard,
  listCards,
  getCardById,
  deleteCard,
} from "../services/card.service.js";
import { validate } from "../middleware/validate.js";
import { createCardSchema, cardIdParamSchema } from "../validation/card.validation.js";

export const addCardHandler = [
  validate(createCardSchema),
  async (req, res, next) => {
    try {
      const data = await addCard(req.user.id, req.body);
      return res.status(httpStatus.CREATED).json({ success: true, message: "Card added", data });
    } catch (err) {
      next(err);
    }
  },
];

export const listCardsHandler = [
  async (req, res, next) => {
    try {
      const data = await listCards(req.user.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const getCardHandler = [
  validate(cardIdParamSchema),
  async (req, res, next) => {
    try {
      const data = await getCardById(req.user.id, req.params.id);
      return res.status(httpStatus.OK).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },
];

export const deleteCardHandler = [
  validate(cardIdParamSchema),
  async (req, res, next) => {
    try {
      await deleteCard(req.user.id, req.params.id);
      return res.status(httpStatus.OK).json({ success: true, message: "Card deleted" });
    } catch (err) {
      next(err);
    }
  },
];
