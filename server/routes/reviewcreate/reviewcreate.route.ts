import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import DB from '../../services/db/db.service';
import email from '../../services/email/email.service';

import { Review, timeData } from "../../models/models"
import config from '../../config/config';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export default async (request: ParsedRequest<{
  event: number,
  name: string,
  stars: number | string,
  text: string
}>): Promise<RouterResponse> => {

  type NewReview = Omit<Review, "id">;

  let dateObj = new Date();
  let month = dateObj.toLocaleString('default', { month: 'long' }) as typeof months[number];
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  const review: NewReview = {
    event: request.params.event,
    timestamp: Date.now(),
    approved: false,
    name: request.params.name,
    stars: parseInt(request.params.stars.toString()),
    text: request.params.text,
    search: `${
      month}/${day}/${year}${
      month}-${day}-${year}${
      timeData.months.indexOf(month)+1}/${day}/${year}${
      timeData.months.indexOf(month)+1}-${day}-${year}${
      month}/${day.toString().padStart(2,'0')}/${year}${
      month}-${day.toString().padStart(2,'0')}-${year}${
      (timeData.months.indexOf(month)+1).toString().padStart(2,'0')}/${day.toString().padStart(2,'0')}/${year}${
      (timeData.months.indexOf(month)+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}-${year}${
      request.params.stars}${request.params.name}${request.params.text
    }`
  };

  const dbRes = await DB.row.create<Review>('review', review);

  if (dbRes.success) {

    const emailRes = await email(
      config.ADMIN_EMAIL || config.NODEMAILER.EMAIL, 
      `Review from ${review.name} needs approval`,
      undefined,
      `
        <table>
          <tr>
            <td>Review ID:</td>
            <td>${dbRes.body?.id || 'no id'}</td>
          </tr>
          <tr>
            <td>Event ID:</td>
            <td>${review.event}</td>
          </tr>
          <tr>
            <td>Review date:</td>
            <td>${month}/${day}/${year}</td>
          </tr>
          <tr>
            <td>Reviewer name:</td>
            <td>${review.name}</td>
          </tr>
          <tr>
            <td>Rating:</td>
            <td>${review.stars}</td>
          </tr>
          <tr>
            <td>Review:</td>
            <td>${review.text}</td>
          </tr>
        </table>
        <p>Pleave visit <a href="${
          config.ENVIRONMENT === 'DEVELOPMENT' ? 
            `http://localhost:4200` 
          : 
            `https://${request.host}`
          }/admin/reviews/${dbRes.body?.id || ''
        }">here</a> to approve or reject this review.</p>
      `
    );

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - REVIEWCREATE - New review ${dbRes.body!.id} created.`
        ].concat(dbRes.messages).concat(emailRes.messages),
        body: { review: dbRes.body }
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - REVIEWCREATE - New review could not be created.`
        ].concat(dbRes.messages),
        body: { review: request.params }
      }
    }));
  }
};
