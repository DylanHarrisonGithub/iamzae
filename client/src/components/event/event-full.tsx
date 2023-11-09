import React from 'react';

import { EventPerformance, Review, timeData } from '../../models/models';

import config from '../../config/config';
import MiniEventDetail from './mini-event-detail';
import VerticalEventDetail from './vertical-event-detail';
import Gallery from '../gallery/gallery';
import MediaViewer from '../media-viewer/media-viewer';

import { ModalContext } from '../modal/modal';
import ReviewComponent from '../review/review';
import ReviewForm from '../review/review-form';

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

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

const EventFull: React.FC<EventListItemProps> = ({ event }) => {

  const modalContext = React.useContext(ModalContext);

  const [eventReviews, setEventReviews] = React.useState<Review[]>([]);

  return (
    <div className="mx-auto my-6 glass">          
      <div  className="border-gray-200 rounded p-1 shadow-2xl">
        <div className="hidden md:block"><MiniEventDetail  event={event} /></div>
        <div className="md:hidden"><VerticalEventDetail  event={event} /></div>
        <div className="p-4 border border-gray-300 rounded shadow-md">
          <h1 className="p-4">Media for this event</h1>
          { !!event.media.length && 
            <Gallery>
              {
                event.media.map(a => (
                  <span key={a} className="relative">
                    {
                      acceptedMedia.slice(0, 4).filter(accepted => a.toLowerCase().endsWith(accepted)).length ?
                        <img 
                          className="inline-block cursor-pointer" 
                          width={64} 
                          height={64} 
                          src={
                            (
                              a.toUpperCase().startsWith('HTTP://') ||
                              a.toUpperCase().startsWith('HTTPS://') ||
                              a.toUpperCase().startsWith('www.')
                            ) ?
                              a
                            :
                              config.ASSETS[config.ENVIRONMENT] + `media/${a}`
                          }
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
                        </img>
                      :
                        <video
                          className='cursor-pointer'
                          width={64} height={64}
                          src={
                            (
                              a.toUpperCase().startsWith('HTTP://') ||
                              a.toUpperCase().startsWith('HTTPS://') ||
                              a.toUpperCase().startsWith('www.')
                            ) ?
                              a
                            :
                              config.ASSETS[config.ENVIRONMENT] + `media/${a}`
                          }
                          autoPlay={false} muted={true} loop={true}
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
                        ></video>
                    }
                  </span>
                ))
              }
            </Gallery>
          }
          {
            !(event.media?.length) && 
              <div className="py-10 text-center">No media for this event</div>
          }
          
        </div>
        

        <div className="p-4 border border-gray-300 rounded shadow-md">
          <h1 className="p-4">Reviews for this event</h1>
          {
            (!!(eventReviews?.length)) && 
              <div className="text-center">
                {
                  eventReviews.map((er, i) => (<ReviewComponent  reviewerName={er.name} reviewText={er.text} rating={er.stars} date={new Date()} />))
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
          <ReviewForm eventID={event.id}></ReviewForm>
        </div>

      </div>


      <div className="flex items-center justify-items-center">

      </div>
    </div>
  );
};

export default EventFull;
