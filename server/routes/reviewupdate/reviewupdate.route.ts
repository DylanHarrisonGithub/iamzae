import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import { Review } from '../../models/models';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest<
  { id: number, update: { approved: boolean } }
>): Promise<RouterResponse> => {

  var queryResult: { success: boolean, messages: string[] } = await db.row.update('review', request.params.update, { id: request.params.id });

  return new Promise(res => res({
    code: 200,
    json: {
      success: queryResult.success, 
      messages: queryResult.messages
    }
  }))
}