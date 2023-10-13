import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import DB from '../../services/db/db.service';

export default async (request: ParsedRequest<{ id: number }>): Promise<RouterResponse> => {

  const { id } = request.params;

  const dbRes = await DB.row.delete('review', { id: id })

  if (dbRes.success) {
    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - REVIEWDELETE - Review deleted.`
        ].concat(dbRes.messages),
        body: dbRes.body
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - REVIEWDELETE - Review could not be deleted.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
};