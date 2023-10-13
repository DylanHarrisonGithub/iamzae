import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import file from '../../services/file/file.service';

export default (request: ParsedRequest): Promise<RouterResponse> => new Promise(res => {

  request.files[Object.keys(request.files)[0]].mv('public/media/' + Object.keys(request.files)[0], async (err: any) => {
    if (err) {
      res({ code: 200, json: { success: false, messages: ["SERVER - ROUTES - UPLOADMEDIA - Failed to upload file."].concat(err.toString())} }); 
    } else {

      file.readDirectory(`public/media`).then(sr => {
        res({
          code: 200,
          json: {
            success: sr.success,
            messages: [
              sr.success ?
                "SERVER - ROUTES - UPLOADMEDIA - Successfully loaded media list!"
              :
                `Server - Routes - UPLOADMEDIA - Failed to load media list.`,
              ...sr.messages,
              "SERVER - ROUTES - UPLOADMEDIA - Media successfully uploaded!"
            ],
            body: sr.body
          }
        })
      });

    }
  });
  
});