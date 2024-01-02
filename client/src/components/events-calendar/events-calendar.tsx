import React from 'react';
import { useNavigate } from "react-router-dom";

import Calendar from '../calendar/calendar';
import Carousel from '../carousel/carousel';

import EventService from '../../services/event.service';

import { EventPerformance, timeData } from '../../models/models';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

type EventsCalendarProps = {
  year: number, 
  events: EventPerformance[], 
  onscroll?: (month: typeof months[number]) => any, 
  display?: "CAROUSEL" | "GALLERY"
  displayMonths?: (typeof months[number])[]
}

const EventsCalendar: React.FC<EventsCalendarProps> = ({year, events, onscroll, display, displayMonths}) => {

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
      const cds = (await EventService.generateEventCalendar(events.filter(ev => ev.year.toString() === year.toString()))).body!;
      setCalendarDays(cds);
    })();
  }, [events, year]);

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
        disableBrowseAll={true}
        initScrollToItem={(year === (new Date()).getFullYear() && displayMonths?.includes(months[(new Date()).getMonth()])) ? (new Date()).getMonth() : undefined} 
        onScroll={(item) => onscroll && onscroll(months[item]) }
      >
        {
          months.filter(mName => displayMonths ? (displayMonths.includes(mName)) : true).map((mName, i) => (
            <Calendar key={i.toString()} month={months.indexOf(mName)} year={year} 
              highlights={ calendarDays[mName].map(cd => cd.day) }
              onDayClick={(d,m,y) => navigate(`/events/?search=${m+1}/${d}/${y}`)}
            />
          ))
        }
      </Carousel >
  );
}

export default EventsCalendar;