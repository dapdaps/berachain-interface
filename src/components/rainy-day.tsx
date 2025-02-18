import React, { useEffect, useState } from 'react';

interface RainDropProps {
  delay: number;
  duration: number;
  opacity: number;
  height: number;
  left: string;
}

const RainDrop: React.FC<RainDropProps> = ({ delay, duration, left, opacity, height }) => {
  return (
    <div
      className="absolute animate-rainfall -translate-y-full rotate-[-30deg] w-[2px] h-[30px] bg-[linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(255,255,255,1)_100%)] rounded-[0_0_2px_2px]"
      style={{
        left,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity,
        height,
      }}
    />
  );
};

interface RainEffectProps {
  dropCount?: number;
  minSpeed?: number;
  maxSpeed?: number;
}

const RainyDay: React.FC<RainEffectProps> = ({
  dropCount = 100,
  minSpeed = 1,
  maxSpeed = 3,
}) => {
  const [raindrops, setRaindrops] = useState<Array<{
    id: number;
    delay: number;
    duration: number;
    left: string;
  }>>([]);

  useEffect(() => {
    const drops = Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      left: `${Math.random() * 100}%`,
    }));
    setRaindrops(drops);
  }, [dropCount, minSpeed, maxSpeed]);

  return (
    <div className="fixed inset-0 w-[130dvw] h-full pointer-events-none z-[9] left-0 top-0">
      {raindrops.map((drop) => (
        <RainDrop
          key={drop.id}
          delay={drop.delay}
          duration={drop.duration}
          left={drop.left}
          opacity={Math.random() * 0.4 + 0.3}
          height={Math.floor(Math.random() * 31 + 20)}
        />
      ))}
    </div>
  );
};

export default RainyDay;
