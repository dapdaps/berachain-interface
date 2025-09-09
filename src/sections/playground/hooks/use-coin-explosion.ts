export function useCoinExplosion() {

  // Get target landing position
  const getTargetPosition = (targetConfig?: { ref?: React.RefObject<HTMLElement>; offsetX?: number; offsetY?: number; customPosition?: { x: number; y: number } }) => {
    // If custom position is specified, use it directly
    if (targetConfig?.customPosition) {
      return {
        x: targetConfig.customPosition.x,
        y: targetConfig.customPosition.y
      };
    }
    
    if (targetConfig?.ref?.current) {
      const rect = targetConfig.ref.current.getBoundingClientRect();
      const offsetX = targetConfig.offsetX ?? 0;
      const offsetY = targetConfig.offsetY ?? 0;
      return {
        x: rect.left + offsetX, // Top-left corner X with offset
        y: rect.top + offsetY   // Top-left corner Y with offset
      };
    }
    // If no targetRef is specified, default to ground (bottom of screen)
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight
    };
  };

  const createCoin = (x: number, y: number, icon: string, size: number) => {
    const coin = document.createElement('div');
    // Set basic styles for coin element
    coin.style.position = 'fixed';
    coin.style.left = `${x}px`;
    coin.style.top = `${y}px`;
    coin.style.width = `${size}px`;
    coin.style.height = `${size}px`;
    coin.style.backgroundImage = `url('${icon}')`;
    coin.style.backgroundSize = 'contain';
    coin.style.backgroundRepeat = 'no-repeat';
    coin.style.pointerEvents = 'none';
    coin.style.zIndex = '9999';
    coin.style.transformStyle = 'preserve-3d';
    coin.style.backfaceVisibility = 'visible';
    coin.style.opacity = '0';

    document.body.appendChild(coin);
    return coin;
  };

  const animateCoin = (coin: HTMLDivElement, startX: number, startY: number, targetConfig?: { ref?: React.RefObject<HTMLElement>; offsetX?: number; offsetY?: number; customPosition?: { x: number; y: number } }) => {
    const targetPos = getTargetPosition(targetConfig);
    const hasTarget = !!targetConfig?.ref?.current;

    let moveKeyframes;

    if (hasTarget) {
      // When targetRef is specified: coins go directly to target without ascent
      const horizontalDistance = (Math.random() - 0.5) * 200; // Moderate horizontal spread
      
      moveKeyframes = [
        // Initial position
        {
          transform: 'translate(0, 50px) rotate(0deg) scale(1)',
          offset: 0
        },
        // Direct path to target
        {
          transform: `translate(${targetPos.x - startX + horizontalDistance * 0.3}px, ${targetPos.y - startY + 30}px) rotate(${Math.random() * 360}deg) scale(0.8)`,
          offset: 0.5
        },
        // Final position at target
        {
          transform: `translate(${targetPos.x - startX}px, ${targetPos.y - startY}px) rotate(${Math.random() * 720}deg) scale(0.3)`,
          offset: 1
        }
      ];
    } else if (targetConfig?.customPosition) {
      // When customPosition is specified: coins go directly to position without descent
      const horizontalDistance = (Math.random() - 0.5) * 400; // Larger horizontal spread
      const maxHeight = -(Math.random() * 200 + 150); // Lower height for direct path
      
      moveKeyframes = [
        // Initial position
        {
          transform: 'translate(0, 50px) rotate(0deg)',
          offset: 0
        },
        // First ascent phase
        {
          transform: `translate(${horizontalDistance * 0.3}px, ${maxHeight * 0.4}px) rotate(${Math.random() * 180}deg)`,
          offset: 0.3
        },
        // Peak point
        {
          transform: `translate(${horizontalDistance * 0.6}px, ${maxHeight}px) rotate(${Math.random() * 540}deg)`,
          offset: 0.6
        },
        // Direct path to final position
        {
          transform: `translate(${targetPos.x - startX + horizontalDistance}px, ${targetPos.y - startY}px) rotate(${Math.random() * 1080}deg)`,
          offset: 1
        }
      ];
    } else {
      // When no targetRef: original behavior - spread out and fall to ground
      const horizontalDistance = (Math.random() - 0.5) * 400;
      const maxHeight = -(Math.random() * 400 + 300);

      moveKeyframes = [
        // Initial position
        {
          transform: 'translate(0, 50px) rotate(0deg)',
          offset: 0
        },
        // First rapid ascent phase
        {
          transform: `translate(${horizontalDistance * 0.2}px, ${maxHeight * 0.3}px) rotate(${Math.random() * 180}deg)`,
          offset: 0.15
        },
        // Second rapid ascent phase
        {
          transform: `translate(${horizontalDistance * 0.4}px, ${maxHeight * 0.7}px) rotate(${Math.random() * 360}deg)`,
          offset: 0.3
        },
        // Peak point
        {
          transform: `translate(${horizontalDistance * 0.6}px, ${maxHeight}px) rotate(${Math.random() * 540}deg)`,
          offset: 0.4
        },
        // Start slow descent
        {
          transform: `translate(${horizontalDistance * 0.8}px, ${maxHeight * 0.6}px) rotate(${Math.random() * 720}deg)`,
          offset: 0.7
        },
        // Accelerated descent - fall to ground
        {
          transform: `translate(${horizontalDistance}px, ${window.innerHeight - startY}px) rotate(${Math.random() * 1080}deg)`,
          offset: 1
        }
      ];
    }

    // Opacity animation keyframes
    const opacityKeyframes = hasTarget ? [
      { opacity: 0, offset: 0 },     // Initially invisible
      { opacity: 1, offset: 0.1 },  // Quick fade in
      { opacity: 1, offset: 0.8 },  // Keep visible until almost at target
      { opacity: 0, offset: 1 }     // Fade out only after reaching target
    ] : targetConfig?.customPosition ? [
      { opacity: 0, offset: 0 },     // Initially invisible
      { opacity: 1, offset: 0.1 },  // Quick fade in
      { opacity: 1, offset: 0.5 },  // Keep visible until halfway
      { opacity: 0, offset: 0.65 }  // Fade out very quickly
    ] : [
      { opacity: 0, offset: 0 },     // Initially invisible
      { opacity: 1, offset: 0.1 },  // Brief invisibility period
      { opacity: 1, offset: 0.2 },  // Quick fade in
      { opacity: 1, offset: 0.55 },  // Quick fade in
      { opacity: 0, offset: 0.8 },   // Maintain visibility
      { opacity: 0, offset: 1 }      // Fade out
    ];

    // Create animations with adjusted duration
    const moveAnimation = coin.animate(moveKeyframes, {
      duration: hasTarget ? 1500 : targetConfig?.customPosition ? 3000 : 4000, // Faster for targetRef
      easing: 'cubic-bezier(0.2, 1, 0.3, 1)', // Adjusted easing for smoother motion
      fill: 'forwards'
    });

    const opacityAnimation = coin.animate(opacityKeyframes, {
      duration: hasTarget ? 1200 : targetConfig?.customPosition ? 2500 : 3000, // Faster for targetRef
      easing: 'linear',
      fill: 'forwards'
    });

    // Cleanup function to remove element when animations complete
    const removeElement = () => {
      if (moveAnimation.playState === 'finished' && opacityAnimation.playState === 'finished') {
        coin.remove();
      }
    };

    moveAnimation.onfinish = removeElement;
    opacityAnimation.onfinish = removeElement;
  };

  const createCoinsExplosion = (centerX: number, centerY: number, icon: string, targetConfig?: { ref?: React.RefObject<HTMLElement>; offsetX?: number; offsetY?: number; customPosition?: { x: number; y: number }; coinCount?: number; size?: number; delayBetweenCoins?: number }) => {
    const numberOfCoins = targetConfig?.coinCount ?? 15;
    const coinSize = targetConfig?.size ?? 100;
    const delayBetweenCoins = targetConfig?.delayBetweenCoins ?? 100; // Delay between each coin's animation

    // Store timeout IDs for cleanup
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    // Create multiple waves of coins with different delays and parameters
    const createWave = (delay: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const timeoutId = setTimeout(() => {
          const coin = createCoin(centerX, centerY, icon, coinSize);
          animateCoin(coin, centerX, centerY, targetConfig);
        }, i * delayBetweenCoins + delay);
        timeoutIds.push(timeoutId);
      }
    };

    // Create waves with adjusted intervals
    createWave(0, numberOfCoins);      // First wave
    createWave(120, numberOfCoins);    // Second wave with delay
    createWave(240, numberOfCoins);    // Third wave with delay

    // Return cleanup function
    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      timeoutIds.length = 0;
    };
  };

  return {
    createCoinsExplosion,
  };
}
