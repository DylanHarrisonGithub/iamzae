import { RouterResponse } from '../../services/router/router.service';

import file from '../../services/file/file.service';

export default async (request: any): Promise<RouterResponse<{
  success: boolean,
  messages: string[],
  body?: string[]
}>> => {

  const mList = await file.readDirectory('/public/media');

  return new Promise(res => res({
    code: 200,
    json: {
      success: mList.success, 
      messages: [
        mList.success ?
          "SERVER - ROUTES - MEDIALIST - Successfully loaded media list!"
        :
          `Server - Routes - MEDIALIST - Failed to load media list.`,
        ...mList.messages
      ],
      body: mList.body
    }
  }))
}