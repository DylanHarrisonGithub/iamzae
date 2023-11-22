import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';

import file from '../../services/file/file.service';

const acceptedMedia = ['mp3', 'wav', 'ogg'];

export default (request: ParsedRequest): Promise<RouterResponse> => new Promise(res => {

  request.files[Object.keys(request.files)[0]].mv('public/tracks/' + Object.keys(request.files)[0], async (err: any) => {
    if (err) {
      res({ code: 200, json: { success: false, messages: ["SERVER - ROUTES - UPLOADTRACK - Failed to upload file."].concat(err.toString())} }); 
    } else {

      file.readDirectory(`public/tracks`).then(sr => {
        res({
          code: 200,
          json: {
            success: sr.success,
            messages: [
              sr.success ?
                "SERVER - ROUTES - UPLOADTRACK - Successfully loaded track list!"
              :
                `Server - Routes - UPLOADTRACK - Failed to load track list.`,
              ...sr.messages,
              "SERVER - ROUTES - UPLOADTRACK - Track successfully uploaded!"
            ],
            body: sr.body
          }
        })
      });

    }
  });
  
});