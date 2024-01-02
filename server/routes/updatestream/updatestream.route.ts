import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Update } from '../../models/models';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id } = { ...request.params, search: request.params.search?.replace(/'/g, `''`) };

  const dbRes = 
    id ?
      await DB.row.read<Update[]>('update', { id: id })
    :
      search ?
        await DB.row.query<Update[]>(`SELECT * FROM "update" WHERE search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)
      :
        await DB.row.stream<Update[]>('update', afterID, numrows);

  if (dbRes.success) {

    const updates = dbRes.body;

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - UPDATESTREAM - updates streamed.`
        ].concat(dbRes.messages),
        body: updates
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - UPDATESTREAM - updates could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};