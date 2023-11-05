import React from 'react';
import { useNavigate } from "react-router-dom";

import Calendar from '../calendar/calendar';
import Carousel from '../carousel/carousel';

import EventService from '../../services/event.service';

import { EventPerformance, timeData } from '../../models/models';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const EventsCalendar: React.FC<{year: number, events: EventPerformance[], onscroll?: (month: typeof months[number]) => any, display?: "CAROUSEL" | "GALLERY"}> = ({year, events, onscroll, display}) => {

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
    (async () => {
      const cds = (await EventService.generateEventCalendar(events)).body!;
      setCalendarDays(cds);
    })();
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
      <Carousel 
        categoryName="Events" 
        initScrollToItem={(year === (new Date()).getFullYear()) ? (new Date()).getMonth() : undefined} 
        onScroll={(item) => onscroll && onscroll(months[item]) }
      >
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