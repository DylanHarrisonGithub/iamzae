import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Contact } from '../../models/models';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string,
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id } = { ...request.params, search: request.params.search?.replace(/'/g, `''`) };

  const dbRes = id ?
      await DB.row.read<any[]>('contact', { id: id })
    :
      search ? 
        await DB.row.query(`SELECT * FROM "contact" WHERE search ILIKE '%${search}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)
      :
        await DB.row.stream<any[]>('contact', afterID, numrows);

  if (dbRes.success) {

    const contacts = dbRes.body as Contact[];

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - CONTACTSTREAM - Contacts streamed.`
        ].concat(dbRes.messages),
        body: contacts
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - CONTACTSTREAM - Contacts could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};