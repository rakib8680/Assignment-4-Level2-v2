import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorResponse } from "../types/TErrorResponse";
import handleZodError from "../errors/handleZodError";
import handleValidationError from "../errors/handleValidationError";
import handleCastError from "../errors/handleCastError";
import handleDuplicateKeyError from "../errors/handleDuplicateKeyError";
import AppError from "../errors/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let errorResponse:TErrorResponse = {
    success: false,
    message: "Error",
    errorMessage: "Something Went Wrong",
  };



  // console.log(Object.values(err));


  // check error type and set customized error message
  if(err instanceof ZodError){
    errorResponse = handleZodError(err);
  }else if(err?.name ==="ValidationError"){
    errorResponse = handleValidationError(err);
  }else if(err?.name ==="CastError"){
    errorResponse = handleCastError(err);
  }else if (err.code === 11000){
    errorResponse = handleDuplicateKeyError(err);
  }else if(err instanceof AppError){
    errorResponse = {
      success: false,
      message: err.message,
      errorMessage: err.message,
  }}


  res.status(err.statusCode || 500).json({
    success: errorResponse.success,
    message: errorResponse.message,
    errorMessage: errorResponse.errorMessage,
    errorDetails: err,
    stack: err?.stack,
  });
};

export default globalErrorHandler;
