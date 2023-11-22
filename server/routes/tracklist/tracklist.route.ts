import { RouterResponse } from '../../services/router/router.service';

import file from '../../services/file/file.service';

export default async (request: any): Promise<RouterResponse<{
  success: boolean,
  messages: string[],
  body?: string[]
}>> => {

  const mList = await file.readDirectory('/public/tracks');

  return new Promise(res => res({
    code: 200,
    json: {
      success: mList.success, 
      messages: [
        mList.success ?
          "SERVER - ROUTES - TRACKLIST - Successfully loaded track list!"
        :
          `Server - Routes - TRACKLIST - Failed to load track list.`,
        ...mList.messages
      ],
      body: mList.body
    }
  }))
}