import clsx from 'clsx';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import McBeraEntry from '@/sections/home-earth/mc-bera/entry';
import { ChatLayout } from '@/components/chat';

const McBera = (props: any) => {
  const { className } = props;

  const { scrollY, scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, (value) => {
    console.log('value: %o', value);
    return Math.max(1, Math.min(2 - value, 2));
  });
  useMotionValueEvent(scrollY, "change", (latest) => {
    console.log("Page scroll: ", latest);
    console.log("Page scrollYProgress: ", (scrollYProgress.get() * 100).toFixed(2) + "%");
    // @ts-ignore
    const diff = latest - scrollY?.getPrevious();
    const triggerOffset = 10;
    if (Math.abs(diff) >= triggerOffset) {
      console.log("%cTrigger scroll direction: %s", "background:#96D6FF;color:#000;", diff > 0 ? "down" : "up");
    }
  });

  return (
    <div className="relative z-[10] h-[100dvh] w-full overflow-hidden">
      <motion.div
        className={clsx("relative w-full h-full", className)}
        style={{
          scale,
        }}
      >
        <McBeraEntry className="!bottom-[unset] top-[68px] !z-[51]" isOpen={false} />
        <div className="absolute z-[1] left-0 bottom-[318px] w-[190px] h-[649px] bg-[url('/images/home-earth/mc-bera/bg-window-left.png')] bg-no-repeat bg-left bg-contain"/>
        <div className="absolute z-[1] right-0 bottom-[318px] w-[200px] h-[652px] bg-[url('/images/home-earth/mc-bera/bg-window-right.png')] bg-no-repeat bg-left bg-contain"/>
        <div className="relative z-[2] flex items-end justify-center w-full h-full bg-[url('/images/home-earth/mc-bera/bg-table.png')] bg-no-repeat bg-bottom bg-[length:100%_358px]">
          <div className="relative z-[1] w-[281px] h-[204px] translate-x-[70px] translate-y-[-40px] bg-[url('/images/home-earth/mc-bera/bg-books.png')] bg-no-repeat bg-bottom bg-contain" />
          <div className="relative z-[2] w-[1036px] h-[780px] bg-[url('/images/home-earth/mc-bera/bg-computer.png')] bg-no-repeat bg-bottom bg-contain">
            <ChatLayout />
          </div>
          <div className="relative z-[1] w-[266px] h-[240px] translate-x-[-20px] translate-y-[-50px] bg-[url('/images/home-earth/mc-bera/bg-photo.png')] bg-no-repeat bg-bottom bg-contain" />
        </div>
      </motion.div>
    </div>
  );
};

export default McBera;
