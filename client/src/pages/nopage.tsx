import React from "react";

import { COMMON_REGEXES } from "../services/validation.service";
import { EventPerformance, timeData } from "../models/models";
import Gallery4 from "../components/gallery/gallery4";
import QuickForm, { QuickFormSchemaMetaType } from "../components/quick-form/quick-form";
import { Schema } from "../services/validation.service";

import HttpService from "../services/http.service";
import MediaViewer from "../components/media-viewer/media-viewer";

import MediaPicker from "../components/quick-form/media-picker";

import { acceptedMediaExtensions } from "../models/models";
import AspectContainer, { ASPECT_RATIOS } from "../components/aspect-container/aspect-container";

const { periods, weekdays, months, daysPerMonth, years, dates, times } = timeData;

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const daynums = Array(31).fill('').map((n,i) => (i+1).toString());
type FormEvent = Omit<EventPerformance, "month" | "day" | "year" | "time" | "period"> & { 
  month: "Month" | EventPerformance["month"],
  day: "Day" | typeof daynums[number],
  year: "Year" | EventPerformance["year"],
  time: "Time" | EventPerformance["time"],
  period: "Period" | EventPerformance["period"],
  test: boolean
}

const periodPrases = (e: EventPerformance | FormEvent): string => {
  if (
    ([...dates] as any[]).includes(e.day) &&
    ([...months] as any[]).includes(e.month) &&
    ([...years] as any[]).includes(e.year) &&
    ([...periods] as any[]).includes(e.period)
  ) {
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
  }
  return '';
};





const NoPage: React.FC<any> = (props: any) => {

  const [formSchema, setFormSchema] = React.useState<Schema<QuickFormSchemaMetaType>>({});

  // React.useEffect(() => {
  //  (async () => {
  //   setFormSchema({
  //     day: { type: daynums, attributes: { required: true, range: { min: 1, max: 31 }, default: 'day' }, meta: { quickForm: { placeholder: "Select day..."}} },
  //     month: { type: [...months], attributes: { required: true, default: 'month' } },
  //     year: { type: 'number', attributes: { required: true, range: { min: 2020, max: 2120 } } },
  //     time: { type: [...times], attributes: { required: true, default: 'time' }},
  //     location: { type: 'string', attributes: { required: true } },
  //     thumbnail: { 
  //       type: 'string', 
  //       attributes: { required: false },
  //       meta: {
  //         quickForm: {
  //         }
  //       }
  //     },
  //     description: { 
  //       type: COMMON_REGEXES.COMMON_WRITING, 
  //       attributes: { required: true, strLength: { minLength: 5 }, }, 
  //       meta: { 
  //         quickForm: { 
  //           textArea: true, 
  //           textAreaRows: 4,
  //           placeholder: 'Enter your description here..',
  //           hideErrorMessages: true
  //         }
  //       }
  //     },
  //     website: { type: 'string', attributes: { required: false }},
  //     media: { type: 'string', attributes: { required: false, array: { minLength: 0 }}},
  //     period: { type: [...periods], attributes: { required: true, default: 'period' } },
  //     test: { 
  //       type: 'boolean', 
  //       attributes: { required: true },
  //       meta: {
  //         quickForm: {
  //           CustomInput: MediaPicker,
  //           customInputProps: { mediaList: (await HttpService.get<string[]>('medialist')).body!.filter(filename => acceptedMediaExtensions.image.filter(accepted => filename.toLowerCase().endsWith(accepted)).length || acceptedMediaExtensions.video.filter(accepted => filename.toLowerCase().endsWith(accepted)).length) || [] }
  //         }
  //       }
  //     }
  //   });
  //  })(); 
  // })




  return (
    <div className="pt-16 fan min-h-screen">PAGE MISSING
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
            <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
                <feColorMatrix
                    type="matrix"
                    values="
                        0 0 0 0   0.2
                        0 0.5 0 0   0
                        0.5 0 0 0   0
                        0 0 0 0.5 0
                    "
                />
                <feBlend mode="normal" in2="effect1_dropShadow" />
            </filter>
            <g filter="url(#neon-glow)">
                <circle className="neon-circle" cx="50" cy="50" r="20" />
                <circle className="neon-circle" cx="70" cy="50" r="15" />
                <circle className="neon-circle" cx="90" cy="50" r="10" />
                <circle className="neon-circle" cx="110" cy="50" r="5" />
            </g>
          </svg> */}
      {/* <AspectContainer aspectRatio="1.618:1">
        <div className="bg-white h-full">hello</div>
      </AspectContainer> */}
      <Gallery4 maxColumnWidth={288} maxColumns={6}>
        {
          Object.keys(ASPECT_RATIOS).map(ar => (
            <AspectContainer aspectRatio={ar as keyof typeof ASPECT_RATIOS}>
              <div className=" h-full p-1">
                <div className="bg-blue-200 h-full">
                  {ar}
                </div>
              </div>
            </AspectContainer>
          ))
        }
      </Gallery4>

      {/* <div className=" bg-white p-1">

        <QuickForm<FormEvent> labelPlacement={"left"} schema={formSchema} onInput={(obj) => {}}></QuickForm>
      a</div> */}


    </div>
  )
}

export default NoPage;