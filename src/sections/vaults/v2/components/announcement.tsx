import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { FILTER_KEYS } from '@/sections/vaults/v2/config';
import { useRouter } from 'next/navigation';
import useUserPoints from '@/hooks/use-user-points';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import useIsMobile from '@/hooks/use-isMobile';
import { useEffect, useRef } from 'react';

const Announcement = (props: any) => {
  const { className, containerClassName } = props;

  const noticeRef = useRef<any>();
  const {
    toggleListFilterSelected,
    listPoolProjects,
    listFilterSelected,
  } = useVaultsV2Context();
  const router = useRouter();
  const { userPoints } = useUserPoints();
  const isMobile = useIsMobile();

  const onClick = () => {
    const target = document.getElementById('VaultsRewardTopCard_1');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    const Infrared = listPoolProjects.find((it: any) => it.label === 'Infrared');
    if (Infrared) {
      const selectedList = listFilterSelected[FILTER_KEYS.PROTOCOLS] || [];
      const selected = selectedList?.some((it: any) => it.label === Infrared.label);
      if (!selected) {
        toggleListFilterSelected(FILTER_KEYS.PROTOCOLS, Infrared);
      }
    }
  };

  const onYourPointsClick = () => {
    router.push("/portfolio?from=vaults");
  };

  useEffect(() => {
    const noticeEl = noticeRef.current;
    const handleResize = () => {
      if (window.innerWidth < 385 && noticeEl) {
        noticeEl.style.fontSize = '12px';
      } else if (noticeEl) {
        noticeEl.style.fontSize = '14px';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={clsx("w-[560px] md:w-full absolute z-[51] left-1/2 -translate-x-1/2 top-[17px] md:top-0 flex justify-center items-center gap-[10px]", containerClassName)}>
      <motion.div
        ref={noticeRef}
        className={clsx("md:px-[10px] cursor-pointer p-[0] whitespace-nowrap justify-center w-[396px] md:w-full h-9 shrink-0 rounded-[10px] md:rounded-[0] border md:border-l-0 md:border-r-0 border-black bg-[#FFF5A9] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] text-black font-montserrat text-sm font-medium leading-none flex items-center gap-[11px]", className)}
        initial={{
          y: -100,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.3,
        }}
        onClick={onClick}
      >
        <img src="/images/vaults/v2/icon-notice.svg" alt="" className="shrink-0 w-[20px] h-[16px] object-center object-contain" />
        <div className="flex items-center">
          <div className="">Earn&nbsp;</div>
          <div className="font-[700]">Infrared points&nbsp;</div>
          <img src="/images/dapps/infrared/infrared.svg" alt="" className="shrink-0 w-[18px] h-[18px] border border-white rounded-full object-center object-contain" />
          <div className="">&nbsp;by using Infrared vaults!</div>
        </div>
      </motion.div>
      <AnimatePresence mode="wait">
        {
          (!isMobile && Big((userPoints as any)?.points || 0).gt(0)) && (
            <motion.div
              className={clsx("cursor-pointer p-[0] whitespace-nowrap justify-center w-[152px] h-9 shrink-0 rounded-[10px] border border-black bg-[#FF82B4] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] text-black font-montserrat text-[14px] font-[500] leading-none flex items-center gap-[11px]", className)}
              initial={{
                y: -100,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
              }}
              onClick={onYourPointsClick}
            >
              <div className="flex items-center">
                <div className="">Your Points</div>&nbsp;
                <div className="font-[700] underline underline-offset-2">
                  {numberFormatter((userPoints as any)?.points, 0, true, { isShort: true, isShortUppercase: true })}
                </div>&nbsp;
                <img src="/images/dapps/infrared/infrared.svg" alt="" className="shrink-0 w-[18px] h-[18px] border border-white rounded-full object-center object-contain" />
              </div>
            </motion.div>
          )
        }
      </AnimatePresence>
    </div>
  );
};

export default Announcement;
