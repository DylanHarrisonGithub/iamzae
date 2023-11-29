import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import file from '../../services/file/file.service';

export default async (request: ParsedRequest): Promise<RouterResponse> => {

  if (!(request.params.filename)) {
    return new Promise(res => res({ 
      code: 400, 
      json: {
        success: false, 
        messages: ["SERVER - ROUTES - DELETETRACK - Filename not provided."],
      } 
    }));
  }
  console.log('attempting to delete');
  try {
    const resDel = await file.delete(`public/tracks/` + request.params.filename);
    console.log('hello', resDel);
    return new Promise(res => res({ code: 200, json: { success: true, messages: [
      `SERVER - ROUTES - DELETETRACK - Media file ${request.params.filename} successfully deleted.`,
      ...resDel.messages
    ]} }));

  } catch (err: any) {
    return new Promise(res => res({ code: 404, json: { success: false, messages: [
      `SERVER - ROUTES - DELETETRACK - Media file ${request.params.filename} could not be deleted.`,
      err.toString()
    ]} }));
  }
  
};