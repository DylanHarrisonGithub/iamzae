import React, { ChangeEvent } from "react";

import Gallery4 from "../gallery/gallery4";
import { acceptedMediaExtensions } from "../../models/models";
import config from "../../config/config";

interface MediaPickerProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  mediaList?: string[];
  sizing?: "small" | "medium" | "large" | "free"
}

const MediaPicker: React.FC<MediaPickerProps> = ({ value, name, placeholder, mediaList, onChange, ...rest }) => {

  const [selectedValue, setSelectedValue] = React.useState<string>('');
  const [showGallery, setShowGallery] = React.useState<boolean>(false);
  const [customUrl, setCustomUrl] = React.useState<string>('');
  const [validCustomUrl, setValidCustomUrl] = React.useState<boolean>(false);

  const selectRef = React.useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    if (onChange && selectRef.current) {
      selectRef.current.value = 'toast';//selectedValue;
      const event = {
        target: {
          value: 'toasat2'
        }
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event);
    }
  }, [selectedValue]);

  React.useEffect(() => {
    if (
      customUrl.toUpperCase().startsWith('HTTP://') ||
      customUrl.toUpperCase().startsWith('HTTPS://') ||
      customUrl.toUpperCase().startsWith('WWW.')
    ) {
      if (acceptedMediaExtensions.image.filter(accepted => customUrl.toLowerCase().endsWith(accepted)).length) {
        setValidCustomUrl(true);
      } else {
        setValidCustomUrl(false);
      }
    } else {
      setValidCustomUrl(false);
    }
  }, [customUrl]);

  return (
    <div>
      <div className="relative w-full h-0 pt-[100%] rounded-md bg-blue-400 overflow-hidden">
        {
          !!(selectedValue.length) &&
            acceptedMediaExtensions.image.filter(accepted => selectedValue.toLowerCase().endsWith(accepted)).length ?
              <img
                loading={"lazy"}
                className="absolute top-0 left-0 right-0 bottom-0 m-0 p-0 w-full h-full object-cover rounded-md hover:cursor-pointer"
                onClick={() => setShowGallery(s => !s)} 
                src={
                  (
                    selectedValue.toUpperCase().startsWith('HTTP://') ||
                    selectedValue.toUpperCase().startsWith('HTTPS://') ||
                    selectedValue.toUpperCase().startsWith('WWW.')
                  ) ?
                    selectedValue
                  :
                    config.ASSETS[config.ENVIRONMENT] + `media/${selectedValue}`
                }
              >
              </img>
            :
              <video
                className="absolute top-0 left-0 right-0 bottom-0 m-0 p-0 w-full h-full object-cover rounded-md hover:cursor-pointer"
                onClick={() => setShowGallery(s => !s)} 
                src={
                  (
                    selectedValue.toUpperCase().startsWith('HTTP://') ||
                    selectedValue.toUpperCase().startsWith('HTTPS://') ||
                    selectedValue.toUpperCase().startsWith('www.')
                  ) ?
                    selectedValue
                  :
                    config.ASSETS[config.ENVIRONMENT] + `media/${selectedValue}`
                }
                controls={false} autoPlay={false} muted={true} loop={true}
              ></video>
        }
        {
          !(selectedValue.length) &&
            <svg className="absolute top-0 left-0 right-0 bottom-0 m-0 p-0 w-full h-full object-cover rounded-md hover:cursor-pointer" onClick={() => setShowGallery(s => !s)} xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
        }

        {
          showGallery &&
            <div className="shadow-lg rounded-md z-2 absolute bg-white left-0 top-0 right-0 bottom-0 overflow-y-scroll text-center border-2">
              <div 
                className={`mt-2 text-center input-group-sx border-2 inline-block rounded-xl ${
                  customUrl.length ?
                    validCustomUrl ?
                      `border-success`
                    :
                      `border-error`
                  :
                    ` border-gray-300`
                }`}
              >
                <input 
                  placeholder="Media URL" 
                  className={` outline-none inline-block w-32 pl-3`} 
                  value={customUrl} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomUrl(e.target.value)}
                ></input>
                <button 
                  className={`btn ${validCustomUrl ? `btn-success` : `btn-error`}`} 
                  disabled={!customUrl.length || !validCustomUrl} 
                  onClick={(e) => {
                    e.stopPropagation(); setSelectedValue(customUrl); setShowGallery(false);
                  }}
                >
                  Set
                </button>
              </div>
              <Gallery4 maxColumns={8} maxColumnWidth={64}>
                {
                  mediaList?.map(a => (
                    <span key={a} className="inline-block relative my-[1px] mx-[1px] box-border hover:cursor-pointer hover:shadow-md shadow-pink-400">
                      <img
                        width={64}
                        height={64}
                        loading={"lazy"}
                        className="inline-block m-0 p-0 w-16 h-16 object-cover" 
                        src={
                          (
                            a.toUpperCase().startsWith('HTTP://') ||
                            a.toUpperCase().startsWith('HTTPS://') ||
                            a.toUpperCase().startsWith('WWW.')
                          ) ?
                            a
                          :
                            config.ASSETS[config.ENVIRONMENT] + `media/${a}`
                        }
                        onClick={(e) => {
                          e.stopPropagation(); setSelectedValue(a); setShowGallery(false);
                        }}
                      >
                      </img>
                    </span>
                  ))
                }
              </Gallery4>

            </div>
        }

      </div>

      <select ref={selectRef} style={{ display: "none" }} className={'hidden'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {setSelectedValue(e.target.value)}} {...rest}>
        {mediaList}
      </select>
    </div>
  );
};

export default MediaPicker;