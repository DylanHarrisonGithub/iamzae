import React from "react";

import AudioPlayer2 from "../components/audio-player/audio-player2";
import HttpService from "../services/http.service";
import Track from "../components/track/track";

const Listen: React.FC<any> = () => {

  const [trackList, setTrackList] = React.useState<string[]>([]);
  const [trackPlay, setTrackPlay] = React.useState<boolean[]>([]);
  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null);

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

  React.useEffect(() => setTrackPlay(Array(trackList.length).fill(false)), [trackList]);
  
  return (
    <div className="pt-16 diamonds">
      <div className="container py-16 min-h-screen mx-auto">
        <h1 className="text-xl gold-text text-center align-middle inline-block ml-8 pb-8">
          &nbsp;&nbsp;Listen&nbsp;&nbsp;
        </h1>

        <AudioPlayer2 audioElement={audioElement} />

        <div className="text-center p-1 m-1 md:p-8 md:m-8 bg-slate-400 bg-opacity-90 rounded-lg">

          {
            trackList.map((t,i) => (
              <div 
                key={i}
                className="relative m-1"
              >

                <Track 
                  audioFileName={t} 
                  play={trackPlay[i]} 
                  onPlayToggle={(p, a) => { setTrackPlay(trackPlay => trackPlay.map((v,ti) => ti === i ? p : false));  setAudioElement(p ? a : null) }}
                />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Listen