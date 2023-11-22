import React from "react";

import Track from "../../components/track/track";

import { ModalContext } from "../../components/modal/modal";
import HttpService from "../../services/http.service";

const acceptedMedia = ['mp3', 'wav', 'ogg'];

const AdminTracks: React.FC<any> = (props: any) => {

  const modalContext = React.useContext(ModalContext);
  const [trackList, setTrackList] = React.useState<string[]>(['test.wav', `https://upload.wikimedia.org/wikipedia/commons/b/ba/Beethoven_Piano_Sonata_21%2C_1st_movement%2C_bars_78-84.wav`]);
  const [trackPlay, setTrackPlay] = React.useState<boolean[]>([false, false]);

  React.useEffect(() => {
    (async () => {
      const res = await HttpService.get<string[]>('tracklist');
      if (res.success) {
        setTrackList(res.body || []);
      } else {
        console.log(res);
      }
    })();
  }, []);

  return (
    <div className="py-16 px-4 mx-auto diamonds">

      <h1 className="text-xl gold-text text-center align-middle inline-block ml-2 md:ml-8 mt-16">
        &nbsp;&nbsp;Admin Tracks&nbsp;&nbsp;
      </h1>

      <div className="text-center p-1 m-1 md:p-8 md:m-8 bg-slate-400 bg-opacity-90 rounded-lg">
        <input 
          type="file"
          accept='audio/*'
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mx-5 my-5 rounded m-5 file-input file-input-bordered file-input-primary w-full max-w-xs" 
          onChange={e => (e.target.files?.[0]) && HttpService.upload<string[]>('uploadtrack', e.target.files[0]).then(res => {
            // && acceptedMedia.filter(accepted => e.target.files![0].name.toLowerCase().endsWith(accepted)).length
            (res.success && res.body) && (() => {
              setTrackList(res.body);
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
        {
          trackList.map((t,i) => (
            <div 
              key={i}
              className="relative m-1"
            >

              <Track 
                audioFileName={t} 
                play={trackPlay[i]} 
                onPlayToggle={(p, a) => { setTrackPlay(trackPlay => trackPlay.map((v,ti) => ti === i ? p : false)) }}
              />
              <p 
                className="absolute -right-3 -top-3 bg-red-500 p-1 rounded-full w-10 h-10 cursor-pointer border-2 border-black"
                onClick={() => (modalContext.modal!({prompt: `Are you sure you want to delete\n ${t}?`, options: ["yes", "no"]}))!.then(res => {
                  if (res === "yes") {
                    HttpService.delete<void>('deletemedia', { filename: t }).then(res => {
                      if (res.success) {
                        setTrackList(oldTrackList => oldTrackList.filter(trackListFilename => trackListFilename !== t));
                        res.messages.forEach(m => modalContext.toast!('success', m));
                      } else {
                        modalContext.toast!('warning', `Unable to delete media ${t}`);
                        res.messages.forEach(m => modalContext.toast!('warning', m));
                      }
                    });
                  }
                }).catch(e => {})}
              >
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">X</span>
              </p>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default AdminTracks;