import { TErrorResponse } from "../types/TErrorResponse";

const handleDuplicateKeyError = (err: any): TErrorResponse => {
  const errorMessage = err?.keyValue?.title
    ? `${err?.keyValue?.title} already exists`
    : "Course already exists";

  return {
    success: false,
    message: "Duplicate Key Error",
    errorMessage: errorMessage,
  };
};

export default handleDuplicateKeyError;
