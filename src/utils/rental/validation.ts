import { RentalFormData } from '../../types/rental';

export function validateDates(checkIn: Date, checkOut: Date): void {
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    throw new Error('Invalid dates provided');
  }

  if (checkOut <= checkIn) {
    throw new Error('Check-out date must be after check-in date');
  }
}

export function normalizeDate(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}