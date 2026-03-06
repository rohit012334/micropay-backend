import Joi from "joi";

const createSchema = Joi.object({
  body: Joi.object({
    bankName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    ifscCode: Joi.string().required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

const updateSchema = Joi.object({
  body: Joi.object({
    bankName: Joi.string(),
    accountNumber: Joi.string(),
    ifscCode: Joi.string(),
  }).min(1),
  params: Joi.object({ id: Joi.string().required() }).required(),
  query: Joi.object().unknown(true),
});

const idParamSchema = Joi.object({
  body: Joi.object().unknown(true),
  params: Joi.object({ id: Joi.string().required() }).required(),
  query: Joi.object().unknown(true),
});

export { createSchema as createBeneficiarySchema, updateSchema as updateBeneficiarySchema, idParamSchema as beneficiaryIdParamSchema };
