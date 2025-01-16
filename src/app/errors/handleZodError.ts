import { ZodError } from "zod";
import { TErrorResponse } from "../types/TErrorResponse";

const handleZodError = (err: ZodError): TErrorResponse => {
  const AllErrorMessages = err.issues.map((issue) => {
    return issue.message;
  });

  const errorMessage = AllErrorMessages.join(", ");

  return {
    success: false,
    message: "Validation Error",
    errorMessage: errorMessage,
  };
};

export default handleZodError;
