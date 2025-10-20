import clsx from "clsx";
import ReactDOM from "react-dom";
import { useEffect, useRef, useCallback, useMemo } from "react";

interface FlowerParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  shape: 'circle' | 'heart' | 'star' | 'diamond';
}

const Exploding = (props: any) => {
  const { className, trigger = false, maxParticles = 80, flowersPerBurst = 15, burstsAtOnce = 1 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<FlowerParticle[]>([]);
  const particleIdRef = useRef(0);
  const lastTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  
  // Object pool for particles to avoid garbage collection
  const particlePool = useRef<FlowerParticle[]>([]);
  const poolSize = 200; // Pre-allocate pool

  // Memoize colors and shapes arrays to avoid recreation
  const colors = useMemo(() => [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ], []);
  
  const shapes = useMemo(() => ['circle', 'heart', 'star', 'diamond'] as const, []);

  // Initialize object pool
  useEffect(() => {
    for (let i = 0; i < poolSize; i++) {
      particlePool.current.push({
        id: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        rotation: 0,
        rotationSpeed: 0,
        life: 0,
        maxLife: 1,
        size: 0,
        color: '',
        shape: 'circle'
      });
    }
  }, []);

  // Get particle from pool
  const getParticleFromPool = useCallback((): FlowerParticle | null => {
    return particlePool.current.pop() || null;
  }, []);

  // Return particle to pool
  const returnParticleToPool = useCallback((particle: FlowerParticle) => {
    if (particlePool.current.length < poolSize) {
      particlePool.current.push(particle);
    }
  }, []);

  // Create flower particle using object pool
  const createFlowerParticle = useCallback((x: number, y: number, isBurst = false): FlowerParticle => {
    const particle = getParticleFromPool();
    if (!particle) {
      // Fallback if pool is empty
      return {
        id: particleIdRef.current++,
        x,
        y,
        vx: 0,
        vy: 0,
        rotation: 0,
        rotationSpeed: 0,
        life: 1,
        maxLife: 1,
        size: 5,
        color: colors[0],
        shape: 'circle'
      };
    }

    const angle = (Math.random() - 0.5) * Math.PI * 0.6;
    const speed = isBurst ? 2 + Math.random() * 4 : 1 + Math.random() * 3;
    
    // Reuse particle object
    particle.id = particleIdRef.current++;
    particle.x = x;
    particle.y = y;
    particle.vx = Math.sin(angle) * speed + (Math.random() - 0.5) * 3;
    particle.vy = Math.cos(angle) * speed + 0.8;
    particle.rotation = Math.random() * 360;
    particle.rotationSpeed = (Math.random() - 0.5) * 6;
    particle.life = 1;
    particle.maxLife = 1;
    particle.size = 5 + Math.random() * 10;
    particle.color = colors[Math.floor(Math.random() * colors.length)];
    particle.shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    return particle;
  }, [colors, shapes, getParticleFromPool]);

  // Pre-calculate common values
  const PI_180 = Math.PI / 180;
  const PI_2 = Math.PI * 2;

  // Ultra-optimized shape drawing with minimal context changes
  const drawShape = useCallback((ctx: CanvasRenderingContext2D, particle: FlowerParticle) => {
    const { x, y, size, color, shape, rotation, life } = particle;
    const opacity = Math.max(0.8, life * 1.0);
    const halfSize = size * 0.5;
    
    // Pre-calculate rotation
    const cos = Math.cos(rotation * PI_180);
    const sin = Math.sin(rotation * PI_180);
    
    // Set styles once - simplified for performance
    const rgb = hexToRgb(color);
    if (rgb) {
      ctx.fillStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity})`;
    }
    
    // Remove expensive shadow effects for better performance
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.lineWidth = 0; // No stroke for better performance
    
    // Draw based on shape with minimal context operations
    switch (shape) {
      case 'heart':
        drawHeartOptimized(ctx, x, y, halfSize, cos, sin);
        break;
      case 'star':
        drawStarOptimized(ctx, x, y, halfSize, cos, sin);
        break;
      case 'diamond':
        drawDiamondOptimized(ctx, x, y, halfSize, cos, sin);
        break;
      default: // circle - fastest path
        ctx.beginPath();
        ctx.arc(x, y, halfSize, 0, PI_2);
        ctx.fill();
        break;
    }
  }, [PI_180, PI_2]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Optimized heart shape drawing
  const drawHeartOptimized = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, cos: number, sin: number) => {
    ctx.beginPath();
    const s3 = size * 0.3;
    const s5 = size * 0.5;
    const s7 = size * 0.7;
    
    // Rotate points manually to avoid save/restore
    const rotatePoint = (px: number, py: number) => {
      const dx = px - x;
      const dy = py - y;
      return {
        x: x + dx * cos - dy * sin,
        y: y + dx * sin + dy * cos
      };
    };
    
    const p1 = rotatePoint(x, y + s3);
    const p2 = rotatePoint(x, y);
    const p3 = rotatePoint(x - s5, y);
    const p4 = rotatePoint(x - s5, y + s3);
    const p5 = rotatePoint(x - s5, y + s7);
    const p6 = rotatePoint(x, y + s7);
    const p7 = rotatePoint(x, y + size);
    const p8 = rotatePoint(x + s5, y + s7);
    const p9 = rotatePoint(x + s5, y + s3);
    const p10 = rotatePoint(x + s5, y);
    
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    ctx.bezierCurveTo(p5.x, p5.y, p6.x, p6.y, p7.x, p7.y);
    ctx.bezierCurveTo(p8.x, p8.y, p9.x, p9.y, p10.x, p10.y);
    ctx.bezierCurveTo(p2.x, p2.y, p1.x, p1.y, p1.x, p1.y);
    ctx.fill();
  };

  // Optimized star shape drawing
  const drawStarOptimized = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, cos: number, sin: number) => {
    ctx.beginPath();
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size * 0.4;
    
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
  };

  // Optimized diamond shape drawing
  const drawDiamondOptimized = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, cos: number, sin: number) => {
    ctx.beginPath();
    const rotatePoint = (px: number, py: number) => {
      const dx = px - x;
      const dy = py - y;
      return {
        x: x + dx * cos - dy * sin,
        y: y + dx * sin + dy * cos
      };
    };
    
    const p1 = rotatePoint(x, y - size);
    const p2 = rotatePoint(x + size, y);
    const p3 = rotatePoint(x, y + size);
    const p4 = rotatePoint(x - size, y);
    
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.lineTo(p4.x, p4.y);
    ctx.closePath();
    ctx.fill();
  };

  // Ultra-optimized animation loop
  const animate = useCallback((currentTime: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // FPS calculation for debugging
    frameCountRef.current++;
    if (currentTime - lastTimeRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Clear canvas only if there are particles
    const particles = particlesRef.current;
    if (particles.length === 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, windowWidth, windowHeight);

    // Pre-calculate common values
    const gravity = 0.02;
    const lifeDecay = 0.003;
    const bounceDamping = 0.3;
    const driftStrength = 0.1;

    // Ultra-fast particle processing
    const aliveParticles: FlowerParticle[] = [];
    aliveParticles.length = 0; // Reset without reallocation

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      
      // Inline calculations for maximum speed
      let newX = particle.x + particle.vx;
      let newY = particle.y + particle.vy;
      let newVx = particle.vx + (Math.random() - 0.5) * driftStrength;
      let newVy = particle.vy + gravity;
      let newRotation = particle.rotation + particle.rotationSpeed;
      let newLife = particle.life - lifeDecay;

      // Boundary handling - inline
      if (newX <= 0 || newX >= windowWidth) {
        newVx *= -bounceDamping;
        newX = newX <= 0 ? 0 : windowWidth;
      }

      // Remove particle if it reaches bottom or life is exhausted
      if (newY >= windowHeight || newLife <= 0) {
        returnParticleToPool(particle);
        continue;
      }

      // Update particle in-place to avoid object creation
      particle.x = newX;
      particle.y = newY;
      particle.vx = newVx;
      particle.vy = newVy;
      particle.rotation = newRotation;
      particle.life = newLife;

      aliveParticles.push(particle);
      
      // Draw the particle
      drawShape(ctx, particle);
    }

    // Update particles array
    particlesRef.current = aliveParticles;

    // If particle count still exceeds limit, remove oldest particles
    if (particlesRef.current.length > maxParticles) {
      particlesRef.current = particlesRef.current.slice(particlesRef.current.length - maxParticles);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [drawShape, maxParticles]);

  // Flower burst effect
  useEffect(() => {
    if (trigger) {
      const createFlowerBurst = () => {
        if (particlesRef.current.length >= maxParticles) {
          return;
        }
        
        const windowWidth = window.innerWidth;
        const topY = 0;
        
        const availableSlots = maxParticles - particlesRef.current.length;
        const totalParticlesToCreate = Math.min(flowersPerBurst * burstsAtOnce, availableSlots);
        
        const newParticles: FlowerParticle[] = [];
        
        for (let burst = 0; burst < burstsAtOnce; burst++) {
          const centerX = Math.random() * windowWidth;
          const particlesInThisBurst = Math.min(flowersPerBurst, totalParticlesToCreate - newParticles.length);
          
          for (let i = 0; i < particlesInThisBurst; i++) {
            const offsetX = (Math.random() - 0.5) * 60;
            newParticles.push(createFlowerParticle(
              centerX + offsetX,
              topY,
              true
            ));
          }
        }
        
        particlesRef.current = [...particlesRef.current, ...newParticles];
      };

      createFlowerBurst();
      const interval = setInterval(createFlowerBurst, 800);
      
      return () => clearInterval(interval);
    }
  }, [trigger, maxParticles, flowersPerBurst, burstsAtOnce, createFlowerParticle]);

  // Start animation with performance optimizations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size and optimize context
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        // Enable hardware acceleration
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
    };

    resizeCanvas();
    
    // Throttle resize events
    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 16); // ~60fps
    };
    
    window.addEventListener('resize', throttledResize);

    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', throttledResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  if (!document) {
    return null;
  }

  return ReactDOM.createPortal((
    <div className={clsx("fixed inset-0 pointer-events-none z-50", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          willChange: 'transform', // Hint for GPU acceleration
          transform: 'translateZ(0)' // Force hardware acceleration
        }}
      />
      {/* Optional FPS counter for debugging - remove in production */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
            fontSize: '12px',
            background: 'rgba(0,0,0,0.5)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }}
        >
          FPS: {fpsRef.current} | Particles: {particlesRef.current.length}
        </div>
      )} */}
    </div>
  ), document.body);
};

export default Exploding;
