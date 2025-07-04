import clsx from 'clsx';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import McBeraEntry from '@/sections/home-earth/mc-bera/entry';
import { useDebounceFn } from 'ahooks';
import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ChatLayout = dynamic(() => import('@/components/chat').then(mod => mod.ChatLayout || mod), { ssr: false });

const McBera = (props: any) => {
  const { className } = props;

  const computerContainerRef = useRef<any>();
  const [screenVisible, setScreenVisible] = useState(false);
  const [computerScale, setComputerScale] = useState(1);

  // original size
  const originalWidth = 1036;
  const originalHeight = 780;
  const baseWindowHeight = 850;

  // calculate computer container scale
  useEffect(() => {
    const calculateScale = () => {
      const windowHeight = window.innerHeight;
      if (windowHeight <= baseWindowHeight) {
        const scale = windowHeight / baseWindowHeight;
        setComputerScale(scale);
      } else {
        setComputerScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, []);

  const { scrollY, scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, (value) => {
    return Math.max(1, Math.min(2 - value, 2));
  });
  const opacity = useTransform(scrollYProgress, (value) => {
    if (value > 0.1) {
      return 1;
    }
    return Math.min(Math.max(value * 10, 0), 1);
  });
  const { run: scrollSnap, cancel: scrollSnapCancel } = useDebounceFn((_direction: "up" | "down") => {
    let _scrollTop = 0;
    if (_direction === "down") {
      _scrollTop = document.documentElement.scrollHeight;
    }

    window.scrollTo({
      top: _scrollTop,
      behavior: 'smooth'
    });
  }, { wait: 15 });

  const { run: onScreenVisible, cancel: onScreenVisibleCancel } = useDebounceFn((_scrollYProgress: number) => {
    setScreenVisible(_scrollYProgress >= 0.98);
  }, { wait: 150 });

  const handleComputerContainerClick = (e: any) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.bottom - e.clientY;

      // table height: 358px
      // left window width: 212px
      // right window width: 212px
      const isBottomArea = y <= 358;
      const isLeftArea = x <= 212;
      const isRightArea = rect.width - x <= 212;

      if (isBottomArea || isLeftArea || isRightArea) {
        return;
      }

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.98) {
      setScreenVisible(false);
    }
    onScreenVisibleCancel();
    onScreenVisible(latest);
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    // console.log("Page scroll: ", latest);
    // console.log("Page scrollYProgress: ", (scrollYProgress.get() * 100).toFixed(2) + "%");
    // @ts-ignore
    const diff = latest - scrollY?.getPrevious();
    // console.log("%cTrigger scroll diff: %s", "background:#96D6FF;color:#000;", diff);
    const triggerOffset = 1;
    if (Math.abs(diff) >= triggerOffset) {
      // down
      if (diff > 0) {
        scrollSnapCancel();
        scrollSnap("down");
      }
      // up
      else {
        scrollSnapCancel();
        scrollSnap("up");
      }
    }
  });

  return (
    <div className="relative z-[10] w-full overflow-hidden">
      <motion.div
        className={clsx("relative w-full h-[100dvh]", className)}
        style={{
          scale,
          opacity,
        }}
        transition={{
          ease: "linear",
        }}
      >
        <AnimatePresence mode="wait">
          {
            screenVisible && (
              <McBeraEntry
                isRoot={true}
                className="!fixed !bottom-[unset] top-[20px] !z-[51]"
                isOpen={false}
              />
            )
          }
        </AnimatePresence>
        <div className="absolute z-[2] left-0 bottom-[318px] w-[212px] h-[845px] bg-[url('/images/home-earth/mc-bera/bg-window-left.png')] bg-no-repeat bg-left bg-contain"/>
        <div className="absolute z-[2] right-0 bottom-[318px] w-[212px] h-[845px] bg-[url('/images/home-earth/mc-bera/bg-window-right.png')] bg-no-repeat bg-left bg-contain"/>
        <div className="absolute z-[1] left-0 bottom-0 flex items-end justify-center w-[100%] h-[358px] bg-[url('/images/home-earth/mc-bera/bg-table.png')] bg-no-repeat bg-top bg-[length:100%_358px]">
        </div>
        <div onClick={handleComputerContainerClick} className="relative z-[3] flex items-end justify-center w-full h-full">
          <div className="relative z-[1] w-[281px] h-[204px] shrink-0 translate-x-[70px] translate-y-[-40px] bg-[url('/images/home-earth/mc-bera/bg-books.png')] bg-no-repeat bg-bottom bg-contain" />
          <div
           ref={computerContainerRef}
           className="relative z-[2] shrink-0 overflow-hidden bg-[url('/images/home-earth/mc-bera/bg-computer.png')] bg-no-repeat bg-bottom bg-contain"
           style={{
             width: `${originalWidth * computerScale}px`,
             height: `${originalHeight * computerScale}px`,
             padding: `${20 * computerScale}px ${20 * computerScale}px ${124 * computerScale}px`,
           }}
          >
            <AnimatePresence mode="wait">
              {
                screenVisible && (
                  <motion.div
                    className="w-full h-full overflow-auto rounded-[12px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ChatLayout />
                  </motion.div>
                )
              }
            </AnimatePresence>
          </div>
          <div className="relative z-[1] w-[266px] h-[240px] shrink-0 translate-x-[-20px] translate-y-[-50px] bg-[url('/images/home-earth/mc-bera/bg-photo.png')] bg-no-repeat bg-bottom bg-contain" />
        </div>
      </motion.div>
    </div>
  );
};

export default McBera;
