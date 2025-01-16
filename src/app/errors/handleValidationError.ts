import mongoose, { mongo } from "mongoose";
import { TErrorResponse } from "../types/TErrorResponse";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TErrorResponse => {
  const AllErrorMessages = Object.values(err?.errors).map(
    (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
      error?.message
  );

  const errorMessage = AllErrorMessages.join(", ");

  return {
    success: false,
    message: "Validation Error",
    errorMessage: errorMessage,
  };
};

export default handleValidationError;
