import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { EventPerformance } from '../../models/models';
import DB from '../../services/db/db.service';

import { timeData } from "../../models/models"

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const toRegularTime = (militaryTime: string) => {
  const [hours, minutes] = militaryTime.split(':').map(t => parseInt(t));
  return `${(hours > 12) ? (hours - 12).toString().padStart(2,'0') : hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}${(hours >= 12) ? 'PM' : 'AM'}`;
}

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

  (event as any)['media'] = request.params.update.media?.join(','); // annoying

  const oldRes = await DB.row.read<EventPerformance[]>('event', { id: id });
  
  const oldE = { ...(oldRes.body?.[0] || {} ), ...event } as EventPerformance;

  const dbRes = (oldRes.success && oldRes.body && oldRes.body.length) ? 
    await DB.row.update('event', {...event, search: `${
      oldE.month}/${oldE.day}/${oldE.year}${
      oldE.month}-${oldE.day}-${oldE.year}${
      timeData.months.indexOf(oldE.month)+1}/${oldE.day}/${oldE.year}${
      timeData.months.indexOf(oldE.month)+1}-${oldE.day}-${oldE.year}${
      oldE.month}/${oldE.day.toString().padStart(2,'0')}/${oldE.year}${
      oldE.month}-${oldE.day.toString().padStart(2,'0')}-${oldE.year}${
      (timeData.months.indexOf(oldE.month)+1).toString().padStart(2,'0')}/${oldE.day.toString().padStart(2,'0')}/${oldE.year}${
      (timeData.months.indexOf(oldE.month)+1).toString().padStart(2,'0')}-${oldE.day.toString().padStart(2,'0')}-${oldE.year}${
      oldE.time}${toRegularTime(oldE.time)}${oldE.location}${oldE.description}${oldE.period}${oldE.website
    }`}, { id: id })
  :
    await DB.row.update('event', {...event }, { id: id });


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