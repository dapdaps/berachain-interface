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
import { animate, useMotionValue } from 'framer-motion';
import { createRotateAnimation } from '@/sections/home-earth/utils';

// seconds per lap
const SPEED = 200;
const SIZE = 3000;

const HomeEarth = () => {
  const isMobile = useIsMobile();

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
  const navigationRotation = useMotionValue(0);
  const navigationEndRotationRef = useRef(0);
  const navigationStartRotationRef = useRef(0);
  const navigationDragStartedRef = useRef(false);
  const navigationDragEndedTimesRef = useRef(0);
  const navigationStartPointPositionRef = useRef({ x: 0, y: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<any>();

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
        size: SIZE,
    }}>
      <div className="w-full relative h-[calc(100dvh_-_68px)] flex flex-col items-center">
        <Follower />
        <Signpost />
        <HomeEarthTop />
        <AirdropModal />
        <div className="relative w-full overflow-hidden h-[calc(100%_-_229px)] flex justify-center">
          {/*#region Cloud*/}
          <CloudCircle />
          {/*#endregion*/}
          {/*#region Mountain*/}
          <MountainCircle />
          {/*#endregion*/}
          {/*#region Navigation*/}
          <Navigation />
          {/*#endregion*/}
          <img
            ref={bearRef}
            src="/images/background/bear.gif" 
            alt="" 
            className="w-[360px] h-[356px] absolute z-[4] top-[37.4dvh] pointer-events-none"
          />
        </div>
      </div>
    </HomeEarthContext.Provider>
  );
};

export default HomeEarth;
