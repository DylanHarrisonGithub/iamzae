import { RouterResponse } from '../../services/router/router.service';

export default (request: any): Promise<RouterResponse> => new Promise(res => res({ code: 200, json: { success: true, message: ["updatedelete route works!"]} }));