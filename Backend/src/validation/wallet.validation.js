import Joi from "joi";

const amountPaise = Joi.number().integer().min(1).max(99_99_99_999);
const idempotencyKey = Joi.string().max(128).optional();

export const w2wTransferSchema = Joi.object({
  body: Joi.object({
    toPhoneNumber: Joi.string().required(),
    toCountryCode: Joi.string().default("+91"),
    amountPaise: amountPaise.required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const bankPayoutSchema = Joi.object({
  body: Joi.object({
    beneficiaryId: Joi.string().required(),
    amountPaise: amountPaise.required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const ledgerQuerySchema = Joi.object({
  body: Joi.object().unknown(true),
  params: Joi.object().unknown(true),
  query: Joi.object({
    limit: Joi.number().integer().min(1).max(100).optional(),
    cursor: Joi.string().optional(),
  }).optional(),
});
