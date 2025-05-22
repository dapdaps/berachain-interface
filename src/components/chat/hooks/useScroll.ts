import { useEffect, useRef } from 'react';

export function useScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (event: any) => {
      const container = containerRef.current;
      if (!container) return;

      const isScrollingUp = event.deltaY < 0;
      const isAtTop = container.scrollTop <= 0;

      if (isScrollingUp && isAtTop) {
        event.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return {
    containerRef,
  };
}
