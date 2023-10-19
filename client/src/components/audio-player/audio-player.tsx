import React, { useRef, useEffect, useState } from "react";

interface AudioPlayerProps {
  audioFilePath: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioFilePath }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (audioContext && canvasCtx && audioRef.current) {
      const audioElement = audioRef.current;
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const drawVisualizer = () => {
        if (canvas) {
          analyser.getByteFrequencyData(dataArray);
          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  
          const barWidth = (canvas.width / bufferLength) * 2;
          let x = 0;
  
          dataArray.forEach((value) => {
            const barHeight = value / 2;
            canvasCtx.fillStyle = `rgb(0, ${barHeight + 100}, 0)`;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
          });
  
          requestAnimationFrame(drawVisualizer);
        }

      };

      audioElement.addEventListener("play", () => {
        setIsPlaying(true);
        drawVisualizer();
      });

      audioElement.addEventListener("pause", () => {
        setIsPlaying(false);
      });

      audioElement.src = audioFilePath;
    }

    return () => {
      if (audioContext) {
        audioContext.close().catch((error) => {
          console.error("Failed to close audio context:", error);
        });
      }
    };
  }, [audioFilePath]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <canvas ref={canvasRef} className="w-full h-32 mb-4"></canvas>
      <audio crossOrigin="anonymous" ref={audioRef} />
      <button
        onClick={togglePlay}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default AudioPlayer;
