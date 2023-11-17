import updateupdateRoute from './updateupdate/updateupdate.route';
import updateupdateSchema from './updateupdate/updateupdate.schema';
import updatecreateRoute from './updatecreate/updatecreate.route';
import updatecreateSchema from './updatecreate/updatecreate.schema';
import updatedeleteRoute from './updatedelete/updatedelete.route';
import updatedeleteSchema from './updatedelete/updatedelete.schema';
import updatestreamRoute from './updatestream/updatestream.route';
import updatestreamSchema from './updatestream/updatestream.schema';
import approvedreviewstreamRoute from './approvedreviewstream/approvedreviewstream.route';
import approvedreviewstreamSchema from './approvedreviewstream/approvedreviewstream.schema';
import contactstreamRoute from './contactstream/contactstream.route';
import contactstreamSchema from './contactstream/contactstream.schema';
import contactdeleteRoute from './contactdelete/contactdelete.route';
import contactdeleteSchema from './contactdelete/contactdelete.schema';
import contactcreateRoute from './contactcreate/contactcreate.route';
import contactcreateSchema from './contactcreate/contactcreate.schema';
import reviewstreamRoute from './reviewstream/reviewstream.route';
import reviewstreamSchema from './reviewstream/reviewstream.schema';
import reviewdeleteRoute from './reviewdelete/reviewdelete.route';
import reviewdeleteSchema from './reviewdelete/reviewdelete.schema';
import reviewupdateRoute from './reviewupdate/reviewupdate.route';
import reviewupdateSchema from './reviewupdate/reviewupdate.schema';
import reviewcreateRoute from './reviewcreate/reviewcreate.route';
import reviewcreateSchema from './reviewcreate/reviewcreate.schema';
import eventupdateRoute from './eventupdate/eventupdate.route';
import eventupdateSchema from './eventupdate/eventupdate.schema';
import eventdeleteRoute from './eventdelete/eventdelete.route';
import eventdeleteSchema from './eventdelete/eventdelete.schema';
import eventstreamRoute from './eventstream/eventstream.route';
import eventstreamSchema from './eventstream/eventstream.schema';
import eventcreateRoute from './eventcreate/eventcreate.route';
import eventcreateSchema from './eventcreate/eventcreate.schema';
import userupdateRoute from './userupdate/userupdate.route';
import userupdateSchema from './userupdate/userupdate.schema';
import userlistRoute from './userlist/userlist.route';
import userlistSchema from './userlist/userlist.schema';
import deletemediaRoute from './deletemedia/deletemedia.route';
import deletemediaSchema from './deletemedia/deletemedia.schema';
import uploadmediaRoute from './uploadmedia/uploadmedia.route';
import uploadmediaSchema from './uploadmedia/uploadmedia.schema';
import medialistRoute from './medialist/medialist.route';
import medialistSchema from './medialist/medialist.schema';
import loginRoute from './login/login.route';
import loginSchema from './login/login.schema';
import registerRoute from './register/register.route';
import registerSchema from './register/register.schema';

import { ParsedRequest } from "../services/requestParser/requestParser.service";
import { RouterResponse } from "../services/router/router.service";
import { Schema } from '../services/validation/validation.service';

import config from '../config/config';

export interface Route {
  method: string[],
  contentType: string,
  privilege: string[],
  schema: Schema,
  route: (request: ParsedRequest) => Promise<RouterResponse>
}

const routes: { [key: string]: Route } = {
 updateupdate: {
    method: ['PATCH'],
    contentType: "application/json",
    privilege: ['user'],
    schema: updateupdateSchema,
    route: updateupdateRoute 
  },
 updatecreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'],
    schema: updatecreateSchema,
    route: updatecreateRoute 
  },
 updatedelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: updatedeleteSchema,
    route: updatedeleteRoute 
  },
 updatestream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: updatestreamSchema,
    route: updatestreamRoute 
  },
 approvedreviewstream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: approvedreviewstreamSchema,
    route: approvedreviewstreamRoute 
  },
 contactstream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: contactstreamSchema,
    route: contactstreamRoute 
  },
 contactdelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: contactdeleteSchema,
    route: contactdeleteRoute 
  },
 contactcreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: contactcreateSchema,
    route: contactcreateRoute 
  },
 reviewstream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: reviewstreamSchema,
    route: reviewstreamRoute 
  },
 reviewdelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: reviewdeleteSchema,
    route: reviewdeleteRoute 
  },
 reviewupdate: {
    method: ['PATCH'],
    contentType: "application/json",
    privilege: ['user'],
    schema: reviewupdateSchema,
    route: reviewupdateRoute 
  },
 reviewcreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: reviewcreateSchema,
    route: reviewcreateRoute 
  },
 eventupdate: {
    method: ['PATCH'],
    contentType: "application/json",
    privilege: ['user'],
    schema: eventupdateSchema,
    route: eventupdateRoute 
  },
 eventdelete: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'],
    schema: eventdeleteSchema,
    route: eventdeleteRoute 
  },
 eventstream: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: eventstreamSchema,
    route: eventstreamRoute 
  },
 eventcreate: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user'],
    schema: eventcreateSchema,
    route: eventcreateRoute 
  },
 userupdate: {
    method: ['PATCH'],
    contentType: "application/json",
    privilege: ['user'],
    schema: userupdateSchema,
    route: userupdateRoute 
  },
 userlist: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['user'],
    schema: userlistSchema,
    route: userlistRoute 
  },
 deletemedia: {
    method: ['DELETE'],
    contentType: "application/json",
    privilege: ['user'], //(config.ENVIRONMENT === 'DEVELOPMENT') ? ['guest', 'admin'] : ['admin'],
    schema: deletemediaSchema,
    route: deletemediaRoute 
  },
 uploadmedia: {
    method: ['POST'],
    contentType: "application/json",
    privilege: ['user', 'admin'], //(config.ENVIRONMENT === 'DEVELOPMENT') ? ['guest', 'admin'] : ['admin'],
    schema: uploadmediaSchema,
    route: uploadmediaRoute 
  },
 medialist: {
    method: ['GET'],
    contentType: "application/json",
    privilege: ['guest'],
    schema: medialistSchema,
    route: medialistRoute 
  },
 login: {
    method: ["POST"],
    contentType: "application/json",
    privilege: ['guest'],
    schema: {}, //loginSchema,
    route: loginRoute 
  },
 register: {
    method: ["POST"],
    contentType: "application/json",
    privilege: (config.ENVIRONMENT === 'DEVELOPMENT') ? ['guest', 'admin'] : ['admin'],
    schema: registerSchema,
    route: registerRoute 
  },
}

export default routes;