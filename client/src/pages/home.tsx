import React from "react";
import { LoremIpsum } from 'lorem-ipsum';

import Carousel from "../components/carousel/carousel";
import Hero from "../components/hero/hero";
import Calendar from "../components/calendar/calendar";
import QuickForm from "../components/quick-form/quick-form";
import { COMMON_REGEXES } from "../services/validation.service";

import { EventPerformance } from "../models/models";
import MiniEventDetail from "../components/mini-event-detail/mini-event-detail";

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

  const events: EventPerformance[] = [
    // Fill in your event data here
    { id: -1, timestamp: -1, period: 'Once', day: 2, month: 'August', year: 2023, time: '23:30', location: 'highdive', thumbnail: 'https://s3-media0.fl.yelpcdn.com/bphoto/0ahKIlF_TnvOOTReu_IJcg/o.jpg', description: `The anticipation is building as I look forward to my upcoming debut at [Establishment Name]. The reputation of the venue as a hub for music enthusiasts and its state-of-the-art sound system has me buzzing with excitement. I can't wait to unleash my sound, create an unforgettable vibe, and connect with the crowd in this incredible space.`, website: '/', media: []},
    { id: -1, timestamp: -1, period: 'Once',  day: 5, month: 'August', year: 2023, time: '7:00', location: 'safe house', thumbnail: `https://s3.amazonaws.com/gry-cms/safehouse-milwaukee//mural%20edit.jpg`, description: `Playing at [Establishment Name] was an absolute thrill from start to finish. The energy of the crowd was electrifying, and the synergy between the music and the atmosphere was truly magical. Seeing the dancefloor come alive and feeling the audience's energy fuel my set was an experience that will stay with me forever.`, website: '/', media: []},
  ];

  return (
    <div>

      <Hero video="dba28b2adc4d4a289d46b56c99cd327f.mov">
        <div className={`w-1/3 glass-light rounded-lg text-center`}>
          <h1 className="mb-5 text-5xl font-bold gold-text">IAMZAE</h1>
          <p className="mb-5 gold-text">
          Get ready for ZAE – the driving force behind unforgettable house music moments. With an unparalleled ability to fuse tradition and innovation, ZAE commands dancefloors, creating a rhythmic unity that transcends. From underground vibes to festival stages, experience the pulse of ZAE's curated sonic journey that redefines house music, one set at a time.          </p>
          {/* <button className="btn btn-primary">Get Started</button> */}
        </div>
      </Hero>

      <Hero svg="hex2" translateY={-4}>
        <div className="w-11/12 md:w-2/3 glass rounded-lg">
          <Carousel categoryName="Events">
            {
              Array.from(Array(6)).map((n, i) => (
                // <ProductCard key={i.toString()} queryID={''}/>
                <Calendar key={i.toString()} month={8+i-3} year={2023}/>
              ))
            }
          </Carousel >
          <ul>
            {events.map((event, index) => (
              <MiniEventDetail key={index} event={event} />
            ))}
          </ul>
        </div>
      </Hero>

      <Hero translateX={12}>
        <div className={`w-1/2 text-center bg-white bg-opacity-80 `}>
          <p className="mb-5 rainbow-text">
          The DJ harnesses an arsenal of cutting-edge technologies and devices to craft mesmerizing live music experiences. Armed with a digital setup, they deploy software like Ableton Live or Traktor to seamlessly mix and manipulate tracks. MIDI controllers and launchpads become extensions of their creativity, enabling live remixing and on-the-fly effects manipulation.

Sample pads and drum machines add dynamic layers, while synthesizers contribute unique sounds that set the performance apart. Visual elements are controlled through software, synchronizing music with captivating visuals or responsive LED displays. Advanced mixers with built-in effects empower the DJ to sculpt transitions, while high-resolution audio interfaces ensure pristine sound quality. With the crowd's pulse as a guide, the DJ uses these technologies to create a live music experience that resonates deeply and electrifies the atmosphere.          {/* <button className="btn btn-primary">Get Started</button> */}
          </p>
        </div>
      </Hero>

      <Hero svg="fan"/>
      <Hero svg="diamonds">
        <div 
          className={`w-1/3 glass rounded-lg text-center ${
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