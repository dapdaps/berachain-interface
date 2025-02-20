import React, { useEffect, useRef } from 'react';
import { useSize } from 'ahooks';

interface RainDropParticle {
  x: number;
  y: number;
  length: number;
  speed: number;
}

interface CanvasRainProps {
  width?: number;
  height?: number;
  dropCount?: number;
  minSpeed?: number;
  maxSpeed?: number;
  angle?: number;
  speedMultiplier?: number;
}

const CanvasRain: React.FC<CanvasRainProps> = ({
  width = window.innerWidth,
  height = window.innerHeight,
  dropCount = 100,
  minSpeed = 10,
  maxSpeed = 20,
  angle = 30,
  speedMultiplier = 1.2
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const size = useSize(containerRef);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raindrops = useRef<RainDropParticle[]>([]);
  const animationFrameId = useRef<number>(0);
  // Cache computed values
  const angleRad = useRef<number>(0);
  const sin = useRef<number>(0);
  const cos = useRef<number>(0);

  // Initialize raindrops (create new array only when necessary)
  const initRaindrops = () => {
    const tanAngle = Math.tan(angleRad.current);
    const maxX = width + height * tanAngle;

    if (raindrops.current.length !== dropCount) {
      raindrops.current = Array.from({ length: dropCount }, () => ({
        x: Math.random() * maxX,
        y: Math.random() * height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed
      }));
    } else {
      // Reuse existing array to avoid reallocation
      raindrops.current.forEach(drop => {
        drop.x = Math.random() * maxX;
        drop.y = Math.random() * height;
        drop.length = Math.random() * 20 + 10;
        drop.speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
      });
    }
  };

  // Update raindrop positions and draw
  const updateRaindrops = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    const speedSin = speedMultiplier * sin.current;
    const speedCos = speedMultiplier * cos.current;

    raindrops.current.forEach(drop => {
      // Update position
      drop.x -= drop.speed * speedSin;
      drop.y += drop.speed * speedCos;

      // Reset position when out of bounds
      if (drop.y > height) {
        drop.y = 0;
        drop.x = Math.random() * (width + height * Math.tan(angleRad.current));
      }
      if (drop.x < -drop.length) {
        drop.x = width;
        drop.y = Math.random() * height;
      }

      const startX = drop.x;
      const startY = drop.y;
      const endX = startX - sin.current * drop.length;
      const endY = startY + cos.current * drop.length;

      // Create gradient
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(255,255,255,1)');

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = gradient;
      ctx.stroke();
    });
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    updateRaindrops(ctx);
    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (!size) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update canvas properties only when needed
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    // Cache trigonometric calculations
    angleRad.current = angle * Math.PI / 180;
    sin.current = Math.sin(angleRad.current);
    cos.current = Math.cos(angleRad.current);

    // Set drawing properties (only once)
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
    }

    initRaindrops();
    animate();

    // Cleanup function
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [size, width, height, dropCount, minSpeed, maxSpeed, angle, speedMultiplier]);

  return (
    <div
      ref={containerRef}
      className="fixed z-[9] inset-0 w-full h-full left-0 top-0 pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default CanvasRain;
