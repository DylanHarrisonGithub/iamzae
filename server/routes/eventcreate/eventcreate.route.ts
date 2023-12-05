import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import DB from '../../services/db/db.service';

import { EventPerformance, timeData } from '../../models/models';


const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const toRegularTime = (militaryTime: string) => {
  const [hours, minutes] = militaryTime.split(':').map(t => parseInt(t));
  return `${(hours > 12) ? (hours - 12).toString().padStart(2,'0') : hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}${(hours >= 12) ? 'PM' : 'AM'}`;
};

function getNthDayInMonth(nth: number, day: typeof weekdays[number], month: typeof months[number], year: number) {
  // Create new date for 1st of month
  let d = new Date(year, months.indexOf(month));
  // Move to first instance of day in month and 
  // add (n - 1) weeks
  d.setDate(1 + (7 - d.getDay() + weekdays.indexOf(day))%7 + (nth - 1)*7);
  return d;
};


export default async (request: ParsedRequest<EventPerformance>): Promise<RouterResponse> => {

  const { ['id']: dropped, ['media']: media, ...event } = request.params;

  (event as any)['media'] = media?.join(',') || ''; // annoying

  event.timestamp = Date.now();

  let periodicDates = '';
  if (event.period !== 'Once') {
    if (event.period === 'Monthly') {
      let d = new Date(event.year, months.indexOf(event.month));
      const dayNum = (new Date(event.year, months.indexOf(event.month), event.day)).getDay();
      const weekday: typeof weekdays[number] = weekdays[dayNum];
      const dayCount = Math.floor((event.day-1) / 7) + 1;
      let eDay: Date;
      while (d.getFullYear() === event.year) {
        eDay = getNthDayInMonth(dayCount, weekday, months[d.getMonth()], event.year);

        periodicDates += `${
          months[d.getMonth()]}/${eDay.getDate().toString().padStart(2,'0')}/${d.getFullYear()}${
          months[d.getMonth()]}/${event.year
        }`;

        d = new Date(event.year, d.getMonth() + 1);
      }
    } else {
      let d = new Date(event.year, months.indexOf(event.month), event.day);
      while (d.getFullYear() === event.year) {
        periodicDates += `${
          months[d.getMonth()]}/${d.getDate().toString().padStart(2,'0')}/${d.getFullYear()}${
          months[d.getMonth()]}/${d.getFullYear()
        }`;

        d.setDate(d.getDate() + {         
            "Daily": 1,
            "Weekly": 7,
            "BiWeekly": 14
          }[event.period]
        );
      }
    }
  } else {
    periodicDates = `${
      event.month}/${event.day}/${event.year}${
      event.month}/${event.year
    }`;
  }

  const dbRes = await DB.row.create<EventPerformance>('event', {
    ...event, 
    search: `${
      periodicDates}${
      event.time}${
      toRegularTime(event.time)}${
      event.location}${
      event.description}${
      event.period}${
      event.website
    }`
  });

  if (dbRes.success) {


    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - EVENTCREATE - New event ${dbRes.body!.id} created.`
        ].concat(dbRes.messages),
        body: { event: dbRes.body }
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - EVENTCREATE - New event could not be created.`
        ].concat(dbRes.messages),
        body: { event: request.params }
      }
    }));
  }
};
