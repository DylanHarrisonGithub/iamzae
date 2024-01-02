import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Review } from '../../models/models';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string,
  event?: number,
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id, event } = { ...request.params, search: request.params.search?.replace(/'/g, `''`) };

  const dbRes = 
    id ?
      await DB.row.read<any[]>('review', { id: id, approved: 'true' })
    :
      search ?
        event ?
          await DB.row.query(`SELECT * FROM "review" WHERE event = ${parseInt(event.toString())} AND approved = 'true' AND search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)
        :
          await DB.row.query(`SELECT * FROM "review" WHERE approved = 'true' AND search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)//DB.row.stream<any[]>('event', afterID, numrows)
      :
        event ?
          await DB.row.stream<any[]>('review', afterID, numrows, { event: parseInt(event.toString()), approved: 'true' })
        :
          await DB.row.stream<any[]>('review', afterID, numrows, { approved: 'true' });

  if (dbRes.success) {

    const reviews = dbRes.body as Review[];

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - APPROVEDREVIEWSTREAM - Reviews streamed.`
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
          `SERVER - ROUTES - APPROVEDREVIEWSTREAM - Reviews could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};