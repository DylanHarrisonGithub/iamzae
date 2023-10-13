import React from "react";
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';

import Calendar from "../components/calendar/calendar";
import Carousel from "../components/carousel/carousel";
import Gallery from "../components/gallery/gallery";

import HttpService from "../services/http.service";
import { EventPerformance, Review } from "../models/models";
import MiniEventDetail from "../components/mini-event-detail/mini-event-detail";
import config from "../config/config";

import { ModalContext } from "../components/modal/modal";
import MediaViewer from "../components/media-viewer/media-viewer";
import ReviewForm from "../components/review/review-form";
import Hero from "../components/hero/hero";
import VerticalEventDetail from "../components/mini-event-detail/vertical-event-detail";
import ReviewComponent from "../components/review/review";

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const Events: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);

  const [busy, setBusy] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [events, setEvents] = React.useState<EventPerformance[]>([]);
  const [eventReviews, setEventReviews] = React.useState<Review[]>([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id } = useParams();

  const init = React.useRef<boolean>(true);

  React.useEffect(() => {
    setEvents([]);
    setBusy(true);
    if (id) {
      HttpService.get<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10, id: id }).then(res => {
        if (res.success && res.body) {
          setEvents(res.body);
          HttpService.get<Review[]>('reviewstream', { afterID: 0, numrows: 10 }).then(rev => {
            if (rev.success && rev.body) {
              setEventReviews(rev.body);
            }
          });
        }
        setBusy(false);
        init.current=false;
      });
    } else if (searchParams.get('search')) {
      HttpService.get<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10, search: searchParams.get('search') }).then(res => {
        if (res.success && res.body) {
          setEvents(res.body);
        }
        setBusy(false);
        init.current=false;
      });
    } else {
      HttpService.get<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10 }).then(res => {
        if (res.success && res.body) {
          setEvents(res.body);
        }
        setBusy(false);
        init.current=false;
      });
    }
  }, [searchParams, id])

  React.useEffect(() => {
    if (!init.current) {
      if (search.length) {
        navigate('/events/?search='+search);
      } else {
        navigate('/events');
      }
    }
  }, [search]);

  return (
    <Hero svg="fan">
      <div className="pt-16 container">
        <div className="py-8 sm:w-[600px] md:w-[800px] lg:w-[1200px]">
          <div className="lg:flex mx-5">
            <div className="glass rounded-lg my-4">
              <button className="btn btn-ghost text-xl gold-text text-center">
                &nbsp;&nbsp;Events Calendar&nbsp;&nbsp;
              </button>
            </div>
            <input 
              className={`bg-gray-100 glass text-right appearance-none border-2 border-gray-200 rounded w-2/3 py-2 my-4 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ml-auto`} 
              type="text"
              placeholder="Search Events"
              value={search} 
              onInput={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
            />
          </div>
          {
            busy && 
              <div className="flex justify-center mt-40">
                <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
          }
          { (events && events.length && events.length > 1) &&
            <div className="mx-5">
              <h1 className="text-white mx-8">{ search ? `Results for ${search}` : `All Events`}</h1>
              <Carousel disableBrowseAll>
                {
                  events.map((e, i) => (
                    <div key={i} className="cursor-pointer w-96 glass" onClick={() => navigate(`/events/${e.id}`) }>
                      <VerticalEventDetail event={e}/>
                    </div>
                  ))
                }
              </Carousel>
            </div>
          }

          {
            (events && events.length === 1) &&
            <div className="mx-auto my-6 bg-slate-100">
            {
              events.map((ev, i) => (
                <div className="border-gray-200 rounded p-1 shadow-2xl">
                  <MiniEventDetail key={i} event={ev} />
                  {
                    (ev.media && ev.media.length) &&
                      <div className="p-4 border border-gray-300 rounded shadow-md">
                        <h1>Media for this event</h1>
                        <Gallery>
                          {
                            ev.media.map(a => (
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
                      </div>
                  }
                  
                  {
                    (eventReviews && eventReviews.length) && 
                      <div className="p-4 border border-gray-300 rounded shadow-md">
                        <Gallery>
                          {
                            eventReviews.map(er => (<ReviewComponent reviewerName={er.name} reviewText={er.text} rating={er.stars} date={new Date()} />))
                          }
                        </Gallery>
                      </div>
                  }
                  <div className="p-4 border border-gray-300 rounded shadow-md">
                    <h1>Write a review for this event</h1>
                    <ReviewForm onSubmit={ (reviewerName, reviewText, rating, date) => {
                      (async () => {
                        const res = await HttpService.post<void>('reviewcreate', {event: events[0].id, name: reviewerName, stars: rating, text: reviewText});
                        modalContext.toast!(res.success ? 'success' : 'error', res.messages[0])
                      })();
                    } }></ReviewForm>
                  </div>

                </div>
              ))
            }
            <div className="flex items-center justify-items-center">

            </div>
          </div>
          }


          { 
            id || 
            searchParams.get('search') 
          }


        </div>
      </div>

    </Hero>

  )
}

export default Events;