'use client';

import { useRef, forwardRef, useImperativeHandle, useState } from "react";
import { motion } from "framer-motion";
import BallCollision, { BallCollisionHandle } from "./ball-collision";

export interface BearBoxHandle {
  start: () => void;
  stop: () => void;
}

interface BearBoxProps {
  onComplete?: () => void;
}

const BearBox = forwardRef<BearBoxHandle, BearBoxProps>(({ onComplete }, ref) => {
  const collisionRef = useRef<BallCollisionHandle>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [showBall, setShowBall] = useState(true);
  const [switchRotation, setSwitchRotation] = useState(0);

  useImperativeHandle(ref, () => ({
    start: () => {
      setShowBall(false);
      setSwitchRotation(180);
      collisionRef.current?.start();
    },
    stop: () => {
      collisionRef.current?.stop();
    },
  }));

  return (
    <div className="w-[50%] h-[574px]">
      <div className="w-full h-full relative scale-[0.8]">
        <div className="absolute right-[142px] top-[40px] z-[5]">
          <BallCollision ref={collisionRef} onComplete={() => {
            setShowBall(true);
            setShouldAnimate(true);
            setSwitchRotation(0);
            onComplete?.();
          }}  />
        </div>
        <img src="/images/gacha/bear-header.png" alt="bear header" className="w-[452px] right-[72px] h-[371px] absolute z-10" />
        <img src="/images/gacha/bear-body.png" alt="bear body" className="w-[533px] right-[36px] top-[270px] h-[402px] absolute z-[2]" />
        {showBall && (
          <motion.img 
            src="/images/gacha/ball.png" 
            alt="bear footer" 
            className="w-[120px] right-[272px] bottom-[-2px] absolute z-[11]"
            animate={shouldAnimate ? {
              scale: [0.5, 1],
              y: [-50, 0],
            } : {}}
            initial={{
              scale: shouldAnimate ? 0.5 : 1,
              y: 0,
            }}
            transition={{
              scale: {
                duration: 0.6,
                ease: "easeOut"
              },
              y: {
                duration: 0.6,
                ease: "easeOut"
              }
            }}
            onAnimationComplete={() => {
              setShouldAnimate(false);
            }}
          />
        )}

        <motion.img 
          src="/images/gacha/switch.png" 
          alt="switch" 
          className="w-[97px] right-[152px] bottom-[85px] absolute z-[11]"
          animate={{ rotate: switchRotation }}
          transition={{ 
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
});

BearBox.displayName = 'BearBox';

export default BearBox;