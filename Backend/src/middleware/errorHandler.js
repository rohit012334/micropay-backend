import httpStatus from "http-status";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Internal Server Error";
  const details = err.details;

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
  });
}
