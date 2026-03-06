import Joi from "joi";

export const loginSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    countryCode: Joi.string().default("+91"),
    mpin: Joi.string().pattern(/^[0-9]{4}$/).length(4).required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const sendOtpSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    countryCode: Joi.string().default("+91"),
    referralCode: Joi.string().trim().max(20).allow("", null),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const verifyOtpSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    otp: Joi.string().length(4).required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const setupMpinSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    mpin: Joi.string().pattern(/^[0-9]{4,6}$/).min(4).required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const forgetMpinSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    countryCode: Joi.string().default("+91"),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const ForgetverifyOtpSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    otp: Joi.string().length(4).required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});

export const resetMpinSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    countryCode: Joi.string().default("+91"),
    mpin: Joi.string().pattern(/^[0-9]{4,6}$/).min(4).required(),
  }).required(),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});
