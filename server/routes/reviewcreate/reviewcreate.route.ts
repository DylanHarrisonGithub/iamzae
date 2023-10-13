import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Review } from '../../models/models';
import DB from '../../services/db/db.service';

import { timeData } from "../../models/models"

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
    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - REVIEWCREATE - New review ${dbRes.body!.id} created.`
        ].concat(dbRes.messages),
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
