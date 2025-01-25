export type TErrorResponse = {
    success: boolean;
    message: string;
    errorMessage: string;
    errorDetails ?: any;
    stack ?: string | null;
  };
  