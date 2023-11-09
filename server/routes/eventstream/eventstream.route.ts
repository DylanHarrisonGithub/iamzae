import { RouterResponse } from '../../services/router/router.service';
import { ParsedRequest } from '../../services/requestParser/requestParser.service';
import { EventPerformance } from '../../models/models';
import DB from '../../services/db/db.service';

import { timeData } from '../../models/models';


const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

export default async (request: ParsedRequest<{ 
  afterID: number, 
  numrows: number, 
  search?: string,
  id?: string
}>): Promise<RouterResponse> => {

  const { afterID, numrows, search, id } = request.params;

  // attempt format date and date-like searches to standard [monthname]/[dd]/[yyyy] or [monthname]/[yyyy]
  let mappedSearch = search; 
  if (mappedSearch) {
    mappedSearch = mappedSearch.trim().replace(/\s+/g, '/').replace(/-/g, '/');
    const searchSplit = mappedSearch.split('/');
    if (searchSplit.length === 3) {
      let timestamp = Date.parse(mappedSearch);
      if (!isNaN(timestamp)) {
        let d = new Date(timestamp);
        mappedSearch = `${months[d.getMonth()]}/${d.getDate()}/${d.getFullYear()}`
      } else {
        mappedSearch = search; // give up
      }
    } else if (searchSplit.length === 2 && searchSplit[0].length) {
      if (isNaN(searchSplit[0] as any)) {
        searchSplit[0] = searchSplit[0].charAt(0).toUpperCase() + searchSplit[0].slice(1).toLowerCase();
        if (months.includes(searchSplit[0] as any)) {
          mappedSearch = mappedSearch = `${searchSplit[0]}/${searchSplit[1].padStart(4, '20')}`;
        } else {
          mappedSearch = search;
        }
      } else {
        let m = parseInt(searchSplit[0]);
        if (m >= 1 && m <= 12) {
          mappedSearch = mappedSearch = `${months[m-1]}/${searchSplit[1].padStart(4, '20')}`;
        } else {
          mappedSearch = search;
        }
      }
    } else {
      mappedSearch = search; // give up october  2023
    }
  }


  const dbRes = id ?
      await DB.row.read<any[]>('event', { id: id })
    :
      mappedSearch ? 
        await DB.row.query(`SELECT * FROM "event" WHERE search ILIKE '%${mappedSearch}%' AND id > ${afterID} ORDER BY id ASC LIMIT ${numrows};`)//DB.row.stream<any[]>('event', afterID, numrows)
      :
        await DB.row.stream<any[]>('event', afterID, numrows);

  if (dbRes.success) {

    const events = (dbRes.body?.map(e => ({ ...e, media: e.media?.length ? e.media.split(',') : [] })) as EventPerformance[]);

    return new Promise(res => res({
      code: 200,
      json: {
        success: true,
        messages: [  
          `SERVER - ROUTES - EVENTSTREAM - Events streamed.`
        ].concat(dbRes.messages),
        body: events.map(e => { const { search, ...filteredE } = e; return filteredE })
      }
    }));
  } else {
    return new Promise(res => res({
      code: 500,
      json: {
        success: false,
        messages: [  
          `SERVER - ROUTES - EVENTSTREAM - Events could not be streamed.`
        ].concat(dbRes.messages),
        body: request.params
      }
    }));
  }
  return new Promise(res => res({ code: 200, json: { success: true, message: ["eventstream route works!"]} }));
};