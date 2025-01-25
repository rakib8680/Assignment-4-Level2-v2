import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorResponse } from "../types/TErrorResponse";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateKeyError from "../errors/handleDuplicateKeyError";
import AppError from "../errors/AppError";
import { JsonWebTokenError } from "jsonwebtoken";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorResponse: TErrorResponse = {
    success: false,
    message: "Error",
    errorMessage: "Something Went Wrong",
  };

  console.log(err.name);

  // check error type and set customized error message
  if (err instanceof ZodError) {
    errorResponse = handleZodError(err);
  } else if (err?.name === "ValidationError") {
    errorResponse = handleValidationError(err);
  } else if (err?.name === "CastError") {
    errorResponse = handleCastError(err);
  } else if (err.code === 11000) {
    errorResponse = handleDuplicateKeyError(err);
  } else if (err instanceof JsonWebTokenError) {
    errorResponse = {
      success: false,
      message: "Unauthorized Access",
      errorMessage: `${err.name === "TokenExpiredError" ? "Session Expired, please login again to access this route." : "You are not authorized to access this route"}`,
      errorDetails: "null",
      stack: "null",
    };
  } else if (err instanceof AppError) {
    errorResponse = {
      success: false,
      message: err.message,
      errorMessage: err.message,
    };
  } else if (err instanceof Error) {
    errorResponse = {
      success: false,
      message: "Validation Error",
      errorMessage: err.message,
    };
  }

  res.status(err.statusCode || 500).json({
    success: errorResponse.success,
    message: errorResponse.message,
    errorMessage: errorResponse.errorMessage,
    errorDetails: errorResponse.errorDetails || err,
    stack: errorResponse.stack || err?.stack,
  });
};

export default globalErrorHandler;
