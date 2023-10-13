import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { EventPerformance } from '../../models/models';
import DB from '../../services/db/db.service';

import { timeData } from '../../models/models';

const toRegularTime = (militaryTime: string) => {
  const [hours, minutes] = militaryTime.split(':').map(t => parseInt(t));
  return `${(hours > 12) ? (hours - 12).toString().padStart(2,'0') : hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}${(hours >= 12) ? 'PM' : 'AM'}`;
}

export default async (request: ParsedRequest<EventPerformance>): Promise<RouterResponse> => {

  const { ['id']: dropped, ['media']: media, ...event } = request.params;

  (event as any)['media'] = media?.join(','); // annoying

  event.timestamp = Date.now();

  const dbRes = await DB.row.create<EventPerformance>('event', {
    ...event, 
    search: `${
      event.month}/${event.day}/${event.year}${
      event.month}-${event.day}-${event.year}${
      timeData.months.indexOf(event.month)+1}/${event.day}/${event.year}${
      timeData.months.indexOf(event.month)+1}-${event.day}-${event.year}${
      event.month}/${event.day.toString().padStart(2,'0')}/${event.year}${
      event.month}-${event.day.toString().padStart(2,'0')}-${event.year}${
      (timeData.months.indexOf(event.month)+1).toString().padStart(2,'0')}/${event.day.toString().padStart(2,'0')}/${event.year}${
      (timeData.months.indexOf(event.month)+1).toString().padStart(2,'0')}-${event.day.toString().padStart(2,'0')}-${event.year}${
      event.time}${toRegularTime(event.time)}${event.location}${event.description}${event.period}${event.website
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
