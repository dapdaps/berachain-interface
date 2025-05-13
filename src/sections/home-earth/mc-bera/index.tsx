import clsx from 'clsx';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import McBeraEntry from '@/sections/home-earth/mc-bera/entry';
import { useDebounceFn } from 'ahooks';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const ChatLayout = dynamic(() => import('@/components/chat'));

const McBera = (props: any) => {
  const { className } = props;

  const [screenVisible, setScreenVisible] = useState(false);

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
        <div className="absolute z-[1] left-0 bottom-[318px] w-[190px] h-[649px] bg-[url('/images/home-earth/mc-bera/bg-window-left.png')] bg-no-repeat bg-left bg-contain"/>
        <div className="absolute z-[1] right-0 bottom-[318px] w-[200px] h-[652px] bg-[url('/images/home-earth/mc-bera/bg-window-right.png')] bg-no-repeat bg-left bg-contain"/>
        <div className="relative z-[2] flex items-end justify-center w-full h-full bg-[url('/images/home-earth/mc-bera/bg-table.png')] bg-no-repeat bg-bottom bg-[length:100%_358px]">
          <div className="relative z-[1] w-[281px] h-[204px] shrink-0 translate-x-[70px] translate-y-[-40px] bg-[url('/images/home-earth/mc-bera/bg-books.png')] bg-no-repeat bg-bottom bg-contain" />
          <div className="relative z-[2] w-[1036px] h-[780px] shrink-0 p-[20px_20px_124px] overflow-hidden bg-[url('/images/home-earth/mc-bera/bg-computer.png')] bg-no-repeat bg-bottom bg-contain">
            <AnimatePresence mode="wait">
              {
                screenVisible && (
                  <motion.div
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
