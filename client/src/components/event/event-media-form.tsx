import React from 'react';

import { ModalContext } from '../modal/modal';
import Gallery from '../gallery/gallery';

import config from '../../config/config';
import Gallery2 from '../gallery/gallery2';
import Gallery3 from '../gallery/gallery3';
import Gallery4 from '../gallery/gallery4';

import MediaViewer from '../media-viewer/media-viewer';

import { acceptedMediaExtensions } from '../../models/models';

type Props = {
  media: string[],
  associatedMedia: string[],
  resolve: (associatedMedia: string[] | null) => any
};


const EventMediaForm: React.FC<Props> = ({ media, associatedMedia, resolve }) => {

  const modalContext = React.useContext(ModalContext);
  const init = React.useRef(true);

  const [selectedMedia, setSelectedMedia] = React.useState<string[]>(associatedMedia);
  const [externalUrlInput, setExternalUrlInput] = React.useState<string>('');

  return (
    <span>
      <div className='flex'>
        <input 
          type="text"
          placeholder="External Media URL"
          accept='video/*, image/*'
          className="inline-block border border-gray-300 rounded-lg w-48 m-1 p-1 text-blue-500 hover:underline" 
          value={externalUrlInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setExternalUrlInput(e.target.value)}
        />
        <button 
          className={`btn btn-success ml-1`}
          onClick={() => externalUrlInput && setSelectedMedia(selectedMedia => [...selectedMedia, externalUrlInput])}
        >Add</button>
        <button 
          className={`btn btn-primary ml-auto`}
          onClick={ () => resolve(selectedMedia) }
        >Accept</button>
      </div>
      <div className='w-[400px] md:w-[600] max-h-96 overflow-y-auto mt-2'>
        <Gallery4 maxColumnWidth={100}>
          {
            [...media, ...selectedMedia.filter(sm => !media.includes(sm))].map(a => (
              <div 
                key={a} 
                className="relative m-1 hover:cursor-pointer"
              >
                {
                  selectedMedia.includes(a) &&
                  <p 
                    className="absolute -right-3 -top-3 bg-success p-1 rounded-full w-6 h-6 cursor-pointer border-2 border-black"
                  >
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                    </span>
                  </p>
                }
                {
                  acceptedMediaExtensions.image.filter(accepted => a.toLowerCase().endsWith(accepted)).length ?
                    <img 
                      // style={{height: window.innerHeight-100}}
                      // height={ window.innerHeight - 100 }
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
                      onClick={() => setSelectedMedia(selectedMedia.includes(a) ? selectedMedia.filter(sm => sm !== a) : [...selectedMedia, a])}
                    >
                    </img>
                  :
                    (
                      a.toUpperCase().startsWith('HTTP://') ||
                      a.toUpperCase().startsWith('HTTPS://') ||
                      a.toUpperCase().startsWith('www.')
                    ) ?
                      <div
                        onClick={() => setSelectedMedia(selectedMedia.includes(a) ? selectedMedia.filter(sm => sm !== a) : [...selectedMedia, a])}
                      >
                        <iframe 
                          className=" w-full h-auto pointer-events-none"
                          src={a}

                        ></iframe>
                      </div>  

                    :
                      <video
                        // style={{height: window.innerHeight-100}}
                        src={config.ASSETS[config.ENVIRONMENT] + `media/${a}`}
                        autoPlay={false} muted={true} loop={true}
                        onClick={() => setSelectedMedia(selectedMedia.includes(a) ? selectedMedia.filter(sm => sm !== a) : [...selectedMedia, a])}
                      ></video>
                }
              </div>
            ))
          }
        </Gallery4>
      </div>
    </span>
  );
}

export default EventMediaForm;