export function useCoinExplosion(props?: any) {
  const { size = 100 } = props ?? {};


  const createCoin = (x: number, y: number, icon: string) => {
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

  const animateCoin = (coin: HTMLDivElement, startX: number, startY: number) => {
    const horizontalDistance = (Math.random() - 0.5) * 400;
    const maxHeight = -(Math.random() * 400 + 300);

    // Movement and rotation animation keyframes
    const moveKeyframes = [
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
      // Accelerated descent
      {
        transform: `translate(${horizontalDistance}px, ${Math.abs(maxHeight * 0.5)}px) rotate(${Math.random() * 1080}deg)`,
        offset: 1
      }
    ];

    // Opacity animation keyframes
    const opacityKeyframes = [
      { opacity: 0, offset: 0 },     // Initially invisible
      { opacity: 1, offset: 0.1 },  // Brief invisibility period
      { opacity: 1, offset: 0.2 },  // Quick fade in
      { opacity: 1, offset: 0.55 },  // Quick fade in
      { opacity: 0, offset: 0.8 },   // Maintain visibility
      { opacity: 0, offset: 1 }      // Fade out
    ];

    // Create animations with adjusted duration
    const moveAnimation = coin.animate(moveKeyframes, {
      duration: 4000,
      easing: 'cubic-bezier(0.2, 1, 0.3, 1)', // Adjusted easing for smoother motion
      fill: 'forwards'
    });

    const opacityAnimation = coin.animate(opacityKeyframes, {
      duration: 3000, // Match movement animation duration
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

  const createCoinsExplosion = (centerX: number, centerY: number, icon: string) => {
    const numberOfCoins = 15;
    const delayBetweenCoins = 100; // Delay between each coin's animation

    // Create multiple waves of coins with different delays and parameters
    const createWave = (delay: number, count: number) => {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const coin = createCoin(centerX, centerY, icon);
          animateCoin(coin, centerX, centerY);
        }, i * delayBetweenCoins + delay);
      }
    };

    // Create waves with adjusted intervals
    createWave(0, numberOfCoins);      // First wave
    createWave(120, numberOfCoins);    // Second wave with delay
    createWave(240, numberOfCoins);    // Third wave with delay
  };

  return {
    createCoinsExplosion,
  };
}
