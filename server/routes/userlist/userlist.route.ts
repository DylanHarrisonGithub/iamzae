import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import { User } from '../../models/models';

import db from '../../services/db/db.service';

export default async (request: ParsedRequest): Promise<RouterResponse> => {

  var queryResult: { success: boolean, messages: string[], body?: User[] };

  if (request.params.id) {
    if (request.params.numrows) {
      queryResult = await db.row.stream<User[]>('user', request.params.id, request.params.numrows)
    } else {
      queryResult = await db.row.read<User[]>('user', { id: request.params.id });
    }
  } else {
    queryResult = await db.row.read<User[]>('user');
  }
  
  return new Promise(res => res({
    code: 200,
    json: {
      success: queryResult.success, 
      messages: queryResult.messages,
      body: queryResult.body?.map(({id, username, avatar, privilege}) => ({ id: id, username: username, avatar: avatar, privilege: privilege }))
    }
  }));
}