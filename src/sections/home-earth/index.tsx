"use client";

import Airship from "@/components/bear-background/components/airship";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import useIsMobile from "@/hooks/use-isMobile";
import { useRainyDay } from "@/hooks/use-rainy-day";
import BeraPrice from "@/sections/home-earth/components/bera-price";
import CloudCircle from "@/sections/home-earth/components/cloud-circle";
import Follower from "@/sections/home-earth/components/follower";
import MountainCircle from "@/sections/home-earth/components/mountain-circle";
import Navigation from "@/sections/home-earth/components/navigation";
import Signpost from "@/sections/home-earth/components/signpost";
import HomeEarthTop from "@/sections/home-earth/components/top";
import { createRotateAnimation } from "@/sections/home-earth/utils";
import MobileHome from "@/sections/home/mobile";
import { useActivityStore } from "@/stores/useActivityStore";
import clsx from "clsx";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from "react";
import { HomeEarthContext } from "./context";
import McBeraProvider from '@/sections/home-earth/mc-bera/context';
import McBeraEntry from '@/sections/home-earth/mc-bera/entry';
import dynamic from 'next/dynamic';
import McBeraView from '@/sections/home-earth/mc-bera';
import Kirov from "./components/kirov";
import HomeEarthBear from "./components/bear";

const McBera = dynamic(() => import('@/sections/home-earth/mc-bera'), { ssr: false });
const MenuV2 = dynamic(() => import('./components/menu/v2'), { ssr: false });

// seconds per lap
const SPEED = 200;
const SIZE = 3500;

const BG_SIZE_MAP = {
  default: SIZE,
  lgbt: SIZE
};

const HomeEarth = (props: any) => {
  const { containerRef } = props;

  const isMobile = useIsMobile();
  const { isRainyDay, beraPrice } = useRainyDay();
  const { scrollY } = useScroll();

  const [earthY, setEarthY] = useState(0);
  // useMotionValueEvent(scrollY, "change", (latest) => {
  //   // @ts-ignore
  //   const diff = latest - scrollY?.getPrevious();
  //   // down
  //   if (diff > 0) {
  //     setEarthY(-Math.min(Math.max(latest, 0), 230));
  //     return;
  //   }
  //   setEarthY(0);
  // });

  const bearRef = useRef<any>();

  const cloudRef = useRef<any>();
  const cloudControls = useRef<any>();
  const cloudRotation = useMotionValue(0);
  const cloudEndRotationRef = useRef(0);
  const cloudStartRotationRef = useRef(0);

  const mountainRef = useRef<any>();
  const mountainControls = useRef<any>();
  const mountainRotation = useMotionValue(-20);
  const mountainEndRotationRef = useRef(-20);
  const mountainStartRotationRef = useRef(0);

  const navigationRef = useRef<any>();
  const navigationControls = useRef<any>();
  const navigationRotation = useMotionValue(-10);
  const navigationEndRotationRef = useRef(-10);
  const navigationStartRotationRef = useRef(0);
  const navigationDragStartedRef = useRef(false);
  const navigationDragEndedTimesRef = useRef(0);
  const navigationStartPointPositionRef = useRef({ x: 0, y: 0 });

  const contentRef = useRef<any>();
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

    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (isMobile) {
    return <MobileHome />;
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
            speed: SPEED + 60
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
            speed: SPEED + 30
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
            speed: SPEED
          });
        },
        bearRef,
        isDragging,
        setIsDragging,
        hoverIndex,
        setHoverIndex,
        speed: SPEED,
        size: BG_SIZE_MAP[activeTheme] || SIZE
      }}
    >
      <McBeraProvider>
        <div className="w-full" ref={containerRef}>
          <div
            ref={contentRef}
            className="w-full sticky z-[1] top-0 h-[100dvh] pt-[68px] flex flex-col items-center overflow-x-hidden overflow-y-auto"
          >
            {/*<BerachainFixes />*/}
            <HomeEarthTop isLogo={false} />
            <div className="w-full min-h-[153px] pt-[70px]">
              <MenuV2 />
            </div>
            {/* <Airship /> */}
            <motion.div
              className="relative w-full overflow-hidden flex-1 h-[0] min-h-[535px] flex justify-center shrink-0"
              animate={{
                y: earthY,
              }}
              transition={{
                ease: "linear",
                duration: 0.6,
              }}
            >
              {/*#region Cloud*/}
              <CloudCircle />
              {/*#endregion*/}
              {isDefaultTheme() && (
                <>
                  {/*#region Mountain*/}
                  <MountainCircle />
                  {/*#endregion*/}
                </>
              )}
              {/*#region Navigation*/}
              <Navigation />
              {/*#endregion*/}

              {/*#region theme toggle button*/}
              <Popover
                trigger={PopoverTrigger.Hover}
                placement={PopoverPlacement.Top}
                offset={0}
                content={
                  <img
                    src={
                      isDefaultTheme()
                        ? "/images/home-earth/signpost-baddies.svg"
                        : "/images/home-earth/signpost-mcbera.svg"
                    }
                    className={
                      isDefaultTheme() ? "w-[127px] h-[57px]" : "w-[168px] h-[57px]"
                    }
                  />
                }
                triggerContainerClassName={clsx(
                  "absolute bottom-[0px] z-[4] cursor-pointer bottom-0 transition-transform hover:scale-110 transition-all duration-150 origin-bottom",
                  isDefaultTheme() ? "right-[160px]" : "right-[130px]"
                )}
              >
                <div className="w-full h-full relative">
                  <img
                    data-bp={isDefaultTheme() ? "1010-021" : "1010-022"}
                    onClick={() => toggleTheme()}
                    src={
                      isDefaultTheme()
                        ? "/images/theme-baddies.png"
                        : "/images/theme-default.png"
                    }
                    className={clsx(
                      "relative z-[4]",
                      isDefaultTheme()
                        ? "w-[103px] h-[95px]"
                        : "w-[136px] h-[108px]"
                    )}
                    alt={
                      isDefaultTheme()
                        ? "Switch to LGBT Theme"
                        : "Switch to Default Theme"
                    }
                  />
                  {!isDefaultTheme() && (
                    <img
                      src="/images/home-earth/likes/heart.gif"
                      className="absolute top-[-40px] left-[-40px] z-0"
                      alt=""
                    />
                  )}
                </div>
              </Popover>
              {/*#endregion*/}

              <BeraPrice />
              <Follower />
              <Signpost />

              {/*#region biking bear*/}
              {isDefaultTheme() ? (
                <HomeEarthBear bearRef={bearRef} />
              ) : (
                <div
                  className="absolute z-[4] top-[32.4dvh] pointer-events-none"
                  ref={bearRef}
                >
                  <div className="w-[289px] h-[289px] relative">
                    <motion.img
                      src="/images/home-earth/lgbt-role.png"
                      className="w-full h-full relative z-10"
                      alt=""
                      animate={{
                        y: [0, -10, 0],
                        x: [0, 5, 0]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <img
                      src="/images/home-earth/role-wave.svg"
                      className="absolute bottom-[15px] left-[18px] z-0"
                      alt=""
                    />
                  </div>
                </div>
              )}
              {/*#endregion*/}
            </motion.div>
            <McBeraEntry />
          </div>
          {/* <McBeraView topRef={contentRef} /> */}
          <Kirov />
        </div>
      </McBeraProvider>
    </HomeEarthContext.Provider>
  );
};

export default HomeEarth;
