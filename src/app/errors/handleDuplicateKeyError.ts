import { TErrorResponse } from "../types/TErrorResponse";

const handleDuplicateKeyError = (err: any): TErrorResponse => {

    // Extract value within double quotes using regex
    const match = err.message.match(/"([^"]*)"/);
      // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];
  
  const errorMessage = err?.message
    ? `${extractedMessage} already exists`
    : "Data already exists";

  return {
    success: false,
    message: "Duplicate Key Error",
    errorMessage: errorMessage,
  };
};

export default handleDuplicateKeyError;
