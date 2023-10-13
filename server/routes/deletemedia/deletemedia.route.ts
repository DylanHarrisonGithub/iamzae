import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import file from '../../services/file/file.service';

export default async (request: ParsedRequest): Promise<RouterResponse> => {

  if (!(request.params.filename)) {
    return new Promise(res => res({ 
      code: 400, 
      json: {
        success: false, 
        messages: ["SERVER - ROUTES - DELETEMEDIA - Filename not provided."],
      } 
    }));
  }

  try {
    const res = await file.delete(`public/media/` + request.params.filename);
    return new Promise(res => res({ code: 200, json: { success: true, messages: [`SERVER - ROUTES - DELETEMEDIA - Media file ${request.params.filename} successfully deleted.`]} }));
  } catch (err: any) {
    return new Promise(res => res({ code: 404, json: { success: false, messages: [
      `SERVER - ROUTES - DELETEMEDIA - Media file ${request.params.filename} could not be deleted.`,
      err.toString()
    ]} }));
  }
  
};