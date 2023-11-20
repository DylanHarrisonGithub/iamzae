import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import { Update } from '../../models/models';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<
  { id: number, update: { subject?: string, date?: string, update?: string } }
>): Promise<RouterResponse> => {

  var queryResult: { success: boolean, messages: string[] } = await db.row.update('update', request.params.update, { id: request.params.id });

  return new Promise(res => res({
    code: 200,
    json: {
      success: queryResult.success, 
      messages: queryResult.messages
    }
  }))
};