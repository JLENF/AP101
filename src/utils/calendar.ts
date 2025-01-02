import { Rental } from '../types/rental';

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function findRentalsForPeriod(rentals: Rental[], date: Date, isPeriodMorning: boolean): Rental | undefined {
  // Ensure date is set to noon for consistent comparison
  const targetDate = new Date(date);
  targetDate.setHours(12, 0, 0, 0);

  return rentals.find((rental) => {
    const checkIn = new Date(rental.check_in);
    const checkOut = new Date(rental.check_out);

    // Normalize times to noon
    checkIn.setHours(12, 0, 0, 0);
    checkOut.setHours(12, 0, 0, 0);

    if (isPeriodMorning) {
      // Morning shows checkout day and days between
      return isSameDay(targetDate, checkOut) || (targetDate > checkIn && targetDate < checkOut);
    } else {
      // Afternoon shows checkin day and days between
      return isSameDay(targetDate, checkIn) || (targetDate > checkIn && targetDate < checkOut);
    }
  });
}