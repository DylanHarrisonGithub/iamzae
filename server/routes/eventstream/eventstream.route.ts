import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { EventPerformance } from '../../models/models';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string,
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id } = request.params;

  const dbRes = id ?
      await DB.row.read<any[]>('event', { id: id })
    :
      search ? 
        await DB.row.query(`SELECT * FROM "event" WHERE search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)//DB.row.stream<any[]>('event', afterID, numrows)
      :
        await DB.row.stream<any[]>('event', afterID, numrows);

  if (dbRes.success) {

    const events = (dbRes.body?.map(e => ({ ...e, media: e.media?.length ? e.media.split(',') : [] })) as EventPerformance[]);

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - EVENTSTREAM - Events streamed.`
        ].concat(dbRes.messages),
        body: events
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - EVENTSTREAM - Events could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
  return new Promise(res => res({ code: 200, json: { success: true, message: ["eventstream route works!"]} }));
};