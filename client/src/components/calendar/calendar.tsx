import React from 'react';

interface CalendarProps {
  year: number;
  month: number;
  onDayClick?: (day: number, month: number, year: number) => void;
  highlights?: number[],
  controls?: boolean,
  onCalendarChange?: (newYear: number, newMonth: number) => any;
}

const daysInMonth = (year: number, month: number): number => {
  return new Date(year, month+1, 0).getDate();
};

const getFirstDayIndex = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

const generateCalendarDays = (year: number, month: number): number[] => {
  const totalDays = daysInMonth(year, month);
  const firstDayIndex = getFirstDayIndex(year, month);
  
  const days = Array.from({ length: firstDayIndex }, () => 0); // Fill empty slots with 0
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return days;
};

const Calendar: React.FC<CalendarProps> = ({ year, month, onDayClick, highlights, controls, onCalendarChange }) => {
  
  const [calendarDays, setCalendarDays] = React.useState(generateCalendarDays(year, month));
  const [internalYear, setInternalYear] = React.useState(year);
  const [internalMonth, setInternalMonth] = React.useState(month);

  const handleDayClick = (day: number) => {
    if (day !== 0 && onDayClick) {
      onDayClick(day, internalMonth, internalYear);
    }
  };

  return (
    <div className="bg-white shadow rounded w-96 ">
      <div className='glass2 w-full h-full'>

        <h2 className="text-lg pt-4 text-blue-600 font-semibold text-center">
          {/* { JSON.stringify(highlights) } */}
          { controls && (
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512" className='inline pb-1 mx-12 hover:cursor-pointer hover:text-blue-600'
              onClick={() => {
                if (internalYear > 0) {
                  setCalendarDays(generateCalendarDays(internalYear - 1, internalMonth));
                  onCalendarChange && onCalendarChange(internalYear - 1, internalMonth);
                  setInternalYear(iy => iy - 1);
                }
              }}
            ><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
          )}
          {new Date(internalYear, internalMonth).toLocaleString('default', { year: 'numeric' })}
          { controls && (
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512" className='inline pb-1 mx-12 hover:cursor-pointer hover:text-blue-600'
              onClick={() => {
                setCalendarDays(generateCalendarDays(internalYear + 1, internalMonth));
                onCalendarChange && onCalendarChange(internalYear + 1, internalMonth);
                setInternalYear(iy => iy + 1);
              }}
            ><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
          )}
        </h2>
        <h2 className="text-lg text-purple-600 font-semibold mb-4 text-center">
          { controls && (
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512" className='inline pb-1 mx-12 hover:cursor-pointer hover:text-blue-600'
              onClick={() => {
                setCalendarDays(generateCalendarDays(internalYear, (internalMonth - 1 + 12) % 12));
                onCalendarChange && onCalendarChange(internalYear, (internalMonth - 1 + 12) % 12);
                setInternalMonth(im => (im - 1 + 12) % 12);
              }}
            ><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"/></svg>
          )}
          {new Date(internalYear, internalMonth).toLocaleString('default', { month: 'long' })}
          { controls && (
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512" className='inline pb-1 mx-12 hover:cursor-pointer hover:text-blue-600'
              onClick={() => {
                setCalendarDays(generateCalendarDays(internalYear, (internalMonth + 1 + 12) % 12));
                onCalendarChange && onCalendarChange(internalYear, (internalMonth + 1 + 12) % 12);
                setInternalMonth(im => (im + 1 + 12) % 12);
              }}
            ><path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"/></svg>
          )}
        </h2>
        <div className="grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold">{day}</div>
          ))}
        </div>
        <hr/>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <div 
              key={index} 
              className={`text-center py-4 rounded cursor-pointer hover:bg-violet-600 active:bg-orange-400 ${
                day === 0 ? 'invisible' : 'cursor-pointer'} ${
                (highlights && highlights.includes(day)) ? `bg-orange-300` : ''}
              `} 
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default Calendar;
