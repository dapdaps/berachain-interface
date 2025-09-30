import clsx from "clsx";
import ReactDOM from "react-dom";
import { useEffect, useState, useRef } from "react";

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
  const [particles, setParticles] = useState<FlowerParticle[]>([]);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  // Create flower particle
  const createFlowerParticle = (x: number, y: number, isBurst = false): FlowerParticle => {
    const angle = (Math.random() - 0.5) * Math.PI * 0.6; // Increase angle range for more scattered flowers
    const speed = isBurst ? 2 + Math.random() * 4 : 1 + Math.random() * 3; // Faster speed during burst
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
    ];
    const shapes: ('circle' | 'heart' | 'star' | 'diamond')[] = ['circle', 'heart', 'star', 'diamond'];
    
    return {
      id: particleIdRef.current++,
      x,
      y,
      vx: Math.sin(angle) * speed + (Math.random() - 0.5) * 3, // Increase horizontal drift
      vy: Math.cos(angle) * speed + 0.8, // Increase downward movement speed
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 6, // Increase rotation speed
      life: 1,
      maxLife: 1,
      size: 5 + Math.random() * 10, // Increase flower size
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    };
  };

  // Animation loop
  const animate = () => {
    setParticles(prevParticles => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const updatedParticles = prevParticles
        .map(particle => {
          // Update position
          let newX = particle.x + particle.vx;
          let newY = particle.y + particle.vy;
          let newVx = particle.vx;
          let newVy = particle.vy;
          let newRotation = particle.rotation + particle.rotationSpeed;
          let newLife = particle.life - 0.003; // Slower life decay for longer particle persistence

          // Subtle horizontal drift effect
          newVx += (Math.random() - 0.5) * 0.1;
          newVy += 0.02; // Light gravity

          // Boundary handling - bounce off left/right edges
          if (newX <= 0 || newX >= windowWidth) {
            newVx *= -0.3; // Bounce but lose energy
            newX = Math.max(0, Math.min(windowWidth, newX));
          }

          // Remove particle if it reaches bottom or life is exhausted
          if (newY >= windowHeight || newLife <= 0) {
            return null;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: newRotation,
            life: newLife
          };
        })
        .filter(particle => particle !== null) as FlowerParticle[];

      // If particle count still exceeds limit, remove oldest particles
      if (updatedParticles.length > maxParticles) {
        return updatedParticles.slice(updatedParticles.length - maxParticles);
      }

      return updatedParticles;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  // Flower burst effect
  useEffect(() => {
    if (trigger) {
      const createFlowerBurst = () => {
        setParticles(prevParticles => {
          // Don't create new particles if limit is reached
          if (prevParticles.length >= maxParticles) {
            return prevParticles;
          }
          
          const windowWidth = window.innerWidth;
          const topY = 0;
          
          // Calculate how many new particles can be created
          const availableSlots = maxParticles - prevParticles.length;
          const totalParticlesToCreate = Math.min(flowersPerBurst * burstsAtOnce, availableSlots);
          
          const newParticles: FlowerParticle[] = [];
          
          // Create multiple flower bursts
          for (let burst = 0; burst < burstsAtOnce; burst++) {
            // Each burst starts from a different center point
            const centerX = Math.random() * windowWidth;
            const particlesInThisBurst = Math.min(flowersPerBurst, totalParticlesToCreate - newParticles.length);
            
            for (let i = 0; i < particlesInThisBurst; i++) {
              // Create flowers within a small range around the center point
              const offsetX = (Math.random() - 0.5) * 60; // Within 60px range
              newParticles.push(createFlowerParticle(
                centerX + offsetX,
                topY,
                true // Use burst mode
              ));
            }
          }
          
          return [...prevParticles, ...newParticles];
        });
      };

      // Create flowers immediately
      createFlowerBurst();
      
      // Set timer to create flower bursts every 800ms (longer interval for more concentrated effect)
      const interval = setInterval(createFlowerBurst, 800);
      
      return () => clearInterval(interval);
    }
  }, [trigger, maxParticles, flowersPerBurst, burstsAtOnce]);

  // Start animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Render different flower shapes
  const renderFlowerShape = (particle: FlowerParticle) => {
    const baseStyle = {
      left: particle.x,
      top: particle.y,
      width: particle.size,
      height: particle.size,
      backgroundColor: particle.color,
      opacity: Math.max(0.8, particle.life * 1.0), // Increase minimum opacity and decay rate
      transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
      boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}CC`, // Enhance glow effect
      filter: 'saturate(1.5) brightness(1.3) contrast(1.2)', // Increase saturation, brightness and contrast
      border: `1px solid ${particle.color}AA`, // Add border to enhance outline
    };

    switch (particle.shape) {
      case 'heart':
        return (
          <div
            key={particle.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 85%, 15% 45%, 15% 25%, 50% 15%, 85% 25%, 85% 45%)',
            }}
          />
        );
      case 'star':
        return (
          <div
            key={particle.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          />
        );
      case 'diamond':
        return (
          <div
            key={particle.id}
            className="absolute"
            style={{
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          />
        );
      default: // circle
        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={baseStyle}
          />
        );
    }
  };

  if (!document) {
    return null;
  }

  return ReactDOM.createPortal((
    <div className={clsx("fixed inset-0 pointer-events-none z-50", className)}>
      {particles.map(particle => renderFlowerShape(particle))}
    </div>
  ), document.body);
};

export default Exploding;
