import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { isWithinInterval, startOfDay, endOfDay, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Rental } from '../../types/rental';
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
  rentals: Rental[];
  excludeDate?: Date;
  minDate?: Date;
}

export function CustomDatePicker({ selectedDate, onChange, rentals, excludeDate, minDate }: CustomDatePickerProps) {
  const getDateStatus = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    let morningOccupied = false;
    let afternoonOccupied = false;

    for (const rental of rentals) {
      const checkIn = startOfDay(new Date(rental.check_in));
      const checkOut = startOfDay(new Date(rental.check_out));

      // Check-in day: afternoon is occupied
      if (isSameDay(dayStart, checkIn)) {
        afternoonOccupied = true;
      }

      // Check-out day: morning is occupied
      if (isSameDay(dayStart, checkOut)) {
        morningOccupied = true;
      }

      // Days between check-in and check-out are fully occupied
      if (isWithinInterval(dayStart, { start: checkIn, end: checkOut }) && 
          !isSameDay(dayStart, checkIn) && 
          !isSameDay(dayStart, checkOut)) {
        morningOccupied = true;
        afternoonOccupied = true;
      }
    }

    if (morningOccupied && afternoonOccupied) return 'fully-booked';
    if (morningOccupied) return 'morning-booked';
    if (afternoonOccupied) return 'afternoon-booked';
    return 'available';
  };

  const renderDayContents = (day: number, date: Date) => {
    const status = getDateStatus(date);
    
    return (
      <div className="relative w-8 h-8 flex items-center justify-center">
        {status === 'fully-booked' && (
          <div className="absolute inset-0 bg-red-100 rounded-full" />
        )}
        {status === 'morning-booked' && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-white rounded-full" />
        )}
        {status === 'afternoon-booked' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white to-red-100 rounded-full" />
        )}
        <span className="relative z-10">{day}</span>
      </div>
    );
  };

  const isDateDisabled = (date: Date) => {
    const status = getDateStatus(date);
    return status === 'fully-booked';
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date) => onChange(date)}
          dateFormat="dd/MM/yyyy"
          locale={ptBR}
          minDate={minDate || new Date()}
          excludeDates={excludeDate ? [excludeDate] : undefined}
          renderDayContents={renderDayContents}
          filterDate={date => !isDateDisabled(date)}
          className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}