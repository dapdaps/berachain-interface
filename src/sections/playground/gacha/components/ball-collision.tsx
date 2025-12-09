'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  image: HTMLImageElement;
  rotation: number;
  rotationSpeed: number;
}

export interface BallCollisionHandle {
  start: () => void;
  stop: () => void;
}

interface BallCollisionProps {
  width?: number;
  height?: number;
  ballCount?: number;
  ballSize?: number;
  gravity?: number;
  damping?: number;
  duration?: number;
  onComplete?: () => void;
}

const BallCollision = forwardRef<BallCollisionHandle, BallCollisionProps>(
  (
    {
      width = 300,
      height = 280,
      ballCount = 5,
      ballSize = 100,
      gravity = 0.5,
      damping = 0.8,
      duration = 5000,
      onComplete,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ballsRef = useRef<Ball[]>([]);
    const animationIdRef = useRef<number | null>(null);
    const ballImageRef = useRef<HTMLImageElement | null>(null);
    const isRunningRef = useRef(false);
    const startTimeRef = useRef<number>(0);
    const timeoutIdRef = useRef<number | null>(null);

    useEffect(() => {
      const img = new Image();
      img.src = '/images/gacha/ball-without-shadow.png';
      img.onload = () => {
        ballImageRef.current = img;
        initBallsStatic();
        render();
      };
    }, []);

    const initBalls = () => {
      if (!ballImageRef.current) return;

      const balls: Ball[] = [];
      const centerX = width / 2;
      const bottomY = height - ballSize / 2;
      
      const effectiveSpacing = ballSize * 0.8;
      
      for (let i = 0; i < ballCount; i++) {
        const offsetX = (Math.random() - 0.5) * (width * 0.6);
        
        const layerIndex = Math.floor(i / 3);
        const offsetY = layerIndex * effectiveSpacing * 0.5;
        const randomYOffset = (Math.random() - 0.5) * effectiveSpacing * 0.3;
        
        balls.push({
          x: centerX + offsetX,
          y: bottomY - offsetY + randomYOffset,
          vx: (Math.random() - 0.5) * 15,
          vy: -(Math.random() * 8 + 10),
          radius: ballSize / 2,
          image: ballImageRef.current,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
        });
      }
      ballsRef.current = balls;
    };

    const initBallsStatic = () => {
      if (!ballImageRef.current) return;

      const balls: Ball[] = [];
      const centerX = width / 2;
      const bottomY = height - ballSize / 2;
      
      const effectiveSpacing = ballSize * 0.8;
      
      for (let i = 0; i < ballCount; i++) {
        const offsetX = (Math.random() - 0.5) * (width * 0.6);
        
        const layerIndex = Math.floor(i / 3);
        const offsetY = layerIndex * effectiveSpacing * 0.5;
        
        const randomYOffset = (Math.random() - 0.5) * effectiveSpacing * 0.3;
        
        balls.push({
          x: centerX + offsetX,
          y: bottomY - offsetY + randomYOffset,
          vx: 0,
          vy: 0,
          radius: ballSize / 2,
          image: ballImageRef.current,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: 0,
        });
      }
      ballsRef.current = balls;
    };

    const checkCollision = (ball1: Ball, ball2: Ball) => {
      const dx = ball2.x - ball1.x;
      const dy = ball2.y - ball1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < (ball1.radius + ball2.radius) * 0.8;
    };

    const resolveCollision = (ball1: Ball, ball2: Ball) => {
      const dx = ball2.x - ball1.x;
      const dy = ball2.y - ball1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return;

      const nx = dx / distance;
      const ny = dy / distance;

      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      const targetDistance = (ball1.radius + ball2.radius) * 0.8;
      const overlap = targetDistance - distance;
      if (overlap > 0) {
        const separationX = (overlap * nx) / 2;
        const separationY = (overlap * ny) / 2;

        ball1.x -= separationX;
        ball1.y -= separationY;
        ball2.x += separationX;
        ball2.y += separationY;
      }

      const dvx = ball1.vx - ball2.vx;
      const dvy = ball1.vy - ball2.vy;

      const dvn = dvx * nx + dvy * ny;

      if (dvn > 0) return;

      const restitution = 0.72 * Math.pow(1 - progress, 1.0);
      const impulse = (1 + restitution) * dvn;

      ball1.vx -= impulse * nx;
      ball1.vy -= impulse * ny;
      ball2.vx += impulse * nx;
      ball2.vy += impulse * ny;

      const collisionImpact = Math.abs(impulse);
      ball1.rotationSpeed += (Math.random() - 0.5) * collisionImpact * 0.02;
      ball2.rotationSpeed += (Math.random() - 0.5) * collisionImpact * 0.02;
      
      ball1.rotationSpeed = Math.max(-0.25, Math.min(0.25, ball1.rotationSpeed));
      ball2.rotationSpeed = Math.max(-0.25, Math.min(0.25, ball2.rotationSpeed));
    };

    const updateBalls = () => {
      const balls = ballsRef.current;
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      
      const progress = Math.min(elapsed / duration, 1);
      
      const currentDamping = damping * (0.25 + (1 - progress) * 0.75);
      
      const progressCurve = Math.pow(progress, 1.5);
      const velocityDecay = 0.990 - progressCurve * 0.032;
      
      const lateDecay = progress > 0.6 ? Math.pow((progress - 0.6) / 0.4, 2) : 0;

      balls.forEach((ball) => {
        const currentGravity = gravity * (1 - progress * progress * 0.8);
        ball.vy += currentGravity;

        ball.vx *= velocityDecay * (1 - lateDecay * 0.3);
        ball.vy *= velocityDecay;

        ball.x += ball.vx;
        ball.y += ball.vy;

        const totalSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        const speedFactor = Math.min(totalSpeed / 15, 1.5);
        ball.rotation += ball.rotationSpeed * (1 + speedFactor * 1);
        
        ball.rotationSpeed *= (velocityDecay + 0.01);

        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx * currentDamping;
        } else if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx = -ball.vx * currentDamping;
        }

        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * currentDamping;
        } else if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy = -ball.vy * currentDamping;
          
          const frictionCurve = Math.pow(progress, 1.3);
          const groundFriction = 0.84 - frictionCurve * 0.48;
          ball.vx *= groundFriction;
          
          if (progress > 0.6) {
            const endProgress = (progress - 0.6) / 0.4;
            const decayFactor = 1 - endProgress * 0.7;
            
            ball.vy *= decayFactor;
            ball.vx *= Math.pow(decayFactor, 0.9);
          }
          
          if (progress > 0.8) {
            ball.vx *= 0.88;
            ball.vy *= 0.85;
          }
          
          if (progress > 0.9) {
            if (Math.abs(ball.vy) < 2) ball.vy *= 0.6;
            if (Math.abs(ball.vx) < 1.5) ball.vx *= 0.7;
          }
          
          if (progress > 0.96) {
            if (Math.abs(ball.vy) < 1) ball.vy = 0;
            if (Math.abs(ball.vx) < 0.6) ball.vx = 0;
          }
        }
      });

      const iterations = progress < 0.7 ? 3 : (progress < 0.9 ? 2 : 1);
      
      for (let iteration = 0; iteration < iterations; iteration++) {
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            if (checkCollision(balls[i], balls[j])) {
              resolveCollision(balls[i], balls[j]);
            }
          }
        }
      }
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      ballsRef.current.forEach((ball) => {
        if (ball.image.complete) {
          ctx.save();
          
          ctx.translate(ball.x, ball.y);
          
          ctx.rotate(ball.rotation);
          
          ctx.drawImage(
            ball.image,
            -ball.radius,
            -ball.radius,
            ball.radius * 2,
            ball.radius * 2
          );
          
          ctx.restore();
        }
      });
    };

    const animate = () => {
      if (!isRunningRef.current) return;

      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      
      if (elapsed < duration) {
        updateBalls();
        render();
        animationIdRef.current = requestAnimationFrame(animate);
      } else {
        ballsRef.current.forEach((ball) => {
          ball.vx = 0;
          ball.vy = 0;
        });
        render();
        isRunningRef.current = false;
      }
    };

    const start = () => {
      if (isRunningRef.current) return;

      clear();
      
      initBalls();
      isRunningRef.current = true;
      startTimeRef.current = Date.now();
      
      timeoutIdRef.current = window.setTimeout(() => {
        onComplete?.();
      }, duration);
      
      animate();
    };

    const stop = () => {
      isRunningRef.current = false;
      
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      ballsRef.current.forEach((ball) => {
        ball.vx = 0;
        ball.vy = 0;
      });
    };
    
    const clear = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, width, height);
        }
      }
      ballsRef.current = [];
    };

    useImperativeHandle(ref, () => ({
      start,
      stop,
    }));

    useEffect(() => {
      return () => {
        if (animationIdRef.current !== null) {
          cancelAnimationFrame(animationIdRef.current);
        }
        if (timeoutIdRef.current !== null) {
          clearTimeout(timeoutIdRef.current);
        }
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-[#733C1F]"
      />
    );
  }
);

BallCollision.displayName = 'BallCollision';

export default BallCollision;

