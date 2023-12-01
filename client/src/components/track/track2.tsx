import React from "react";

import config from "../../config/config";

type MiniTrackType = {
  audioElement: HTMLAudioElement,
  play: boolean,
  onPlayToggle: () => any
}

const Track2: React.FC<MiniTrackType> = ({ audioElement, play, onPlayToggle }) => {

  const [parsedFilename, setParsedFilename] = React.useState<string>(audioElement.src.split('/').at(-1) || 'loading...')
  const [loadError, setLoadError] = React.useState<boolean>(false);
  const [index, setIndex] = React.useState<number>(0);
  const [duration, setDuration] = React.useState<number>(0);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    audioElement.addEventListener('loadeddata', () => {
      setLoaded(true);
      setDuration(audioElement.duration);
      setParsedFilename(audioElement.src.split('/').at(-1) || 'unknown track');
      audioElement.addEventListener('ended', () => { onPlayToggle() });
      audioElement.addEventListener('timeupdate', () => (Math.floor(audioElement.currentTime) > index) && setIndex(Math.floor(audioElement.currentTime)));
    });
    audioElement.addEventListener('error', () => {
      setLoadError(true);
      setParsedFilename(`Error loading ${audioElement.src.split('/').at(-1) || 'unknown track'}`)
    });

  }, [audioElement]);

  React.useEffect(() => {
    if (play) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }, [play]);

  return (
    <div 
      className='relative glass w-full my-1 rounded-md shadow-lg hover:shadow-xl'
    >

      <div className="grid grid-cols-5 gap3 bg-black">

        <div className="col-span-5 px-6 py-2 text-left text-white">
          {parsedFilename}
        </div>

        <div className="col-span-1 align-middle">
          <div className="">
            {
              !play &&
                <button
                  disabled={false && loadError}
                  className="btn btn-accent mr-2 mt-2"
                  onClick={() => onPlayToggle()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 384 512"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>
                </button>
            }
            {
              play &&
                <button
                  disabled={false && loadError}
                  className="btn btn-circle btn-accent mr-2 mt-2"
                  onClick={() => onPlayToggle()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 320 512"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>              
                </button>
            }
          </div>
        </div>

        <div className="col-span-3">
          <input
            disabled={false && loadError}
            type="range" 
            min={0} 
            max={Math.floor(audioElement.duration) || 0} 
            value={index} 
            className="range range-secondary range-xs mt-4"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIndex(Math.floor(parseFloat(e.target.value)));
              loaded && (audioElement.currentTime = Math.floor(parseFloat(e.target.value)));
            }}
          />
          <div className="w-full flex justify-between text-xs px-2 mb-4">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
          </div>
        </div>

        <div className="col-span-1">
          {
            (!loaded && !loadError) && 
              <div className="text-center">
                <div className="lds-roller mx-auto"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
              </div>
          }
          {
            (!loaded && loadError) && 
              <div className="text-center">
                <svg className="inline-block fill-slate-50" xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
              </div>
          }
          {
            loaded &&
              <div className="flex justify-center items-center w-full h-full">
                <div className="block">
                  <span className=" text-white inline-block">
                    {`${Math.floor(index / 60).toString().padStart(2, '0')}:${(index % 60).toString().padStart(2, '0')}/`}
                  </span>
                  <span className=" text-white inline-block">
                    {`${Math.floor(duration / 60).toString().padStart(2, '0')}:${(Math.round(duration) % 60).toString().padStart(2, '0')}`}
                  </span>
                </div>
              </div>
          }
        </div>
      </div>

    </div>
  )
}

export default Track2;