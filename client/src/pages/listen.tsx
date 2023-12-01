import React from "react";

import AudioPlayer2 from "../components/audio-player/audio-player2";
import HttpService from "../services/http.service";
import Track from "../components/track/track";
import Track2 from "../components/track/track2";
import config from "../config/config";
import AudioPlayer from "../components/audio-player/audio-player";

const Listen: React.FC<any> = () => {

  const [trackList, setTrackList] = React.useState<string[]>([]);
  const [trackPlay, setTrackPlay] = React.useState<boolean[]>([]);
  const [audioElements, setAudioElements] = React.useState<HTMLAudioElement[]>([]);
  const [audioElement, setAudioElement] = React.useState<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    (async () => {
      const res = await HttpService.get<string[]>('tracklist');
      if (res.success) {
        setTrackList(res.body || []);
        setAudioElements((res.body || []).map(trackName => new Audio()));
      } else {
        console.log(res);
      }
    })();
  }, []);

  React.useEffect(() => {
    audioElements.forEach((a,i) => a.crossOrigin = 'anonymous');
    audioElements.forEach((a, i) => a.src = config.ASSETS[config.ENVIRONMENT] + `tracks/${trackList[i] || ''}`)
  }, [audioElements]);

  React.useEffect(() => setTrackPlay(Array(trackList.length).fill(false)), [trackList]);
  
  return (
    <div className="pt-16 diamonds">
      <div className="container py-16 min-h-screen mx-auto">
        <h1 className="text-xl gold-text text-center align-middle inline-block ml-8 pb-8">
          &nbsp;&nbsp;Listen&nbsp;&nbsp;
        </h1>

        {/* <AudioPlayer audioFilePath={config.ASSETS[config.ENVIRONMENT] + `tracks/${trackList[0] || ''}`}></AudioPlayer> */}
        <AudioPlayer2 audioElement={trackPlay.some(v => v === true) ? audioElements[trackPlay.indexOf(true)] : null} />

        <div className="text-center px-1 mx-1 md:px-8 md:mx-8 bg-slate-400 bg-opacity-90 rounded-lg">

          {
            audioElements.map((a,i) => (
              <div 
                key={i}
                className="relative m-1"
              >
                <Track2 
                  audioElement={a}
                  play={trackPlay[i]} 
                  onPlayToggle={() => { setTrackPlay(trackPlay => trackPlay.map((v,ti) => ti === i ? !v : false)); }}
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