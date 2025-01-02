export function setNoonTime(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(12, 0, 0, 0);
  return newDate;
}

export function isBeforeNoon(date: Date): boolean {
  return date.getHours() < 12;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}