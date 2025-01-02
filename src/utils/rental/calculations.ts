export function calculateNumberOfDays(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateTotalAmount(checkIn: Date, checkOut: Date, dailyRate: number): number {
  const numberOfDays = calculateNumberOfDays(checkIn, checkOut);
  return numberOfDays * dailyRate;
}