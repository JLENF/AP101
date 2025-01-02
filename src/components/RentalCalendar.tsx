import React from 'react';
import { Check, X } from 'lucide-react';
import { Rental } from '../types/rental';
import { getTextColorForBg } from '../utils/colors';
import { findRentalsForPeriod } from '../utils/calendar';

interface RentalWithPeriod extends Rental {
  isCheckIn?: boolean;
  isCheckOut?: boolean;
  isBetween?: boolean;
}

interface RentalCalendarProps {
  rentals: Rental[];
  currentMonth?: Date;
}

const RentalInfo = ({ rental }: { rental: RentalWithPeriod }) => (
  <div className="flex flex-col gap-0.5 p-1">
    <div className="text-[11px] sm:text-xs font-medium truncate">{rental.renter_name}</div>
    <div className="text-[11px] sm:text-xs flex items-center gap-1">
      R${rental.daily_rate}
      {rental.is_paid ? (
        <Check className="h-3 w-3 sm:h-3 sm:w-3 text-green-600" />
      ) : (
        <X className="h-3 w-3 sm:h-3 sm:w-3 text-red-600" />
      )}
    </div>
  </div>
);

const PeriodCell = ({ rental }: { rental?: RentalWithPeriod }) => {
  if (!rental) return <div className="flex-1 min-h-[3rem] sm:min-h-[2.5rem]" />;

  return (
    <div className={`flex-1 min-h-[3rem] sm:min-h-[2.5rem] ${rental.color} ${getTextColorForBg(rental.color)}`}>
      <RentalInfo rental={rental} />
    </div>
  );
};

const WEEKDAYS = [
  { short: 'D', full: 'Dom' },
  { short: 'S', full: 'Seg' },
  { short: 'T', full: 'Ter' },
  { short: 'Q', full: 'Qua' },
  { short: 'Q', full: 'Qui' },
  { short: 'S', full: 'Sex' },
  { short: 'S', full: 'Sáb' }
];

export function RentalCalendar({ rentals, currentMonth = new Date() }: RentalCalendarProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);

  const daysInMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1,
    0
  ).getDate();

  // Calculate the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth(),
    1
  ).getDay();

  // Calculate total cells needed (previous month days + current month days)
  const totalDays = daysInMonth;
  const totalCells = Math.ceil((totalDays + firstDayOfMonth) / 7) * 7;
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const getRentalsForDate = (day: number) => {
    const currentDate = new Date(
      selectedMonth.getFullYear(),
      selectedMonth.getMonth(),
      day,
      12
    );

    return {
      morning: findRentalsForPeriod(rentals, currentDate, true),
      afternoon: findRentalsForPeriod(rentals, currentDate, false)
    };
  };

  return (
    <div className="mt-4 -mx-4 sm:mx-0">
      <div className="flex justify-between items-center mb-4 px-4 sm:px-0">
        <button
          onClick={() =>
            setSelectedMonth(
              new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h2 className="text-base sm:text-lg font-semibold">
          {selectedMonth.toLocaleString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </h2>
        <button
          onClick={() =>
            setSelectedMonth(
              new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[2px] bg-gray-900">
        {WEEKDAYS.map((day, index) => (
          <div key={`weekday-${index}`} className="text-center text-[11px] sm:text-sm font-medium py-1.5 bg-white">
            <span className="sm:hidden">{day.short}</span>
            <span className="hidden sm:inline">{day.full}</span>
          </div>
        ))}
        
        {/* Empty cells for days before the first day of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-start-${index}`} className="bg-white h-32 sm:h-32" />
        ))}
        
        {/* Current month days */}
        {days.map((day) => {
          const { morning, afternoon } = getRentalsForDate(day);

          return (
            <div key={`day-${day}`} className="relative h-32 sm:h-32 bg-white">
              <div className="absolute inset-0 flex flex-col">
                <div className="text-[11px] sm:text-sm font-medium p-1 border-b border-gray-300">
                  {day}
                </div>
                <div className="flex-1 flex flex-col">
                  <PeriodCell rental={morning} />
                  <div className="border-t border-dashed border-gray-200" />
                  <PeriodCell rental={afternoon} />
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Empty cells for days after the last day of the month */}
        {Array.from({ length: totalCells - (firstDayOfMonth + daysInMonth) }).map((_, index) => (
          <div key={`empty-end-${index}`} className="bg-white h-32 sm:h-32" />
        ))}
      </div>
    </div>
  );
}