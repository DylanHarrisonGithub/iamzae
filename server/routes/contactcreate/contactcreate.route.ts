import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import DB from '../../services/db/db.service';
import email from '../../services/email/email.service';

import { Contact, timeData } from "../../models/models"
import config from '../../config/config';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export default async (request: ParsedRequest<{
  email: string,
  subject?: string,
  message: string
}>): Promise<RouterResponse> => {

  type NewContact = Omit<Contact, "id">;

  let dateObj = new Date();
  let month = dateObj.toLocaleString('default', { month: 'long' }) as typeof months[number];
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  const contact: NewContact = {
    email: request.params.email,
    subject: request.params.subject || '',
    message: request.params.message,
    timestamp: Date.now(),
    search: `${
      month}/${day}/${year}${
      month}-${day}-${year}${
      timeData.months.indexOf(month)+1}/${day}/${year}${
      timeData.months.indexOf(month)+1}-${day}-${year}${
      month}/${day.toString().padStart(2,'0')}/${year}${
      month}-${day.toString().padStart(2,'0')}-${year}${
      (timeData.months.indexOf(month)+1).toString().padStart(2,'0')}/${day.toString().padStart(2,'0')}/${year}${
      (timeData.months.indexOf(month)+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}-${year}${
      request.params.email}${request.params.subject}${request.params.message
    }`
  };

  const dbRes = await DB.row.create<Contact>('contact', contact);

  if (dbRes.success) {

    const emailRes = await email(
      config.ADMIN_EMAIL || config.NODEMAILER.EMAIL, 
      `New contact from ${contact.email}`,
      undefined,
      `
        <table>
          <tr>
            <td>Contact ID:</td>
            <td>${dbRes.body?.id || 'no id'}</td>
          </tr>
          <tr>
            <td>From: </td>
            <td>${contact.email}</td>
          </tr>
          <tr>
            <td>Contact date:</td>
            <td>${month}/${day}/${year}</td>
          </tr>
          <tr>
            <td>Subject:</td>
            <td>${contact.subject}</td>
          </tr>
          <tr>
            <td>Message:</td>
            <td>${contact.message}</td>
          </tr>
        </table>
        <p>Pleave visit <a href="${
          config.ENVIRONMENT === 'DEVELOPMENT' ? 
            `http://localhost:4200` 
          : 
            `https://${request.host}`
          }/admin/contacts/${dbRes.body?.id || ''
        }">here</a> to view or delete this contact message.</p>
      `
    );


    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - CONTACTCREATE - New contact ${dbRes.body!.id} created.`
        ].concat(dbRes.messages).concat(emailRes.messages),
        body: { contact: dbRes.body }
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - CONTACTCREATE - New contact could not be created.`
        ].concat(dbRes.messages),
        body: { contact: request.params }
      }
    }));
  }
};
