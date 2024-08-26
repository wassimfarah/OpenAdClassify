import * as moment from 'moment-timezone';

export function convertUtcToOffset(date: string | Date, offset: number): string {
  // Convert the provided UTC date to the specified time zone offset
  const localDate = moment(date).utcOffset(offset).format('YYYY-MM-DDTHH:mm:ssZ'); // Format includes offset

  return localDate;
}
