import React, { CSSProperties, useEffect, useState } from 'react';
import { MaskPlacement, getPositionStyle, getMaskBoundRect } from './getStyleRect';
import { useScrollIntoView } from '@/hooks/useScrollIntoView';

interface MaskProps {
  element: HTMLElement;
  container?: HTMLElement;
  renderMaskContent?: (wrapper: React.ReactNode) => React.ReactNode;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  placement?: MaskPlacement;
  contentWidth?: number;
  contentHeight?: number;
  reset?: boolean; 
}

export const Mask: React.FC<MaskProps> = (props) => {
  const {
    element,
    renderMaskContent,
    container,
    onAnimationStart,
    onAnimationEnd,
    placement = MaskPlacement.BottomRight,
    contentWidth = 200,
    contentHeight = 100,
    reset = false,
  } = props;

  const [style, setStyle] = useState<CSSProperties>({});
  const [maskId] = useState(() => `mask-${Math.random().toString(36).substr(2, 9)}`);
  
  const { scrollElementIntoView } = useScrollIntoView({
    checkInterval: 50,
    maxAttempts: 20
  });

  useEffect(() => {
    onAnimationStart?.();
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [element]);

  useEffect(() => {
    if (reset) {
      setStyle({});
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      return;
    }

    if (!element) {
      return;
    }

    let mounted = true;

    const updatePosition = async () => {
      await scrollElementIntoView(element, (element) => {
        if (mounted) {
          const style = getMaskBoundRect(element, container || document.documentElement);
          setStyle(style);
        }
      });
    };

    updatePosition();

    const handleResize = () => {
      if (mounted) {
        updatePosition();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
      setStyle({});
    };
  }, [element, container, reset, scrollElementIntoView]);

  const getContent = () => {
    if (!renderMaskContent) {
      return null;
    }
    return renderMaskContent(
      <div className='w-full h-full relative' />
    );
  };

  const { top, left, elementWidth, elementHeight, radius } = style as any;

  return (
    <div className='fixed left-0 top-0 z-[999] w-full h-full'>
      <svg
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {top !== undefined && left !== undefined && (
              <rect
                x={left - 5}
                y={top - 5}
                rx={radius}
                width={elementWidth + 10}
                height={elementHeight + 10}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask={`url(#${maskId})`}
        />
      </svg>
      {top !== undefined && left !== undefined && (
        <div
          className='absolute'
          style={getPositionStyle(placement, top, left, elementWidth, elementHeight, contentWidth, contentHeight)}
        >
          {getContent()}
        </div>
      )}
    </div>
  );
};