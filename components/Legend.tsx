import React from 'react';
import { Holiday, HolidayType } from '../types';
import { format } from 'date-fns';

interface LegendProps {
  holidays: Holiday[];
}

export const Legend: React.FC<LegendProps> = ({ holidays }) => {
  // Sort holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const getDotColor = (type: HolidayType) => {
    switch (type) {
      case HolidayType.NATIONAL: return 'bg-red-500';
      case HolidayType.REGIONAL: return 'bg-blue-500';
      case HolidayType.ISLAND: return 'bg-blue-400';
      case HolidayType.LOCAL: return 'bg-yellow-500';
    }
  };

  return (
    <div className="mt-4 border-t border-blue-200 pt-4">
      <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">Relación de Festivos {holidays.length > 0 ? new Date(holidays[0].date).getFullYear() : ''}</h4>
          <div className="flex gap-4 text-[10px] font-medium text-blue-800">
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-red-200 mr-1.5 border border-red-300"></span> Nacional</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-200 mr-1.5 border border-blue-300"></span> Autonómico/Insular</div>
            <div className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-yellow-200 mr-1.5 border border-yellow-300"></span> Local</div>
          </div>
      </div>

      {/* Changed to grid-cols-3 for wider items and better legibility, increased gap-y */}
      <div className="grid grid-cols-3 gap-x-2 gap-y-2.5 text-[10px] text-blue-900 leading-snug">
        {sortedHolidays.map((h, idx) => (
          <div key={idx} className="flex items-start">
             <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getDotColor(h.type)} mr-2 mt-0.5`} />
             <div className="flex-1">
                <span className="font-bold mr-1 opacity-90">
                    {format(new Date(h.date), 'dd/MM')}:
                </span>
                <span title={h.name} className="font-normal">{h.name}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};