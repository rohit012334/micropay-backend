import Joi from "joi";

const businessTypeEnum = [
  "SOLE_PROPRIETORSHIP",
  "PARTNERSHIP",
  "LLP",
  "PVT_LTD",
  "PUBLIC_LTD",
  "OTHER",
];

const turnoverEnum = [
  "RS_0_TO_6L",
  "RS_6L_TO_40L",
  "RS_40L_TO_1CR",
  "RS_1CR_TO_5CR",
  "RS_5CR_TO_10CR",
  "RS_10CR_TO_50CR",
  "RS_ABOVE_50CR",
];

export const upsertBusinessProfileSchema = Joi.object({
  body: Joi.object({
    tradeName: Joi.string().required().messages({
      "string.empty": "Trade name is required",
      "any.required": "Trade name is required",
    }),
    gstNumber: Joi.string().required().messages({
      "string.empty": "GST number is required",
      "any.required": "GST number is required",
    }),
    businessType: Joi.string()
      .valid(...businessTypeEnum)
      .optional()
      .messages({
        "any.only": "Invalid business type selected",
        "any.required": "Business type is required",
      }),
   email: Joi.string().email().required().messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
    turnover: Joi.string()
      .valid(...turnoverEnum)
      .optional() 
      .messages({
        "any.only": "Invalid turnover range selected",
      }),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});