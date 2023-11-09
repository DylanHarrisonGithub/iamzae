import { Service, ServicePromise } from './services';

import { EventPerformance, timeData } from '../models/models';

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
    },

    getFilteredEvents: async (events: EventPerformance[], search: string): ServicePromise<EventPerformance[]> => {

      // attempt format date and date-like searches to standard [monthname]/[dd]/[yyyy] or [monthname]/[yyyy]
      let mappedSearch = search; 
      if (mappedSearch) {
        mappedSearch = mappedSearch.trim().replace(/\s+/g, '/').replace(/-/g, '/');
        const searchSplit = mappedSearch.split('/');
        if (searchSplit.length === 3) {
          let timestamp = Date.parse(mappedSearch);
          if (!isNaN(timestamp)) {
            let d = new Date(timestamp);
            mappedSearch = `${months[d.getMonth()]}/${d.getDate()}/${d.getFullYear()}`
          } else {
            mappedSearch = search; // give up
          }
        } else if (searchSplit.length === 2 && searchSplit[0].length) {
          if (isNaN(searchSplit[0] as any)) {
            searchSplit[0] = searchSplit[0].charAt(0).toUpperCase() + searchSplit[0].slice(1).toLowerCase();
            if (months.includes(searchSplit[0] as any)) {
              mappedSearch = mappedSearch = `${searchSplit[0]}/${searchSplit[1].padStart(4, '20')}`;
            } else {
              mappedSearch = search;
            }
          } else {
            let m = parseInt(searchSplit[0]);
            if (m >= 1 && m <= 12) {
              mappedSearch = mappedSearch = `${months[m-1]}/${searchSplit[1].padStart(4, '20')}`;
            } else {
              mappedSearch = search;
            }
          }
        } else {
          mappedSearch = search; // give up october  2023
        }
      }
      
      mappedSearch = mappedSearch.toUpperCase();

      return new Promise(resolve => resolve({
        success: true,
        messages: [`CLIENT->SERVICES->EVENT->GENERATEDERIVEDEVENTS: Derived Events generated.`],
        body: events.filter(event => `${
            event.month}/${event.day}/${event.year}${
            event.month}/${event.year}${
            event.time}${
            toRegularTime(event.time)}${
            event.location}${
            event.description}${
            event.period}${
            event.website
          }`.toUpperCase().includes(mappedSearch)
        )
      }));
    },


    urlEncodeEvent: async (e: EventPerformance): ServicePromise<string> => {
      return new Promise(resolve => resolve({
        success: true,
        messages: [`CLIENT->SERVICES->EVENT->URLENCODEEVENT: Event encoded.`],
        body: btoa(JSON.stringify(e))
      }));
    },
    urlDecodeEvent: async (encodedEvent: string): ServicePromise<EventPerformance> => {
      try {
        const decodedEvent = JSON.parse(atob(encodedEvent)) as EventPerformance;
        const valid = [
          'id',
          'day',
          'month',
          'year',
          'time',
          'timestamp',
          'period',
          'location',
          'thumbnail',
          'description',
          'website',
          'media'
        ].reduce((a, key) => a && Object.keys(decodedEvent).includes(key), true);

        if (!valid) {
          return new Promise(resolve => resolve({
            success: false,
            messages: [`CLIENT->SERVICES->EVENT->URLENCODEEVENT: Event could not be decoded.`]
          }));
        } 
        return new Promise(resolve => resolve({
          success: true,
          messages: [`CLIENT->SERVICES->EVENT->URLENCODEEVENT: Event decoded.`],
          body: decodedEvent
        }));
      } catch (err) {
        return new Promise(resolve => resolve({
          success: false,
          messages: [`CLIENT->SERVICES->EVENT->URLENCODEEVENT: Event could not be decoded.`]
        }));
      }
    }
  
  }


  return service;
})();

export default EventService;
