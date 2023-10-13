import React from "react";

import { EventPerformance, timeData } from '../../models/models';

import ValidationService, { Schema } from "../../services/validation.service";
import config from "../../config/config";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const periodPrases = (e: EventPerformance | FormEvent): string => {
  if (
    ([...dates] as any[]).includes(e.day) &&
    ([...months] as any[]).includes(e.month) &&
    ([...years] as any[]).includes(e.year) &&
    ([...periods] as any[]).includes(e.period)
  ) {
    let { year, month, day, period } = (e as EventPerformance);
    const dayNum = (new Date(year, months.indexOf(month), day)).getDay()
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
  }
  return '';
};

type Props = {
  mediaList: string[],
  resolve: (eventPerformance: EventPerformance | null) => any
  init?: EventPerformance,
};

type FormEvent = Omit<EventPerformance, "month" | "day" | "year" | "time" | "period"> & { 
  month: "Month" | EventPerformance["month"],
  day: "Day" | EventPerformance["day"],
  year: "Year" | EventPerformance["year"],
  time: "Time" | EventPerformance["time"],
  period: "Period" | EventPerformance["period"]
}

const EventForm: React.FC<Props> = ({ mediaList, resolve, init }) => {

  const eventSchema: Schema = {
    day: { type: 'number', attributes: { required: true, range: { min: 1, max: 31 } } },
    month: { type: [...months], attributes: { required: true } },
    year: { type: 'number', attributes: { required: true, range: { min: 2020, max: 2120 } } },
    time: { type: [...times], attributes: { required: true }},
    location: { type: 'string', attributes: { required: true } },
    thumbnail: { type: 'string', attributes: { required: false } },
    description: { type: 'string', attributes: { required: true, strLength: { minLength: 5 } }},
    website: { type: 'string', attributes: { required: false }},
    media: { type: 'string', attributes: { required: false, array: { minLength: 0 }}},
    period: { type: [...periods], attributes: { required: true } }
  };

  const [touched, setTouched] = React.useState<boolean>(false);
  const [event, setEvent] = React.useState<FormEvent>({
    id: init?.id || -1, timestamp: init?.timestamp || -1,
    day: init?.day || "Day", month: init?.month ||'Month', year: init?.year || "Year", 
    time: init?.time ||"Time", website: init?.website || '', location: init?.location ||'', 
    thumbnail: init?.thumbnail || '', description: init?.description || '', period: init?.period || 'Period', media: init?.media || []
  });
  const [formErrors, setFormErrors] = React.useState<{ [key: string]: string[] }>({});
  const [showImgMenu, setShowImgMenu] = React.useState<boolean>(false);
  const firstRender = React.useRef<number>(2);

  React.useEffect(() => {

    (async () => {
      let vErrors = (await ValidationService.validate(event, eventSchema)).body;
      let errorKeys: string[] = [];
      vErrors?.forEach(err => {
        if (!errorKeys.includes(err.split(" ")[0])) {
          errorKeys.push(err.split(" ")[0])
        }
      });
      let errorObj: { [key: string]: string[] } = {};
      errorKeys.forEach(key => {
        errorObj[key] = (vErrors?.filter(err => err.split(' ')[0] === key)!).map(err => err.split(' ').slice(1).join(' '))
      });
      setFormErrors(errorObj);
      (!touched && !firstRender.current) && setTouched(true);
      firstRender.current  && (firstRender.current -= 1);

      // (typeof schema[key].type === 'string' && !((<string>schema[key].type).includes(typeof input)))
      console.log(typeof eventSchema.day.type, typeof event.day, (eventSchema.day.type as string).includes(typeof event.day));
    })();
  }, [event]);

  return (
    <span className="inline-block w-[669px]">
      {/* <QuickForm<EvtPerformance> schema={eventSchema} onInput={() => {}}/> */}

      <li className="flex p-4 border border-gray-300 rounded shadow-md">
        <div className="flex-shrink-0 mr-4">
          <div 
            className='group w-20 h-20 border border-gray-300 rounded shadow-md btn btn-ghost p-0 relative'
            onClick={() => setShowImgMenu(prev => !prev)}
          >
            <span
              className="pointer-events-none absolute -top-9 left-10 opacity-0 p-2 transition-opacity group-hover:opacity-100 bg-slate-200 border-gray-300 rounded shadow-md"
            >
              Change Image
            </span>
            <img 
              src={
                (
                  event.thumbnail.toUpperCase().startsWith('HTTP://') ||
                  event.thumbnail.toUpperCase().startsWith('HTTPS://') ||
                  event.thumbnail.toUpperCase().startsWith('www.')
                ) ?
                  event.thumbnail
                :
                  config.ASSETS[config.ENVIRONMENT]+"media/"+event.thumbnail
              } alt="Event Pic" className="object-cover w-full h-full rounded cursor-pointer" 
            />
          </div>
          <ul 
            className={`absolute mt-1 top-28 left-9 transition-opacity bg-base-100 text-left shadow-lg ${
              showImgMenu ?
                "opacity-100 pointer-events-auto"
              :
                "opacity-0 pointer-events-none"
            }`}
            onBlur={() => setShowImgMenu(prev => false)}
            onMouseLeave={() => setShowImgMenu(prev => false)}
          > 
            <li className={'border'}><input className="w-full" type="text" placeholder='image url:' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEvent(prev => ({ ...prev, thumbnail: e.target.value }))}></input></li>
            {/* media.filter(fname => acceptedMedia.slice(0, 4).filter(accepted => fname.toLowerCase().endsWith(accepted)).length) */}
            { 
              mediaList.filter(fname => acceptedMedia.slice(0, 4).filter(accepted => fname.toLowerCase().endsWith(accepted)).length).map((v, i) => (<li key={i+v} className={`border cursor-pointer max-w-sm hover:bg-slate-400`} onClick={() => {
                setEvent(prev => ({ ...prev, thumbnail: v }));
                setShowImgMenu(prev => false);
              }}>{v}</li>)) 
            }
          </ul>
        </div>
        <div className="flex-grow">
          <div className="flex items-center mb-2 space-x-2">
            <div className="text-lg font-semibold">
              <select 
                className={`select select-sm inline-block border border-gray-300 rounded-lg w-28 m-1 ${touched && (Object.keys(formErrors).includes('month') ? 'border-red-500' : 'border-green-500')}`}
                value={event.month}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(prev => ({ ...prev, month: (e.target.value as typeof months[number]) }))}
              >
                {
                  ['Month', ...months].map((m, i) => <option key={i+m}>{m}</option>)
                }
              </select>
              <select 
                className={`select select-sm inline-block border border-gray-300 rounded-lg w-20 m-1 ${touched && (Object.keys(formErrors).includes('day') ? 'border-red-500' : 'border-green-500')}`}
                value={event.day}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(prev => ({ ...prev, day: e.target.value === 'Day' ? 'Day' : (parseInt(e.target.value) as typeof dates[number]) }))}
              >
                {
                  ['Day', ...Array(daysPerMonth[[...months, 'Month'].indexOf(event.month)]).keys()].map((d, i) => <option key={i+d.toString()}>{d === 'Day' ? d : (d as number)+1}</option>)
                }
              </select>
              ,
              <select 
                className={`select select-sm inline-block border border-gray-300 rounded-lg w-20 m-1 ${touched && (Object.keys(formErrors).includes('year') ? 'border-red-500' : 'border-green-500')}`}
                value={event.year}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(prev => ({ ...prev, year: e.target.value === 'Year' ? 'Year' : (parseInt(e.target.value) as typeof years[number]) }))}
              >
                {
                  ['Year', ...years].map((y, i) => (<option key={i+y.toString()}>{y}</option>))
                }
              </select>
            </div>
            <div className="text-gray-600">
              <select 
                className={`select select-sm inline-block border border-gray-300 rounded-lg w-24 m-1 ${touched && (Object.keys(formErrors).includes('time') ? 'border-red-500' : 'border-green-500')}`}
                value={event.time}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(prev => ({ ...prev, time: (e.target.value as typeof times[number]) }))}
              >
                {
                  ['Time', ...times].map((t, i) => <option key={i+t}>{t}</option>)
                }
              </select>
            </div>
            <select
              className={`select select-sm inline-block border border-gray-300 rounded-lg w-28 m-1 ${touched && (Object.keys(formErrors).includes('period') ? 'border-red-500' : 'border-green-500')}`}
              value={event.period}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEvent(prev => ({ ...prev, period: (e.target.value as typeof periods[number])}))}
            >
              { ['Period', ...periods].map((p, i) => (<option key={i+p}>{p}</option>))}
            </select>
          </div>
          
          <div className="flex text-lg font-medium mb-2">
            <input 
              className={`inline-block border border-gray-300 rounded-lg w-48 m-1 p-1 ${touched && (Object.keys(formErrors).includes('location') ? 'border-red-500' : 'border-green-500')}`}
              type="text" 
              placeholder={'Location'} 
              value={event.location} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEvent(prev => ({ ...prev, location: e.target.value }))}
            ></input>
            <div className='inline-block text-center ml-auto mr-1 pt-2 alert h-10 mt-1'> { periodPrases(event) } </div>
          </div>
          <div className={`text-gray-700 mb-4 ml-1`}>
            <textarea 
              rows={4}
              cols={64} //max-w-xs lg:max-w-lg xl:max-w-2xl
              className={`resize-none w-[533px] block p-2.5 bg-gray-50 rounded-lg border border-gray-300 ${touched && (Object.keys(formErrors).includes('description') ? 'border-red-500' : 'border-green-500')}`} 
              placeholder="Write your event description here..."
              value={event.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEvent(prev => ({ ...prev, description: e.target.value }))}
            ></textarea>
          </div>
          <div className={`flex text-lg font-medium mb-2`}>
            <input 
              className={`inline-block border border-gray-300 rounded-lg w-48 m-1 p-1 text-blue-500 hover:underline  ${touched && (Object.keys(formErrors).includes('website') ? 'border-red-500' : 'border-green-500')}`} 
              type="text" 
              placeholder={'Venue Website URL'} 
              value={event.website} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEvent(prev => ({ ...prev, website: e.target.value }))}
            ></input>
          </div>
        </div>
      </li>
      <div className="flex mt-3">
        {
          (touched && !!Object.keys(formErrors).length) &&
            // <div className="inline-block alert alert-error mr-2 h-12 pl-10 pt-3">{Object.keys(formErrors)[0] + ": " + formErrors[Object.keys(formErrors)[0]][0]}</div>
            <select 
              className="inline-block alert alert-error mr-2 h-12 pt-4 text-sm">
              { // todo: focus input element corresponding to selected error
                Object.keys(formErrors).reduce((opts, key) => [...formErrors[key].map(err => (<option className="text-xs">{key + " " + err}</option>)), ...opts],([] as React.ReactNode[]))
              }
            </select>
        }
        <button className={`btn btn-primary mr-2 ml-auto`} disabled={!touched || !!Object.keys(formErrors).length} onClick={() => { resolve(event as EventPerformance); }}>Submit</button>
        <button className="btn btn-warning" onClick={() => { resolve(null); }}>Cancel</button>
      </div>
    </span>
  );
}

export default EventForm;