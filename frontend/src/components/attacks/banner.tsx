import React, { useEffect, useRef } from 'react';
import StarrySky from './starrysky';

const Banner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let sky: StarrySky | null = null;

    if (canvasRef.current) {
      sky = new StarrySky(canvasRef.current);
    }

    // TODO: Fix dismounting
    return () => {
      if (sky) {
        // window.cancelAnimationFrame(sky?.rafId);
      }
    };
  }, []);

  return (
    <div className="absolute w-screen max-h-[300px] overflow-hidden bg-black z-[-99]">
      <div className="relative w-screen max-h-[300px] overflow-hidden bg-black z-[-99]">
        <canvas ref={canvasRef} className="w-full h-full"></canvas>
        <div
          className="absolute bottom-0 w-full h-1/3 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent, black)' }}
        ></div>
      </div>
    </div>
  );
};

export default Banner;
