import { Service, ServicePromise } from './services';

import { EventPerformance, timeData } from '../models/models';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

function getNthDayInMonth(nth: number, day: typeof weekdays[number], month: typeof months[number], year: number) {
  // Create new date for 1st of month
  let d = new Date(year, months.indexOf(month));
  // Move to first instance of day in month and 
  // add (n - 1) weeks
  d.setDate(1 + (7 - d.getDay() + weekdays.indexOf(day))%7 + (nth - 1)*7);
  return d;
};

const EventService = ((): typeof service extends Service ? typeof service : never => {
  const service = {

    periodPrases: (e: any): ServicePromise<string> => {
      if (
        ([...dates] as any[]).includes(e.day) &&
        ([...months] as any[]).includes(e.month) &&
        ([...years] as any[]).includes(e.year) &&
        ([...periods] as any[]).includes(e.period)
      ) {
        let { year, month, day, period } = (e as EventPerformance);
        const dayNum = (new Date(year, months.indexOf(month), day)).getDay();
        const weekday: typeof weekdays[number] = weekdays[dayNum];
        const dayCount = Math.floor((day-1) / 7) + 1;
        const dayCountSuffix = [ 'st', 'nd', 'rd', 'th', 'th' ];
        return new Promise(resolve => resolve({
          success: true,
          messages: [`CLIENT->SERVICES->EVENT->PERIODPHRASES: success.`],
          body: ({
            Once: ``,
            Daily: `Every day`,
            Weekly: `Every ${weekday}`,
            BiWeekly: `Every other ${weekday}`,
            Monthly: `The ${dayCount}${dayCountSuffix[dayCount-1]} ${weekday} of every month`
          })[period]
        }));
      }
      return new Promise(res => res({
        success: false,
        messages: [`CLIENT->SERVICES->EVENT->PERIODPHRASES: Could not generate period phrase because event was not valid.`]
      }));
    },
    
    // events are assumed to all be in same year
    generateEventCalendar: (events: EventPerformance[]): ServicePromise<{ [key in typeof months[number]]: { day: number, eventID: number }[] }> => {

      const calendar = months.reduce((a, m: string) => ({...a, [m]: []}), {} as {[key in typeof months[number]]: { day: number, eventID: number }[]} );

      const tempNewEvents: EventPerformance[] = [...events];
      tempNewEvents.filter(e => e.period === 'Once').forEach(e => calendar[e.month].push({ day: parseInt(e.day.toString()), eventID: e.id }));
      tempNewEvents.filter(e => e.period === 'Daily').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month), e.day);
        while (d.getFullYear().toString() === e.year.toString()) {
          calendar[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
          d.setDate(d.getDate() + 1);
        }
      });
      tempNewEvents.filter(e => e.period === 'Weekly').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month), e.day);
        while (d.getFullYear().toString() === e.year.toString()) {
          calendar[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
          d.setDate(d.getDate() + 7);
        }
      });
      tempNewEvents.filter(e => e.period === 'BiWeekly').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month), e.day);
        while (d.getFullYear().toString() === e.year.toString()) {
          calendar[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
          d.setDate(d.getDate() + 14);
        }
      });
      tempNewEvents.filter(e => e.period === 'Monthly').forEach(e => {
        let d = new Date(e.year, months.indexOf(e.month));
        const dayNum = (new Date(e.year, months.indexOf(e.month), e.day)).getDay();
        const weekday: typeof weekdays[number] = weekdays[dayNum];
        const dayCount = Math.floor((e.day-1) / 7) + 1;
        let eDay: Date;
        while (d.getFullYear().toString() === e.year.toString()) {
          eDay = getNthDayInMonth(dayCount, weekday, months[d.getMonth()], e.year);
          calendar[months[d.getMonth()]].push({ day: eDay.getDate(), eventID: e.id });
          d = new Date(e.year, d.getMonth() + 1);
        }
      });

      return new Promise(resolve => resolve({
        success: true,
        messages: [`CLIENT->SERVICES->EVENT->GENERATEEVENTCALENDAR: Event calendar generated.`],
        body: calendar
      }));
    },

    // events are assumed to all be in same year
    generateDerivedEvents: async (events: EventPerformance[]): ServicePromise<EventPerformance[]> => {

      const calendar = (await EventService.generateEventCalendar(events)).body!;

      return new Promise(resolve => resolve({
        success: true,
        messages: [`CLIENT->SERVICES->EVENT->GENERATEDERIVEDEVENTS: Derived Events generated.`],
        body: Object.keys(calendar).reduce((a, month: string) => [
          ...a,
          ...calendar[month as typeof months[number]].reduce((evs, evobj) => [
              ...evs,
              { ...events.find(e => e.id === evobj.eventID)!, day: evobj.day, month: month as typeof months[number] }
            ], [] as EventPerformance[])
        ], [] as EventPerformance[]).sort((a,b) => + ((new Date(a.year, months.indexOf(a.month), a.day)) > (new Date(b.year, months.indexOf(b.month), b.day))))
      }));
    }
  
  }

  return service;
})();

export default EventService;
