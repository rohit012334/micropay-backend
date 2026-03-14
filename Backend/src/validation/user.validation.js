import Joi from "joi";

export const updateProfileSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).allow("", null),
    countryCode: Joi.string().default("+91"),
  }),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const verifyPhoneChangeSchema = Joi.object({
  body: Joi.object({
    otp: Joi.string().pattern(/^[0-9]{4,6}$/).required(),
  }),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});
