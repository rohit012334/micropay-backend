import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(
    {
      body: req.body,
      query: req.query,
      params: req.params,
    },
    { abortEarly: false }
  );

  if (error) {
    return next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, error.details.map(d => d.message).join(", ")));
  }
  // Instead of replacing whole object, assign safely
  if (value.body) Object.assign(req.body, value.body);
  if (value.params) Object.assign(req.params, value.params);

  next();
};