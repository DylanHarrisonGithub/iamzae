import React from 'react';

import { EventPerformance, timeData } from '../../models/models';

import config from '../../config/config';

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const periodPrases = (e: EventPerformance): string => {
  let { year, month, day, period } = (e as EventPerformance);
  const dayNum = (new Date(year, months.indexOf(month), day)).getDay();
  const weekday: typeof weekdays[number] = weekdays[dayNum];
  const dayCount = Math.floor((day-1) / 7) + 1;
  const dayCountSuffix = [ 'st', 'nd', 'rd', 'th', 'th' ];
  return ({
    Once: ``,
    Daily: `Every day`,
    Weekly: `Every ${weekday}`,
    BiWeekly: `Every other ${weekday}`,
    Monthly: `The ${dayCount}${dayCountSuffix[dayCount-1]} ${weekday} of every month`
  })[period];
};

type EventListItemProps = {
  event: EventPerformance;
  teaser?: boolean
}

const VerticalEventDetail: React.FC<EventListItemProps> = ({ event }) => {
  return (
    <div className="p-1 border border-gray-300 rounded shadow-md h-full">
      <div className="m-4 aspect-1">
        <img src={
          (
            event.thumbnail.toUpperCase().startsWith('HTTP://') ||
            event.thumbnail.toUpperCase().startsWith('HTTPS://') ||
            event.thumbnail.toUpperCase().startsWith('www.')
          ) ?
            event.thumbnail
          :
            config.ASSETS[config.ENVIRONMENT]+"media/"+event.thumbnail
        } alt="Event Thumbnail" className="object-cover w-full h-full rounded" />
      </div>
      <div className="m-4 text-gray-400">

        <div className="my-2">
          { !(event.period === 'Once') &&
            <div className='text-lg font-semibold text-white'>{periodPrases(event)}<span className='text-md text-gray-600'>&nbsp;starting&nbsp;</span></div>
          }
          <div className="text-md font-semibold">{event.month} {event.day}, {event.year} at <span className='text-md text-gray-600'>{event.time}</span></div>
          <div className="text-gray-500">{event.location}</div>
        </div>

        {/* <div className="text-gray-700 mb-4">{event.description}</div> */}

        <div className="my-2 relative h-28 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-inherit"></div>
          <p className="text-white">
              {event.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerticalEventDetail;
