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
            <div className="lg:flex mx-5">
              <div className="block lg:inline-block my-4 pt-4">
                <span className="text-xl gold-text text-center align-middle">
                  &nbsp;&nbsp;Events Calendar&nbsp;&nbsp;
                </span>
              </div>
              <input 
                className={`bg-gray-300 text-right appearance-none border-2 border-gray-600 rounded block w-full lg:w-2/3 py-4 my-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ml-auto`} 
                type="text"
                placeholder="Search Events"
                value={searchParams.get('search') || ''} 
                onInput={(event: React.ChangeEvent<HTMLInputElement>) => setSearchParams(event.target.value.length ? {search: event.target.value} : {})}
              />
            </div>
          }

          {
            !(searchParams.get('search') || encodedEvent) &&
              <EventsCalendar year={(new Date()).getFullYear()} events={derivedEvents || []}/>
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