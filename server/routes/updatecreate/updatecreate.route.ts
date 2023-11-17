import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { Update } from '../../models/models';
import DB from '../../services/db/db.service';

import { timeData } from "../../models/models"

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export default async (request: ParsedRequest<{
  subject: string,
  date: string,
  update: string
}>): Promise<RouterResponse> => {

  const { subject, date, update } = request.params;

  type NewUpdate = Omit<Update, "id">;

  let dateObj = new Date(date);
  let month = dateObj.toLocaleString('default', { month: 'long' }) as typeof months[number];
  let day = dateObj.getUTCDate();
  let year = dateObj.getUTCFullYear();

  const newUpdate: NewUpdate = {
    subject: subject,
    date: date,
    update: update,
    timestamp: Date.now(),
    search: `${
      month}/${day}/${year}${
      month}-${day}-${year}${
      timeData.months.indexOf(month)+1}/${day}/${year}${
      timeData.months.indexOf(month)+1}-${day}-${year}${
      month}/${day.toString().padStart(2,'0')}/${year}${
      month}-${day.toString().padStart(2,'0')}-${year}${
      (timeData.months.indexOf(month)+1).toString().padStart(2,'0')}/${day.toString().padStart(2,'0')}/${year}${
      (timeData.months.indexOf(month)+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}-${year
    }`
  };

  const dbRes = await DB.row.create<Update>('update', newUpdate);

  if (dbRes.success) {
    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - UPDATECREATE - New update ${dbRes.body!.id} created.`
        ].concat(dbRes.messages),
        body: { update: dbRes.body }
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - UPDATECREATE - New update could not be created.`
        ].concat(dbRes.messages),
        body: { update: request.params }
      }
    }));
  }
};
