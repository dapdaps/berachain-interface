import clsx from 'clsx';
import { useContext } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { AnimatePresence, motion } from 'framer-motion';
import { numberFormatter } from '@/utils/number-formatter';
import { VisibleAnimation } from '@/sections/home-earth/utils';

const BeraPrice = (props: any) => {
  const { className } = props;

  const { beraPrice, isRainyDay } = useContext(HomeEarthContext);

  return (
    <div className={clsx('absolute pt-[10px] flex flex-col items-center left-[320px] bottom-0 z-[5] w-[137px] h-[117px] overflow-hidden bg-[url("/images/home-earth/bera-price-signpost.svg")] bg-no-repeat bg-center bg-contain', className)}>
      <AnimatePresence mode="wait">
        {
          isRainyDay ? (
            <motion.img
              key="down"
              src="/images/home-earth/bera-price-down-icon.svg"
              alt=""
              className="w-[38px] h-[38px]"
              {...VisibleAnimation}
            />
          ) : (
            <motion.img
              key="up"
              src="/images/home-earth/bera-price-up-icon.svg"
              alt=""
              className="w-[49px] h-[38px]"
              {...VisibleAnimation}
            />
          )
        }
      </AnimatePresence>
      <div className="flex justify-center gap-[4px] items-center">
        <img src="/images/home-earth/bera-icon.svg" alt="" className="w-[20px] h-[20px]" />
        <div className="text-black text-center font-CherryBomb text-base font-normal leading-[90%]">
          {numberFormatter(beraPrice?.price, 2, true, { prefix: '$' })}
        </div>
      </div>
      <div className="flex justify-center gap-[3px] items-center mt-[3px]">
        <AnimatePresence mode="wait">
          {
            isRainyDay ? (
              <motion.img
                key="down"
                src="/images/home-earth/bera-price-down-arrow.svg"
                alt=""
                className="w-[8px] h-[7px]"
                {...VisibleAnimation}
              />
            ) : (
              <img
                key="up"
                src="/images/home-earth/bera-price-up-arrow.svg"
                alt=""
                className="w-[8px] h-[7px]"
                {...VisibleAnimation}
              />
            )
          }
        </AnimatePresence>
        <div
          className={clsx(
            'text-center font-CherryBomb text-xs font-normal leading-[90%] transition-all duration-300',
            isRainyDay ? 'text-[#C60F28]' : 'text-[#CF6]'
          )}
        >
          {numberFormatter(beraPrice?.percentage, 2, true, {})}%(1d)
        </div>
      </div>
    </div>
  );
};

export default BeraPrice;
