import Joi from "joi";

export const submitKycSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    countryCode: Joi.string().default("+91"),
    fullName: Joi.string().max(100).required(),
    address: Joi.string().max(500).required(),
    dob: Joi.date().iso().required(),
    gender: Joi.string().valid("MALE", "FEMALE", "OTHER").required(),
    documentType: Joi.string().valid("AADHAAR", "PAN").required(),
    documentNumber: Joi.string().max(50).required(),
  }).required(),

  query: Joi.object().unknown(true),
  params: Joi.object().unknown(true),
});


export const getKycStatusSchema = Joi.object({
  body: Joi.object().unknown(true),
  params: Joi.object().unknown(true),
  query: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    countryCode: Joi.string().default("+91"),
  }).required(),
});

