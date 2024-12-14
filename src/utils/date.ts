import { isValid, format, fromUnixTime } from 'date-fns';

export function formatDate(timestamp: string | number | Date): string {
  try {
    // Handle different timestamp formats
    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      date = fromUnixTime(timestamp);
    } else {
      date = new Date(timestamp);
    }

    // Validate the date
    if (!isValid(date)) {
      console.error('Invalid date:', timestamp);
      return 'Invalid date';
    }

    return format(date, 'MMM d, yyyy HH:mm:ss');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}