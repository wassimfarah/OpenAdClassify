import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

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
    timestamp: getFormattedTimestamp(),
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
    timestamp: getFormattedTimestamp(),
  };
};

function getFormattedTimestamp(): string {
  const timezone = process.env.DATABASE_TIMEZONE || 'Africa/Tunis'; // Get timezone from .env or fallback

  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  return new Date().toLocaleString('en-GB', options).replace(',', '');
}
