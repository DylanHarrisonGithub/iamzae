import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { EventPerformance } from '../../models/models';
import DB from '../../services/db/db.service';

import { timeData } from '../../models/models';

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


export default async (request: ParsedRequest<{
  id: string | number,
  update: {
    id?: number | string,
    day?: number | string,
    month?: string,
    year?: string | number,
    time?: string,
    location?: string,
    thumbnail?: string,
    description?: string,
    website?: string,
    period?: string,
    media?: string[]
  }
}>): Promise<RouterResponse> => {

  const { id } = request.params;
  let { ['id']: dropped, ['media']: dropped2, ...event } = request.params.update;

  const oldRes = await DB.row.read<EventPerformance[]>('event', { id: id });
  if (!oldRes.success && oldRes.body && oldRes.body.length) {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - EVENTUPDATE - Event ${ id } could not be updated.`
        ].concat(oldRes.messages),
        body: { event: request.params }
      }
    }));
  }

  (event as any)['media'] = request.params.update.media?.join(',') || oldRes.body![0].media; // annoying
  
  const oldE = { ...(oldRes.body?.[0] || {} ), ...event } as EventPerformance;

  let periodicDates = '';
  if (oldE.period !== 'Once') {
    if (oldE.period === 'Monthly') {
      let d = new Date(oldE.year, months.indexOf(oldE.month));
      const dayNum = (new Date(oldE.year, months.indexOf(oldE.month), oldE.day)).getDay();
      const weekday: typeof weekdays[number] = weekdays[dayNum];
      const dayCount = Math.floor((oldE.day-1) / 7) + 1;
      let eDay: Date;
      while (d.getFullYear() === oldE.year) {
        eDay = getNthDayInMonth(dayCount, weekday, months[d.getMonth()], oldE.year);

        periodicDates += `${
          months[d.getMonth()]}/${eDay.getDate().toString().padStart(2,'0')}/${d.getFullYear()}${
          months[d.getMonth()]}/${oldE.year
        }`;

        d = new Date(oldE.year, d.getMonth() + 1);
      }
    } else {
      let d = new Date(oldE.year, months.indexOf(oldE.month), oldE.day);
      while (d.getFullYear() === oldE.year) {
        periodicDates += `${
          months[d.getMonth()]}/${d.getDate().toString().padStart(2,'0')}/${d.getFullYear()}${
          months[d.getMonth()]}/${d.getFullYear()
        }`;

        d.setDate(d.getDate() + {         
            "Daily": 1,
            "Weekly": 7,
            "BiWeekly": 14
          }[oldE.period]
        );
      }
    }
  } else {
    periodicDates = `${
      oldE.month}/${oldE.day}/${oldE.year}${
      oldE.month}/${oldE.year
    }`;
  }

  const dbRes = (oldRes.success && oldRes.body && oldRes.body.length) ? 
    await DB.row.update('event', {
      ...event, 
      search: `${
        periodicDates}${
        oldE.time}${
        toRegularTime(oldE.time)}${
        oldE.location}${
        oldE.description}${
        oldE.period}${
        oldE.website
      }`
    }, { id: id })
  :
    await DB.row.update('event', {...event }, { id: id }); // why did i do this ???


  if (dbRes.success) {
    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - EVENTUPDATE - Event ${ id } updated.`
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
          `SERVER - ROUTES - EVENTUPDATE - Event ${ id } could not be updated.`
        ].concat(dbRes.messages),
        body: { event: request.params }
      }
    }));
  }
};