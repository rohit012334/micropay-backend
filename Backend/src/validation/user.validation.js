import Joi from "joi";

export const updateProfileSchema = Joi.object({
  body: Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).allow("", null),
    countryCode: Joi.string().default("+91"),
    // profilePicture ab body mein nahi aayega — file hai woh
  }),
  params: Joi.object().unknown(true),
  query: Joi.object().unknown(true),
});
