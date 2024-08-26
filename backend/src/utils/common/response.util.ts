import * as dotenv from 'dotenv';
import * as moment from 'moment-timezone';

dotenv.config();

const utcOffsetHours = parseInt(process.env.UTC_HOURS_OFFSET, 10);

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

// Function to get the current date-time and apply the offset
function getCurrentDateTimeWithOffset(): string {
  const now = moment().utcOffset(utcOffsetHours).format('YYYY-MM-DDTHH:mm:ssZ');
  return now;
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
    timestamp: getCurrentDateTimeWithOffset(), // Apply offset to the timestamp
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
    timestamp: getCurrentDateTimeWithOffset(), // Apply offset to the timestamp
  };
};
