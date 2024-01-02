import React from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import EventsCalendar from "../components/events-calendar/events-calendar";
import Carousel from "../components/carousel/carousel";
import Hero from "../components/hero/hero";
import VerticalEventDetail from "../components/event/vertical-event-detail";
import EventFull from "../components/event/event-full";

import EventService from "../services/event.service";

import { ModalContext } from "../components/modal/modal";
import { StorageContext } from "../components/storage/storage-context";

import { EventPerformance, Review, timeData } from "../models/models";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const Events: React.FC<any> = () => {

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const { encodedEvent } = useParams();
  const storageContext = React.useContext(StorageContext);

  const [derivedEvents, setDerivedEvents] = React.useState<EventPerformance[]>([]);
  const [decodedEvent, setDecodedEvent] = React.useState<EventPerformance | undefined>();
  const [eventReviews, setEventReviews] = React.useState<Review[]>([]);
  const [eventsCalendarMonth, setEventsCalendarMonth] = React.useState<typeof months[number]>(months[(new Date()).getMonth()]);
  const [eventsCalendarYear, setEventsCalendarYear] = React.useState<number>((new Date()).getFullYear());

  React.useEffect(() => {
    (async () => {
      setDecodedEvent((await EventService.urlDecodeEvent(encodedEvent || '')).body);
    })();
  }, [encodedEvent])

  React.useEffect(() => {
    (async () => setDerivedEvents(
        (await EventService.getFilteredEvents((await EventService.generateDerivedEvents(storageContext.events as EventPerformance[] || [])).body!, searchParams.get('search') || '')).body!
    ) )();
  }, [storageContext.events, searchParams]);

  return (
    <Hero svg="fan">
      <div className="pt-16 container">
        <div className="py-8 sm:w-[600px] md:w-[800px] lg:w-[1200px]">
          {
            !decodedEvent &&
              <div className="text-center p-1 m-3 mt-4">
                <div className='inline-block relative mx-2 my-4 align-top text-left w-11/12 md:w-4/12'>
                  <div className="text-left">
                    <h1 className="text-xl gold-text text-center align-middle inline-block">
                      &nbsp;&nbsp;Events Calendar&nbsp;&nbsp;
                    </h1>
                  </div>
                </div>

                <div className='inline-block relative mx-2 my-3 w-11/12 md:w-5/12 text-left'>
                  <input
                    className="bg-gray-200 text-left md:text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    type="text"
                    placeholder="Search Events"
                    value={searchParams.get('search') || ''}
                    onInput={(event: React.ChangeEvent<HTMLInputElement>) => setSearchParams(event.target.value.length ? {search: event.target.value} : {})}
                  />
                </div>
              </div>
          }

          {
            !(searchParams.get('search') || encodedEvent) &&
              <div>
                <div
                  className="inline-block bg-white rounded-lg ml-5 mb-0"
                >
                  <button 
                    className="btn btn-accent mr-4"
                    onClick={() => setEventsCalendarYear(y => (y + 2999) % 3000)}
                  >&lt;</button>
                  {eventsCalendarYear}
                  <button 
                    className="btn btn-accent ml-4"
                    onClick={() => setEventsCalendarYear(y => (y + 3001) % 3000)}
                  >&gt;</button>
                </div>
                <EventsCalendar year={eventsCalendarYear} events={derivedEvents || []}/>
              </div>
          }
            <h1 className="text-white mx-8">{ 
              searchParams.get('search') ? 
                `Results for ${searchParams.get('search')}` 
              : 
                encodedEvent ? `` : `All Events`
            }</h1>
          {
            (storageContext.eventsBusy && !encodedEvent) && 
              <div className="flex justify-center mt-40">
                <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
          }
          { (derivedEvents.length > 1 && !decodedEvent) &&
            <div className="mx-1 md:mx-5">
              <Carousel disableBrowseAll>
                {
                  derivedEvents.map((e, i) => (
                    <div key={i} className="cursor-pointer w-96 glass" onClick={async () => navigate(`/events/${(await EventService.urlEncodeEvent(e)).body!}`) }>
                      <VerticalEventDetail event={e}/>
                    </div>
                  ))
                }
              </Carousel>
            </div>
          }

          {
            (derivedEvents.length === 1 && !decodedEvent) &&
              <EventFull event={derivedEvents[0]}/>
          }

          {
            (decodedEvent) &&
              <div>
                <div className="flex">
                  <button 
                    className="btn btn-circle btn-lg ml-auto"
                    onClick={() => navigate('/events')}
                  >
                    Close
                  </button>
                </div>

                <EventFull event={decodedEvent}/>
              </div>
          }
        </div>
      </div>

    </Hero>

  )
}

export default Events;