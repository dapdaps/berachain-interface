'use client';

import HomeEarthTop from '@/sections/home-earth/components/top';
import CloudCircle from '@/sections/home-earth/components/cloud-circle';
import MountainCircle from '@/sections/home-earth/components/mountain-circle';
import Navigation from '@/sections/home-earth/components/navigation';
import Follower from '@/sections/home-earth/components/follower';
import Signpost from '@/sections/home-earth/components/signpost';
import useIsMobile from '@/hooks/use-isMobile';
import MobileHome from '@/sections/home/mobile';
import AirdropModal from '@/components/airdrop/modal';
import { useEffect, useRef, useState } from 'react';
import { HomeEarthContext } from './context';
import { useMotionValue } from 'framer-motion';
import { createRotateAnimation } from '@/sections/home-earth/utils';
import { useActivityStore } from '@/stores/useActivityStore';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import { useRainyDay } from '@/hooks/use-rainy-day';
import BerachainFixes from '@/sections/home-earth/components/berachain-fixes';
import BeraPrice from '@/sections/home-earth/components/bera-price';

// seconds per lap
const SPEED = 200;
const SIZE = 3500;

const BG_SIZE_MAP = {
  default: SIZE,
  lgbt: SIZE,
}

const HomeEarth = () => {
  const isMobile = useIsMobile();
  const { isRainyDay, beraPrice } = useRainyDay();

  const bearRef = useRef<any>();

  const cloudRef = useRef<any>();
  const cloudControls = useRef<any>();
  const cloudRotation = useMotionValue(0);
  const cloudEndRotationRef = useRef(0);
  const cloudStartRotationRef = useRef(0);

  const mountainRef = useRef<any>();
  const mountainControls = useRef<any>();
  const mountainRotation = useMotionValue(0);
  const mountainEndRotationRef = useRef(0);
  const mountainStartRotationRef = useRef(0);

  const navigationRef = useRef<any>();
  const navigationControls = useRef<any>();
  const navigationRotation = useMotionValue(-50);
  const navigationEndRotationRef = useRef(-50);
  const navigationStartRotationRef = useRef(0);
  const navigationDragStartedRef = useRef(false);
  const navigationDragEndedTimesRef = useRef(0);
  const navigationStartPointPositionRef = useRef({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<any>();

  const { toggleTheme, isDefaultTheme, activeTheme } = useActivityStore();

  useEffect(() => {
    if (hoverIndex) {
      navigationControls.current?.pause?.();
      mountainControls.current?.pause?.();

      if (navigationRef.current) {
        navigationRef.current.style.animationPlayState = "paused";
      }
      if (mountainRef.current) {
        mountainRef.current.style.animationPlayState = "paused";
      }
    } else {
      navigationControls.current?.play?.();
      mountainControls.current?.play?.();

      if (navigationRef.current) {
        navigationRef.current.style.animationPlayState = "running";
      }
      if (mountainRef.current) {
        mountainRef.current.style.animationPlayState = "running";
      }
    }
  }, [hoverIndex]);

  useEffect(() => {
    const handleMouseUp = () => {
      if (navigationDragStartedRef.current) {
        setIsDragging(false);
        navigationDragStartedRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && navigationDragStartedRef.current) {
        setIsDragging(false);
        navigationDragStartedRef.current = false;
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isMobile) {
    return (
      <MobileHome />
    );
  }

  return (
    <HomeEarthContext.Provider
      value={{
        isRainyDay,
        beraPrice,
        cloudRef,
        cloudRotation,
        cloudControls,
        cloudStartRotationRef,
        cloudEndRotationRef,
        cloudRotateAnimation: () => {
          createRotateAnimation({
            controls: cloudControls,
            rotation: cloudRotation,
            endRotationRef: cloudEndRotationRef,
            speed: SPEED + 60,
          });
        },
        mountainRef,
        mountainRotation,
        mountainControls,
        mountainStartRotationRef,
        mountainEndRotationRef,
        mountainRotateAnimation: () => {
          createRotateAnimation({
            controls: mountainControls,
            rotation: mountainRotation,
            endRotationRef: mountainEndRotationRef,
            speed: SPEED + 30,
          });
        },
        navigationRef,
        navigationControls,
        navigationRotation,
        navigationStartRotationRef,
        navigationEndRotationRef,
        navigationDragStartedRef,
        navigationDragEndedTimesRef,
        navigationStartPointPositionRef,
        navigationRotateAnimation: () => {
          createRotateAnimation({
            controls: navigationControls,
            rotation: navigationRotation,
            endRotationRef: navigationEndRotationRef,
            speed: SPEED,
          });
        },
        bearRef,
        isDragging,
        setIsDragging,
        hoverIndex,
        setHoverIndex,
        speed: SPEED,
        size: BG_SIZE_MAP[activeTheme] || SIZE,
    }}>
      <div className="w-full relative h-[calc(100dvh_-_68px)] flex flex-col items-center">
        {/*<BerachainFixes />*/}
        <BeraPrice />
        <Follower />
        <Signpost />
        <HomeEarthTop />
        <AirdropModal />
        <div className="relative w-full overflow-hidden h-[calc(100%_-_229px)] flex justify-center">
          {/*#region Cloud*/}
          <CloudCircle />
          {/*#endregion*/}
          {
            isDefaultTheme() && (<>
              {/*#region Mountain*/}
              <MountainCircle />
              {/*#endregion*/}
            </>)
          }
          {/*#region Navigation*/}
          <Navigation />
          {/*#endregion*/}

          <Popover
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.Top}
            offset={0}
            content={<img src={isDefaultTheme() ? '/images/home-earth/signpost-baddies.svg':'/images/home-earth/signpost-mcbera.svg'} className={isDefaultTheme() ? 'w-[127px] h-[57px]' : 'w-[168px] h-[57px]'} />}
            triggerContainerClassName={clsx('absolute z-[4] cursor-pointer bottom-0 transition-transform hover:scale-110', isDefaultTheme() ? 'right-[150px]' : 'right-[130px]')}
          >
            <div className='w-full h-full relative'>
              <img
                onClick={()=> toggleTheme()}
                src={isDefaultTheme() ? "/images/theme-baddies.png" : "/images/theme-default.png"}
                className={clsx('relative z-[4]', isDefaultTheme() ? 'w-[103px] h-[95px]' : 'w-[136px] h-[108px]')}
                alt={isDefaultTheme() ? "Switch to LGBT Theme" : "Switch to Default Theme"}
              />
              {
                !isDefaultTheme() && <img src="/images/home-earth/likes/heart.gif" className='absolute top-[-40px] left-[-40px] z-0' alt="" />
              }
            </div>
          </Popover>
          {
            isDefaultTheme() ? (
              <img
                ref={bearRef}
                src="/images/background/bear.gif"
                alt=""
                className="w-[360px] h-[356px] absolute z-[4] top-[37.4dvh] pointer-events-none"
              />
            ) : (
              <div className='absolute z-[4] top-[32.4dvh] pointer-events-none' ref={bearRef}>
              <div className='w-[289px] h-[289px] relative'>
                <motion.img
                  src="/images/home-earth/lgbt-role.png"
                  className='w-full h-full relative z-10'
                  alt=""
                  animate={{
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <img src="/images/home-earth/role-wave.svg" className='absolute bottom-[15px] left-[18px] z-0' alt="" />
              </div>
            </div>
            )
          }
        </div>
      </div>
    </HomeEarthContext.Provider>
  );
};

export default HomeEarth;
