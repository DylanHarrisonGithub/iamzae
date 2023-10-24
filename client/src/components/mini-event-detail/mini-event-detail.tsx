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
}

const MiniEventDetail: React.FC<EventListItemProps> = ({ event }) => {
  return (
    <li className="flex p-4 border border-gray-300 rounded shadow-md">
      <div className="flex-shrink-0 w-20 h-20 mr-4">
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
      <div className="flex-grow">
        { !(event.period === 'Once') &&
          <div className='text-lg font-semibold'>{periodPrases(event)}<span className='text-md text-gray-600'>&nbsp;starting&nbsp;</span></div>
        }
        <div className="flex items-center mb-2 space-x-2">
          <div className="text-lg font-semibold">{event.month} {event.day}, {event.year}</div>
          <div className="text-gray-600">{` at ${event.time}`}</div>
        </div>
        <div className="text-lg font-medium mb-2">{event.location}</div>
        <div className="text-gray-700 mb-4">{event.description}</div>
        <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Learn More
        </a>
      </div>
    </li>
  );
};

export default MiniEventDetail;
