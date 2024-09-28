import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Placement:
//            TopLeft         Top         TopRight
//    LeftTop ------------------------------------ RightTop
//            |                                  |
//       Left |              Trigger             | Right
//            |                                  |
// LeftBottom ------------------------------------ RightBottom
//            BottomLeft     Bottom    BottomRight
const Popover = (props: Props) => {
  const { children, content, placement = PopoverPlacement.BottomLeft, offset = 5 } = props;

  const triggerRef = useRef<any>();

  const [visible, setVisible] = useState(false);
  const [realVisible, setRealVisible] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  return (
    <>
      <div
        ref={triggerRef}
        className=""
        onClick={() => {
          setVisible(true);
        }}
      >
        {children}
      </div>
      {
        visible && createPortal(
          <Card
            x={x}
            y={y}
            onLoaded={(elTooltip) => {
              const trigger = triggerRef.current;
              const { width: triggerW, height: triggerH, x: triggerX, y: triggerY } = trigger.getBoundingClientRect();

              const { width: w, height: h } = elTooltip.getBoundingClientRect();

              const triggerMiddleWidth = triggerX + triggerW / 2;
              const triggerMiddleHeight = triggerY + triggerH / 2;
              const targetMiddleWidth = triggerX + w / 2;
              const targetMiddleHeight = triggerY + h / 2;

              let targetX = 0;
              let targetY = 0;
              if (placement === PopoverPlacement.BottomRight) {
                targetX = triggerX + triggerW - w;
                targetY = triggerY + triggerH + offset;
              }
              if (placement === PopoverPlacement.Bottom) {
                targetX = triggerX - (targetMiddleWidth - triggerMiddleWidth);
                targetY = triggerY + triggerH + offset;
              }
              if (placement === PopoverPlacement.BottomLeft) {
                targetX = triggerX;
                targetY = triggerY + triggerH + offset;
              }
              if (placement === PopoverPlacement.LeftBottom) {
                targetX = triggerX - w - offset;
                targetY = triggerY - (h - triggerH);
              }
              if (placement === PopoverPlacement.Left) {
                targetX = triggerX - w - offset;
                targetY = triggerY - (targetMiddleHeight - triggerMiddleHeight);
              }
              if (placement === PopoverPlacement.LeftTop) {
                targetX = triggerX - w - offset;
                targetY = triggerY;
              }
              if (placement === PopoverPlacement.TopLeft) {
                targetX = triggerX;
                targetY = triggerY - offset - h;
              }
              if (placement === PopoverPlacement.Top) {
                targetX = triggerX - (targetMiddleWidth - triggerMiddleWidth);
                targetY = triggerY - offset - h;
              }
              if (placement === PopoverPlacement.TopRight) {
                targetX = triggerX + triggerW - w;
                targetY = triggerY - offset - h;
              }
              if (placement === PopoverPlacement.RightTop) {
                targetX = triggerX + triggerW + offset;
                targetY = triggerY;
              }
              if (placement === PopoverPlacement.Right) {
                targetX = triggerX + triggerW + offset;
                targetY = triggerY - (targetMiddleHeight - triggerMiddleHeight);
              }
              if (placement === PopoverPlacement.RightBottom) {
                targetX = triggerX + triggerW + offset;
                targetY = triggerY - (h - triggerH);
              }

              // edge
              if (targetX < 0) targetX = 0;
              if (targetX > window.innerWidth - w) targetX = window.innerWidth - w;
              if (targetY < 0) targetY = 0;
              if (targetY > window.innerHeight - h) targetY = window.innerHeight - h;

              setX(targetX);
              setY(targetY);
              setRealVisible(true);
            }}
            visible={realVisible}
            onClose={() => {
              setRealVisible(false);
              setVisible(false);
            }}
          >
            {content}
          </Card>,
          document.body
        )
      }
    </>
  );
};

export default Popover;

export enum PopoverPlacement {
  Top,
  Right,
  Bottom,
  Left,
  TopLeft,
  TopRight,
  RightTop,
  RightBottom,
  BottomLeft,
  BottomRight,
  LeftTop,
  LeftBottom,
}

interface Props {
  children: any;
  content: any;
  placement?: PopoverPlacement;
  offset?: number;
}

const Card = (props: CardProps) => {
  const { onLoaded, x, y, visible, onClose, children } = props;

  const cardRef = useRef<any>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    onLoaded(cardRef.current);

    const handleClose = (e: any) => {
      if (cardRef.current.contains(e.target)) return;
      onClose();
    };
    document.addEventListener('click', handleClose);
    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed z-10 left-0 top-0"
        ref={cardRef}
        style={{
          left: x,
          top: y,
          visibility: visible ? 'visible' : 'hidden'
        }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { type: 'spring', stiffness: 200, damping: 15, duration: 1 }
        }}
        exit={{
          opacity: 0,
        }}
        initial={{
          opacity: 0,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface CardProps {
  x: number;
  y: number;
  visible: boolean;
  children: any;

  onLoaded(cardRef: any): void;
  onClose(): void;
}
