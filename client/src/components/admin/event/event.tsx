import React from "react";
import { EventPerformance } from "../../../models/models";

import { ModalContext } from "../../modal/modal";
import HttpService from "../../../services/http.service";
import EventForm from "../../event/event-form";
import MiniEventDetail from "../../event/mini-event-detail";
import EventMediaForm from "../../event/event-media-form";
import VerticalEventDetail from "../../event/vertical-event-detail";
import EventReviews from "../../review/event-reviews";

type EventComponentProps = {
  events: EventPerformance[],
  mediaList: string[],
  setEvents: React.Dispatch<React.SetStateAction<EventPerformance[]>>,
  quickGet: <T = void>(route: string, params?: any) => Promise<T | void>
};

const EventsComponent: React.FC<EventComponentProps> = ({events, mediaList, setEvents, quickGet}) => {

  const modalContext = React.useContext(ModalContext);

  const init = React.useRef<boolean>(true);
  const listInnerRef = React.useRef<HTMLLIElement | null>(null);

  const allEventsListed = React.useRef<boolean>(false);
  const [allEventsListed2, setAllEventsListed] = React.useState(false);
  const busy = React.useRef(false)
  const [busy2, setBusy2] = React.useState<boolean>(false);

  const [eventSearch, setEventSearch] = React.useState<string>('');

  const onScroll = () => {
    if (listInnerRef.current && !busy.current) {
      //console.log(window.scrollY, listInnerRef.current.getBoundingClientRect().top - window.innerHeight);
      if ((listInnerRef.current.getBoundingClientRect().top - window.innerHeight < 0) && (allEventsListed.current === false)) {

        busy.current = true;
        setBusy2(true);
        quickGet<EventPerformance[]>('eventstream', { 
          afterID: events.length? events.at(-1)!.id : 0, 
          numrows: 10,
          search: eventSearch 
        }).then(res => {
          if (!(res && res.length)) { allEventsListed.current = true; setAllEventsListed(true); }
          busy.current = false;
          setBusy2(false);
          
          //todo
          // filter out results already present in events
          setEvents(es => ([ ...es, ...(res || [])]));
        });
      }
    }
  };

  React.useEffect(() => {
    if (init.current) {
      busy.current = true;
      quickGet<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10, search: eventSearch }).then(res => {setEvents(res || []); busy.current = false;});
      init.current = false;
    }
  }, []);

  React.useEffect(() => {
      window.removeEventListener("scroll", onScroll);
      window.addEventListener("scroll", onScroll);

      // Clean-up
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
  }, [events]);

  React.useEffect(() => {
    if (!init.current) {
      setAllEventsListed(false);
      setBusy2(true);
      busy.current = true;
      quickGet<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10, search: eventSearch }).then(res => { setEvents(res || []); busy.current = false; setBusy2(false); });
    }
  }, [eventSearch]);

  return (
    <span>

      <div className="md:flex md:items-center mt-4">
        <div className="md:w-1/3">
          <button 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-3 my-5 rounded"
            onClick={() => {
              (new Promise<EventPerformance | null>((res, rej) => {
                modalContext.modal!({node: (
                  <EventForm resolve={res} mediaList={mediaList}/>
                ), resolve: res, reject: rej});
              })).then(async result => {
                modalContext.modal!();
                if (result) {
                  const newEventResponse = await HttpService.post<EventPerformance>('eventcreate', result);
                  if (newEventResponse.success) {
                    quickGet<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10 }).then(res => setEvents(res || []));
                    init.current = false;
                  }
                  newEventResponse.messages.forEach(m => modalContext.toast!(newEventResponse.success ? 'success' : 'warning', m));
                }
              }).catch(err => {});
            }}
          >
            CREATE NEW EVENT
          </button>
        </div>
       
        <div className="md:w-2/3 mr-3">

          <input
            className="bg-gray-200 text-right appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-event-search"
            type="text"
            placeholder="Event Search"
            value={eventSearch}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setEventSearch(e.target.value)}
          />
        </div>

      </div>
      <ul>
        {events.map((event, index) => (
          <div className="relative" key={index}>
            <button 
              className="btn btn-circle btn-lg shadow-xl btn-error border-2 border-black absolute top-1 right-1"
              onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete\n ${event.location},\n ${event.month} ${event.day}?`, options: ["yes", "no"]}))!.then(res => {
                if (res === "yes") {
                  HttpService.delete<void>('eventdelete', { id: event.id }).then(res => {
                    if (res.success) {
                      setEvents(events => events.filter(e => e.id !== event.id));
                      res.messages.forEach(m => modalContext.toast!('success', m));
                    } else {
                      modalContext.toast!('warning', `Unable to delete event ${event.location}, ${event.month} ${event.day}.`);
                      res.messages.forEach(m => modalContext.toast!('warning', m));
                    }
                  });
                }
              }).catch(e => {})}
            >
              <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>            
            </button>
            <button 
              className="btn btn-circle btn-lg shadow-xl btn-warning border-2 border-black absolute top-20 right-1 md:top-1 md:right-20"
              onClick={() => (new Promise<EventPerformance | null>((res, rej) => {
                modalContext.modal!({ 
                  node: (<EventForm resolve={res} mediaList={mediaList} init={event}/>), 
                  resolve: res, 
                  reject: rej
                })
              })).then(async result => {
                modalContext.modal!();
                if (result) {
                  // get object containing only key-values that are changed
                  const update = ((Object.keys(result) as Array<keyof EventPerformance>).filter(k => result[k] !== event[k]) as Array<keyof EventPerformance>).reduce((u, k) => 
                    ({ [k]: result[k], ...u })
                  , {});
                  const newEventResponse = await HttpService.patch<EventPerformance>('eventupdate', { id: event.id, update: update});
                  if (newEventResponse.success) {
                    quickGet<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10 }).then(res => setEvents(res || []));
                    init.current = false;
                  }
                  newEventResponse.messages.forEach(m => modalContext.toast!(newEventResponse.success ? 'success' : 'warning', m));
                }
              }).catch(err => console.log(err))}
            >
              <svg className=" fill-black-800" xmlns="http://www.w3.org/2000/svg" height="2.5em" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>
            </button>
            <button
              className="btn btn-circle btn-lg shadow-xl btn-success border-2 border-black absolute top-40 right-1 md:top-20 md:right-1 lg:top-1 lg:right-40 "
              onClick={() => new Promise<string[] | null>((res, rej) => {
                modalContext.modal!({
                  node: (<EventMediaForm resolve={res} media={mediaList} associatedMedia={event.media}/>),
                  resolve: res,
                  reject: rej
                })
              }).then(async result => {
                modalContext.modal!();
                if (result) {
                  let update = true;
                  if (event.media.length === result.length) {
                    if (JSON.stringify(event.media.sort()) === JSON.stringify(result.sort())) { update = false; }
                  }
                  if (update) {
                    const newEventResponse = await HttpService.patch<EventPerformance>('eventupdate', { id: event.id, update: { media: result }});
                    if (newEventResponse.success) {
                      quickGet<EventPerformance[]>('eventstream', { afterID: 0, numrows: 10 }).then(res => setEvents(res || []));
                      init.current = false;
                    }
                    newEventResponse.messages.forEach(m => modalContext.toast!(newEventResponse.success ? 'success' : 'warning', m));
                  }
                }
              }).catch(err => console.log(err))}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 640 512"><path d="M256 0H576c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64zM476 106.7C471.5 100 464 96 456 96s-15.5 4-20 10.7l-56 84L362.7 169c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h80 48H552c8.9 0 17-4.9 21.2-12.7s3.7-17.3-1.2-24.6l-96-144zM336 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM64 128h96V384v32c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V384H512v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64zm8 64c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V208c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V312c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16H88c8.8 0 16-7.2 16-16V416c0-8.8-7.2-16-16-16H72zm336 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16V416c0-8.8-7.2-16-16-16H424c-8.8 0-16 7.2-16 16z"/></svg>
            </button>
            <button
              className="btn btn-circle btn-lg shadow-xl btn-info border-2 border-black absolute top-60 right-1 md:top-20 md:right-20 lg:top-1 lg:right-60"
              onClick={
                () => new Promise<void>((res,rej) => {
                  modalContext.modal!({
                    node: (<EventReviews resolve={res} eventID={event.id}/>),
                    resolve: res,
                    reject: rej
                  })
                }).then(async result => { modalContext.modal!() }).catch(err => console.log(err))
              }
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 576 512"><path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"/></svg>            
            </button>
            <span className="absolute bottom-2 left-2">{`ID: ${event.id}`}</span>
            <div className="hidden md:block lg:block">
              <MiniEventDetail key={index} event={event} />
            </div>
            <div className="block md:hidden lg:hidden">
              <VerticalEventDetail key={index} event={event} />
            </div>
          </div>
        ))}
        <li className="flex items-center justify-items-center" ref={listInnerRef}>
          {
            (busy && !allEventsListed2) && (
              <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            )
          }
          {
            allEventsListed2 && (
              <p className="mx-auto">No more results</p>
            )
          }
        </li>
      </ul>
    </span>
  )
}

export default EventsComponent;