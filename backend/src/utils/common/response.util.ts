export interface SuccessResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    timestamp: string;
  }
  
  export interface ErrorResponse {
    statusCode: number;
    message: string;
    error: string;
    timestamp: string;
  }
  
  export const createSuccessResponse = <T>(
    data: T,
    message = 'Success',
    statusCode = 200,
  ): SuccessResponse<T> => {
    return {
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  };
  
  export const createErrorResponse = (
    message: string,
    error: string,
    statusCode = 400,
  ): ErrorResponse => {
    return {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
    };
  };
  