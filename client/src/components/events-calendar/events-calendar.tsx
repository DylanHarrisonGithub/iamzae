import React from 'react';
import { useNavigate } from "react-router-dom";

import Calendar from '../calendar/calendar';
import Carousel from '../carousel/carousel';

import { EventPerformance, timeData } from '../../models/models';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

function getNthDayInMonth(nth: number, day: typeof weekdays[number], month: typeof months[number], year: number) {
  // Create new date for 1st of month
  let d = new Date(year, months.indexOf(month));
  // Move to first instance of day in month and 
  // add (n - 1) weeks
  d.setDate(1 + (7 - d.getDay() + weekdays.indexOf(day))%7 + (nth - 1)*7);
  return d;
};

const EventsCalendar: React.FC<{year: number, events: EventPerformance[], display?: "CAROUSEL" | "GALLERY"}> = ({year, events, display}) => {

  const navigate = useNavigate();

  const [calendarDays, setCalendarDays] = React.useState<{ [key in typeof months[number]]: { day: number, eventID: number }[]}>({ //months.reduce((a,m) => ({...a, [m]: []}), {});
    January: [],
    February: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: [],
  });

  React.useEffect(() => {
    setCalendarDays(cd => {
      const tempNewEvents: EventPerformance[] = [...events];
      tempNewEvents.forEach(e => cd[e.month].push({ day: parseInt(e.day.toString()), eventID: e.id }));
      tempNewEvents.filter(e => e.period === 'Daily').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month), e.day);
        while (d.getFullYear() === 2023) {
          cd[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
          d.setDate(d.getDate() + 1);
        }
      });
      tempNewEvents.filter(e => e.period === 'Weekly').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month), e.day);
        while (d.getFullYear() === 2023) {
          cd[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
          d.setDate(d.getDate() + 7);
        }
      });
      tempNewEvents.filter(e => e.period === 'BiWeekly').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month), e.day);
        while (d.getFullYear() === 2023) {
          cd[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
          d.setDate(d.getDate() + 14);
        }
      });
      tempNewEvents.filter(e => e.period === 'Monthly').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month));
        const dayNum = (new Date(e.year, months.indexOf(e.month), e.day)).getDay();
        const weekday: typeof weekdays[number] = weekdays[dayNum];
        const dayCount = Math.floor((e.day-1) / 7) + 1;
        let eDay: Date;
        while (d.getFullYear() === 2023) {
          eDay = getNthDayInMonth(dayCount, weekday, months[d.getMonth()], e.year);
          cd[months[d.getMonth()]].push({ day: eDay.getDate(), eventID: e.id });
          d = new Date(e.year, d.getMonth() + 1);
        }
      });
      return cd
    });
  }, [events]);

  return (
    (display && display === "GALLERY") ?
      <div className='text-center'>
        {
          Array.from(Array(12)).map((n, i) => (
            <div className='inline-block m-1'>
              <Calendar key={i.toString()} month={i} year={year} 
                highlights={ calendarDays[months[i]].map(cd => cd.day) }
                onDayClick={(d,m,y) => navigate(`/events/?search=${m+1}/${d}/${y}`)}
              />
            </div>
          ))
        }
      </div>
    :
      <Carousel categoryName="Events" initScrollToItem={(year === (new Date()).getFullYear()) ? (new Date()).getMonth() : undefined}>
        {
          Array.from(Array(12)).map((n, i) => (
            <Calendar key={i.toString()} month={i} year={year} 
              highlights={ calendarDays[months[i]].map(cd => cd.day) }
              onDayClick={(d,m,y) => navigate(`/events/?search=${m+1}/${d}/${y}`)}
            />
          ))
        }
      </Carousel >
  );
}

export default EventsCalendar;