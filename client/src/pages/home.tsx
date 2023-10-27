import React from "react";
import { useNavigate } from "react-router-dom";
import { LoremIpsum } from 'lorem-ipsum';

import Carousel from "../components/carousel/carousel";
import Hero from "../components/hero/hero";
import Calendar from "../components/calendar/calendar";
import QuickForm from "../components/quick-form/quick-form";
import { COMMON_REGEXES } from "../services/validation.service";

import { EventPerformance, Review } from "../models/models";
import MiniEventDetail from "../components/mini-event-detail/mini-event-detail";

import { StorageContext } from "../components/storage/storage-context";
import HttpService from "../services/http.service";
import { timeData } from "../models/models";
import ReviewComponent from "../components/review/review";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;


function getNthDayInMonth(nth: number, day: typeof weekdays[number], month: typeof months[number], year: number) {
  // Create new date for 1st of month
  let d = new Date(year, months.indexOf(month));
  // Move to first instance of day in month and 
  // add (n - 1) weeks
  d.setDate(1 + (7 - d.getDay() + weekdays.indexOf(day))%7 + (nth - 1)*7);
  return d;
};

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 12,
    min: 8
  }
});

const Home: React.FC<any> = (props: any) => {

  const [events, setEvents] = React.useState<EventPerformance[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);

  const [calendarDays, setCalendarDays] = React.useState<{ [key in typeof months[number]]: { day: number, eventID: number }[]}>({ //months.reduce((a,m) => ({...a, [m]: []}), {});
    January: [],
    February: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: [],
  });
  const [busy, setBusy] = React.useState<boolean>(true);
  const [busy2, setBusy2] = React.useState<boolean>(true);

  const navigate = useNavigate();
  // const events: EventPerformance[] = [
  //   // Fill in your event data here
  //   { id: -1, timestamp: -1, period: 'Once', day: 2, month: 'August', year: 2023, time: '23:30', location: 'highdive', thumbnail: 'https://s3-media0.fl.yelpcdn.com/bphoto/0ahKIlF_TnvOOTReu_IJcg/o.jpg', description: `The anticipation is building as I look forward to my upcoming debut at [Establishment Name]. The reputation of the venue as a hub for music enthusiasts and its state-of-the-art sound system has me buzzing with excitement. I can't wait to unleash my sound, create an unforgettable vibe, and connect with the crowd in this incredible space.`, website: '/', media: []},
  //   { id: -1, timestamp: -1, period: 'Once',  day: 5, month: 'August', year: 2023, time: '7:00', location: 'safe house', thumbnail: `https://s3.amazonaws.com/gry-cms/safehouse-milwaukee//mural%20edit.jpg`, description: `Playing at [Establishment Name] was an absolute thrill from start to finish. The energy of the crowd was electrifying, and the synergy between the music and the atmosphere was truly magical. Seeing the dancefloor come alive and feeling the audience's energy fuel my set was an experience that will stay with me forever.`, website: '/', media: []},
  // ];
  React.useEffect(() => {
    (async () => {
      setBusy(true);
      const res = await HttpService.get<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10, search: (new Date()).getFullYear() });
      if (res && res.success && res.body) {
        const tempNewEvents: EventPerformance[] = [...events, ...res.body.filter(e => !events.some(oe => oe.id === e.id))];
        setCalendarDays(cd => {
          tempNewEvents.forEach(e => cd[e.month].push({ day: parseInt(e.day.toString()), eventID: e.id }));
          tempNewEvents.filter(e => e.period === 'Daily').forEach(e => {
            let d = new Date(e.year, months.indexOf(e.month), e.day);
            while (d.getFullYear() === 2023) {
              cd[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
              d.setDate(d.getDate() + 1);
            }
          });
          tempNewEvents.filter(e => e.period === 'Weekly').forEach(e => {
            let d = new Date(e.year, months.indexOf(e.month), e.day);
            while (d.getFullYear() === 2023) {
              cd[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
              d.setDate(d.getDate() + 7);
            }
          });
          tempNewEvents.filter(e => e.period === 'BiWeekly').forEach(e => {
            let d = new Date(e.year, months.indexOf(e.month), e.day);
            while (d.getFullYear() === 2023) {
              cd[months[d.getMonth()]].push({ day: parseInt(d.getDate().toString()), eventID: e.id });
              d.setDate(d.getDate() + 14);
            }
          });
          tempNewEvents.filter(e => e.period === 'Monthly').forEach(e => {
            let d = new Date(e.year, months.indexOf(e.month));
            const dayNum = (new Date(e.year, months.indexOf(e.month), e.day)).getDay();
            const weekday: typeof weekdays[number] = weekdays[dayNum];
            const dayCount = Math.floor((e.day-1) / 7) + 1;
            let eDay: Date;
            while (d.getFullYear() === 2023) {
              eDay = getNthDayInMonth(dayCount, weekday, months[d.getMonth()], e.year);
              cd[months[d.getMonth()]].push({ day: eDay.getDate(), eventID: e.id });
              d = new Date(e.year, d.getMonth() + 1);
            }
          });
          return cd
        });
        setEvents(res.body || []);

        setBusy(false);
      } else {
        console.log(res);
      }
      setBusy2(true);
      const res2 = await HttpService.get<Review[]>('approvedreviewstream', { afterID: 0, numrows: 10 });
      if (res2.success && res2.body) {
        setReviews(res2.body);
      }   
      setBusy2(false);
    })();
  }, []);

  const storageContext = React.useContext(StorageContext);
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
        <div className="w-full md:w-11/12 bg-white bg-opacity-75 rounded-lg">
          <Carousel categoryName="Events">
            {
              Array.from(Array(12)).map((n, i) => (
                // <ProductCard key={i.toString()} queryID={''}/>
                <Calendar key={i.toString()} month={i} year={(new Date()).getFullYear()} 
                  highlights={ calendarDays[months[i]].map(cd => cd.day) }
                  onDayClick={(d,m,y) => navigate(`/events/?search=${m+1}/${d}/${y}`)}
                />
              ))
            }
          </Carousel >
          <ul>
            {
              events.map((event, index) => (
                <div 
                  className="cursor-pointer hover:p-1 hover:bg-white"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <MiniEventDetail key={index} event={event} />
                </div>
              ))
            }
            { busy &&
              <li className="flex justify-center my-40">
                <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </li>
            }
          </ul>
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
          className={`w-full md:w-1/2 lg:w-1/3 m-8 p-4 glass-light rounded-lg text-center ${
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