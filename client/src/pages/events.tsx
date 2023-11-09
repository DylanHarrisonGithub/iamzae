import React from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import EventsCalendar from "../components/events-calendar/events-calendar";
import Carousel from "../components/carousel/carousel";
import Gallery from "../components/gallery/gallery";
import MiniEventDetail from "../components/event/mini-event-detail";
import MediaViewer from "../components/media-viewer/media-viewer";
import ReviewForm from "../components/review/review-form";
import Hero from "../components/hero/hero";
import VerticalEventDetail from "../components/event/vertical-event-detail";
import ReviewComponent from "../components/review/review";

import EventService from "../services/event.service";

import { ModalContext } from "../components/modal/modal";
import { StorageContext } from "../components/storage/storage-context";

import { EventPerformance, Review, timeData } from "../models/models";

import config from "../config/config";
import MiniMediaViewer from "../components/media-viewer/mini-media-viewer";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const Events: React.FC<any> = () => {

  const modalContext = React.useContext(ModalContext);
  const storageContext = React.useContext(StorageContext);

  const [derivedEvents, setDerivedEvents] = React.useState<EventPerformance[]>([]);
  const [eventReviews, setEventReviews] = React.useState<Review[]>([]);
  const [eventsCalendarMonth, setEventsCalendarMonth] = React.useState<typeof months[number]>(months[(new Date()).getMonth()]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams();

  React.useEffect(() => {
    (async () => setDerivedEvents(
      (await EventService.getFilteredEvents((await EventService.generateDerivedEvents(storageContext.events as EventPerformance[])).body!, searchParams.get('search') || '')).body!
    ) )();
  }, [storageContext.events, searchParams]);

  return (
    <Hero svg="fan">
      <div className="pt-16 container">
        <div className="py-8 sm:w-[600px] md:w-[800px] lg:w-[1200px]">
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
          {
            !searchParams.get('search') &&
              <EventsCalendar year={(new Date()).getFullYear()} events={derivedEvents}/>
          }
            <h1 className="text-white mx-8">{ 
              searchParams.get('search') ? 
                `Results for ${searchParams.get('search')}` 
              : 
                id ? `` : `All Events`
            }</h1>
          {
            storageContext.eventsBusy && 
              <div className="flex justify-center mt-40">
                <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
          }
          { (derivedEvents.length > 1) &&
            <div className="mx-1 md:mx-5">
              <Carousel disableBrowseAll>
                {
                  derivedEvents.map((e, i) => (
                    <div key={i} className="cursor-pointer w-96 glass" onClick={() => navigate(`/events/${e.id}`) }>
                      <VerticalEventDetail event={e}/>
                    </div>
                  ))
                }
              </Carousel>
            </div>
          }

          {
            (derivedEvents.length === 1) &&
              <div className="mx-auto my-6 glass">
                {
                  derivedEvents.map((ev, i) => (
                    <div key={i} className="border-gray-200 rounded p-1 shadow-2xl">
                      <div className="hidden md:block"><MiniEventDetail key={i} event={ev} /></div>
                      <div className="md:hidden"><VerticalEventDetail key={i} event={ev} /></div>
                      <div className="p-4 border border-gray-300 rounded shadow-md">
                        <h1 className="p-4">Media for this event</h1>
                        { !!ev.media.length && 
                          <Gallery>
                            {
                              ev.media.map(a => (
                                <span 
                                  key={a} 
                                  className="relative inline-block cursor-pointer"
                                  onClick={() => {
                                    (new Promise<any>((res, rej) => {
                                      modalContext.modal!({
                                        node: (<MediaViewer filename={a}/>), 
                                        resolve: res, 
                                        reject: rej
                                      });
                                    })).then(result => {
                                      modalContext.modal!();
                                    }).catch(err => {});
                                  }}
                                >
                                  <MiniMediaViewer filename={a}/>
                                </span>
                              ))
                            }
                          </Gallery>
                        }
                        {
                          !(ev.media?.length) && 
                            <div className="py-10 text-center">No media for this event</div>
                        }
                        
                      </div>
                      

                      <div className="p-4 border border-gray-300 rounded shadow-md">
                        <h1 className="p-4">Reviews for this event</h1>
                        {
                          (!!(eventReviews?.length)) && 
                            <div className="text-center">
                              {
                                eventReviews.map((er, i) => (<ReviewComponent key={i} reviewerName={er.name} reviewText={er.text} rating={er.stars} date={new Date()} />))
                              }
                            </div>
                        }
                        {
                          !(eventReviews?.length) && 
                            <div className="py-10 text-center">No reviews for this event</div>
                        }
                      </div>

                      <div className="p-4 border border-gray-300 rounded shadow-md">
                        <h1 className="p-4">Write a review for this event</h1>
                        <ReviewForm eventID={ev.id}></ReviewForm>
                      </div>

                    </div>
                  ))
                }
                <div className="flex items-center justify-items-center">

                </div>
              </div>
          }


        </div>
      </div>

    </Hero>

  )
}

export default Events;