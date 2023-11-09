import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Hero from "../components/hero/hero";
import MiniEventDetail from "../components/event/mini-event-detail";
import ReviewComponent from "../components/review/review";
import EventsCalendar from "../components/events-calendar/events-calendar";

import HttpService from "../services/http.service";
import EventService from "../services/event.service";

import { StorageContext } from "../components/storage/storage-context";

import { EventPerformance, Review } from "../models/models";

import { timeData } from "../models/models";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const Home: React.FC<any> = (props: any) => {

  const storageContext = React.useContext(StorageContext);
  const navigate = useNavigate();

  const [derivedEvents, setDerivedEvents] = React.useState<EventPerformance[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [busy2, setBusy2] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => setDerivedEvents((await EventService.generateDerivedEvents((storageContext.events as EventPerformance[]) || [])).body!) )();
  }, [storageContext.events]);

  React.useEffect(() => {
    (async () => {
      setBusy2(true);
      const res2 = await HttpService.get<Review[]>('approvedreviewstream', { afterID: 0, numrows: 5 });
      if (res2.success && res2.body) {
        setReviews(res2.body);
      }   
      setBusy2(false);
    })();
  }, []);

  return (
    <div className="fan pt-16 px-2 md:px-8">
      {/* translateX={(document.body.clientWidth > 1200) ? 20 : undefined} */}
      <Hero video="mymovie1.mp4" translateY={-4} > 
        <div className={`w-full md:w-1/2 lg:w-1/3 m-8 p-4 glass-light rounded-lg text-center`}>
          <h1 className="mb-5 text-5xl font-bold gold-text">IAMZAE</h1>
          <p className="mb-5 gold-text">
          Get ready for ZAE – the driving force behind unforgettable house music moments. With an unparalleled ability to fuse tradition and innovation, ZAE commands dancefloors, creating a rhythmic unity that transcends. From underground vibes to festival stages, experience the pulse of ZAE's curated sonic journey that redefines house music, one set at a time.          </p>
          {/* <button className="btn btn-primary">Get Started</button> */}
        </div>
      </Hero>

      <Hero translateY={-8}>
        <div className="w-full bg-white bg-opacity-75 rounded-lg text-center">
        <div className="text-lg font-extrabold mt-7 ml-8 text-left">{months[(new Date()).getMonth()]} events <div className="float-right inline-block mr-8 text-blue-600 dark:text-blue-500 hover:underline"><Link to={`/events`}>Browse All</Link></div></div>
          <div className="inline-block align-top ">
            <EventsCalendar year={(new Date()).getFullYear()} events={storageContext.events as EventPerformance[] || []} displayMonths={[months[(new Date()).getMonth()]]}/>
          </div>
          <div className="inline-block mt-8 align-top p-2">

            <ul className="max-h-[36rem] overflow-y-scroll">
              {
                derivedEvents.filter(e => e.month === months[(new Date()).getMonth()]).map((event, index) => (
                  <div
                    key={index} 
                    className="cursor-pointer hover:p-1 hover:bg-white"
                    //onClick={() => navigate(`/events/${event.id}`)}
                    onClick={() => navigate(`/events/${btoa(JSON.stringify(event))}`)}
                  >
                    <MiniEventDetail key={index} event={event} />
                  </div>
                ))
              }
              { storageContext.eventsBusy &&
                <li className="flex justify-center my-40">
                  <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                </li>
              }
            </ul>

          </div>
          
        </div>
      </Hero>

      <Hero image={`IMG_4329.JPG`} translateX={(document.body.clientWidth > 1200) ? 12 : undefined}>
        <div className={`w-full md:w-1/2 m-8 p-4 text-center bg-white bg-opacity-80 rounded-lg`}>
          <p className="mb-5 rainbow-text">
          The DJ harnesses an arsenal of cutting-edge technologies and devices to craft mesmerizing live music experiences. Armed with a digital setup, they deploy software like Ableton Live or Traktor to seamlessly mix and manipulate tracks. MIDI controllers and launchpads become extensions of their creativity, enabling live remixing and on-the-fly effects manipulation.

Sample pads and drum machines add dynamic layers, while synthesizers contribute unique sounds that set the performance apart. Visual elements are controlled through software, synchronizing music with captivating visuals or responsive LED displays. Advanced mixers with built-in effects empower the DJ to sculpt transitions, while high-resolution audio interfaces ensure pristine sound quality. With the crowd's pulse as a guide, the DJ uses these technologies to create a live music experience that resonates deeply and electrifies the atmosphere.          {/* <button className="btn btn-primary">Get Started</button> */}
          </p>
        </div>
      </Hero>

      <Hero>
        { 
          busy2 &&
            <li className="flex justify-center my-40">
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </li>
        }
        {
          reviews &&
            <div>
              {
                reviews.map((r,i) => (
                  <div className="block w-full">
                    <ReviewComponent key={i} reviewerName={r.name} reviewText={r.text} rating={r.stars} date={new Date(parseInt(r.timestamp.toString()))}></ReviewComponent>
                  </div>
                ))
              }
            </div>
        }
      </Hero>
      <Hero svg="diamonds">
        <div 
          className={`w-full md:w-1/2 m-8 p-4 glass-light rounded-lg text-center ${
            props.translateX && (
              (props.translateX > 0) ?
                `translate-x-${props.translateX}`
              :
                `-translate-x-${Math.abs(props.translateX)}`
            )
          } ${
            props.translateY && (
              (props.translateY > 0) ?
                `translate-y-${props.translateY}`
              :
                `-translate-y-${Math.abs(props.translateY)}`
            )
          }`}
        >
          <h1 className="mb-5 text-5xl font-bold gold-text">IAMZAE</h1>
          <p className="mb-5 gold-text">
          Break free from the confines of your daily routine and step into a realm of pulsating energy and euphoric beats! It's time to trade the comfort of your home for the electric atmosphere of the dancefloor, where the magic of music comes alive. Join us for an unforgettable night as our extraordinary DJ takes center stage, weaving a sonic tapestry that will ignite your senses and move your soul. The energy of the crowd, the thumping bass, and the infectious melodies await you. Let loose, dance without inhibition, and experience a night of connection and pure musical bliss. Get up, get out, and let the music be your guide – a night with our exceptional DJ is not to be missed!          {/* <button className="btn btn-primary">Get Started</button> */}
          </p>
        </div>
      </Hero>
      
    </div>
  )
}

export default Home;