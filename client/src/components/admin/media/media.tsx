import React from 'react';

import { ModalContext } from '../../modal/modal';
import Gallery from '../../gallery/gallery';
import MediaViewer from '../../media-viewer/media-viewer';

import HttpService from '../../../services/http.service';

import config from '../../../config/config';

type Props = {
  media: string[],
  setMedia: React.Dispatch<React.SetStateAction<string[]>>,
  quickGet: <T = void>(route: string) => Promise<T | void>
};

const acceptedMedia = [
  'gif', 'jpg', 'jpeg', 'png',
  'mov', 'mp4', 'mpeg', 'webm', 'ogg'
];

const Media: React.FC<Props> = ({media, setMedia, quickGet}) => {

  const modalContext = React.useContext(ModalContext);
  const init = React.useRef(true);

  React.useEffect(() => {
    if (init.current) {
      quickGet<string[]>('medialist').then(res => setMedia(res ? ['https://img-getpocket.cdn.mozilla.net/296x148/filters:format(jpeg):quality(60):no_upscale():strip_exif()/https%3A%2F%2Fs.zkcdn.net%2FAdvertisers%2F549ca9e40e6f4f83931b10792225952a.png', ...res.filter(m => acceptedMedia.filter(accepted => m.toLowerCase().endsWith(accepted)).length)] : []));
      init.current = false;
    }
  }, [media]);

  return (
    <span>
      <Gallery>
        {
          media.map(a => (
            <span key={a} className="relative">
              <p 
                className="absolute -right-3 -top-3 bg-red-500 p-1 rounded-full w-6 h-6 cursor-pointer border-2 border-black"
                onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete\n ${a}?`, options: ["yes", "no"]}))!.then(res => {
                  if (res === "yes") {
                    HttpService.delete<void>('deletemedia', { filename: a }).then(res => {
                      if (res.success) {
                        setMedia(mediaList => mediaList.filter(mediaListFilename => mediaListFilename !== a));
                        res.messages.forEach(m => modalContext.toast!('success', m));
                      } else {
                        modalContext.toast!('warning', `Unable to delete media ${a}`);
                        res.messages.forEach(m => modalContext.toast!('warning', m));
                      }
                    });
                  }
                }).catch(e => {})}
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">X</span>
              </p>
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
      <input 
        type="file"
        accept='video/*, image/*'
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-5 my-5 rounded m-5 file-input file-input-bordered file-input-primary w-full max-w-xs" 
        onChange={e => (e.target.files?.[0]) && HttpService.upload<string[]>('uploadmedia', e.target.files[0]).then(res => {
          // && acceptedMedia.filter(accepted => e.target.files![0].name.toLowerCase().endsWith(accepted)).length
          (res.success && res.body) && (() => {
            setMedia(res.body);
            modalContext.toast!('success', 'Successfully loaded media filenames.');
            res.messages.forEach(m => modalContext.toast!('success', m));
          })();
          !(res.success) && (() => {
            res.messages.forEach(m => modalContext.toast!('warning', m));
            modalContext.toast!('warning', 'Unable to load media filenames. See console'); 
            console.log(res);
          })();
        })}
      />
    </span>
  );
}

export default Media;