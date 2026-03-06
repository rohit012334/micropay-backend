import Joi from "joi";

const createCardSchema = Joi.object({
  body: Joi.object({
    holderName: Joi.string().required(),
    cardNumber: Joi.string().min(12).max(19).required(), // digits only or with spaces
    cvv: Joi.string().length(3).optional(),
    expiryMonth: Joi.number().min(1).max(12).required(),
    expiryYear: Joi.number().min(new Date().getFullYear()).required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

const idParamSchema = Joi.object({
  body: Joi.object().unknown(true),
  params: Joi.object({ id: Joi.string().required() }).required(),
  query: Joi.object().unknown(true),
});

export { createCardSchema, idParamSchema as cardIdParamSchema };
