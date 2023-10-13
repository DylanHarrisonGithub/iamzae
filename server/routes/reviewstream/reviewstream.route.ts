import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Review } from '../../models/models';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string,
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id } = request.params;

  const dbRes = id ?
      await DB.row.read<any[]>('review', { id: id })
    :
      search ? 
        await DB.row.query(`SELECT * FROM "review" WHERE search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)//DB.row.stream<any[]>('event', afterID, numrows)
      :
        await DB.row.stream<any[]>('review', afterID, numrows);

  if (dbRes.success) {

    const reviews = dbRes.body as Review[];

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - REVIEWSTREAM - Reviews streamed.`
        ].concat(dbRes.messages),
        body: reviews
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - REVIEWSTREAM - Reviews could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};