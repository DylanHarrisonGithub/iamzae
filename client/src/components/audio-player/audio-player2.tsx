import React, { useRef, useEffect, useState } from "react";

interface AudioPlayer2Props {
  audioElement: HTMLAudioElement | null
}

const AudioPlayer2: React.FC<AudioPlayer2Props> = ({ audioElement }) => {
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const canvas = canvasRef.current;
    const canvasCtx = canvas?.getContext("2d");

    if (audioContext && canvasCtx && audioElement) {

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
    }

  }, [audioElement]);

  return (
    <div className="flex flex-col items-center mt-8">
      <canvas ref={canvasRef} className="w-full h-32 mb-4"></canvas>
      <p className="text-white">{audioElement && (audioElement!.paused).toString()}</p>
    </div>
  );
};

export default AudioPlayer2;
