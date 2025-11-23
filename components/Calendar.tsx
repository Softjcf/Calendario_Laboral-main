import React from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Holiday, HolidayType } from '../types';

interface CalendarProps {
  year: number;
  holidays: Holiday[];
}

const MonthGrid: React.FC<{ year: number; month: number; holidays: Holiday[] }> = ({ year, month, holidays }) => {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(startDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // 0 = Sunday, 1 = Monday... 6 = Saturday
  // Adjust to 0 = Monday, 6 = Sunday for grid offset
  const startDay = getDay(startDate);
  const offset = startDay === 0 ? 6 : startDay - 1;

  return (
    <div className="flex flex-col w-full">
      {/* Month Name - Increased margin below text to prevent line overlap */}
      <h3 className="text-center font-bold text-blue-900 capitalize text-xs leading-tight">
        {format(startDate, 'MMMM', { locale: es })}
      </h3>
      
      {/* Separator Line - Increased mt from 0.5 to 1 (4px) to clear descenders */}
      <div className="w-full h-px bg-blue-200 mt-1 mb-1.5"></div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 text-center mb-1.5">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <div key={d} className="font-bold text-blue-600 text-[9px] leading-none">{d}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-y-px gap-x-px text-center">
        {/* Empty cells for offset */}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {/* Day cells */}
        {days.map((day) => {
          const holiday = holidays.find(h => isSameDay(new Date(h.date), day));
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;
          
          let bgClass = '';
          let textClass = 'text-gray-700';

          if (holiday) {
            if (holiday.type === HolidayType.NATIONAL) {
              bgClass = 'bg-red-200 print:bg-red-200';
              textClass = 'text-red-800 font-bold';
            } else if (holiday.type === HolidayType.REGIONAL || holiday.type === HolidayType.ISLAND) {
              bgClass = 'bg-blue-200 print:bg-blue-200';
              textClass = 'text-blue-800 font-bold';
            } else if (holiday.type === HolidayType.LOCAL) {
              bgClass = 'bg-yellow-200 print:bg-yellow-200';
              textClass = 'text-yellow-800 font-bold';
            }
          } else if (isWeekend) {
             bgClass = 'bg-gray-100 print:bg-gray-100';
          }

          return (
            <div
              key={day.toISOString()}
              className={`flex items-center justify-center rounded-sm ${bgClass} ${textClass} h-7 w-full text-[10px] leading-none font-medium`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Calendar: React.FC<CalendarProps> = ({ year, holidays }) => {
  return (
    <div className="grid grid-cols-4 gap-x-5 gap-y-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <MonthGrid key={i} year={year} month={i} holidays={holidays} />
      ))}
    </div>
  );
};