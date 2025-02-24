import clsx from 'clsx';
import { useContext } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { AnimatePresence, motion } from 'framer-motion';
import { numberFormatter } from '@/utils/number-formatter';
import { VisibleAnimation } from '@/sections/home-earth/utils';
import Big from 'big.js';
import { useRouter } from 'next/navigation';

const BeraPrice = (props: any) => {
  const { className } = props;

  const { beraPrice } = useContext(HomeEarthContext);
  const router = useRouter()

  return (
    <div onClick={() => router.push('/marketplace')} className={clsx('absolute flex flex-col items-center right-[10px] bottom-0 z-[5] w-[137px] h-[124px] overflow-hidden bg-[url("/images/home-earth/bera-price-signpost.svg")] bg-no-repeat bg-center bg-contain cursor-pointer', className)}>
      <AnimatePresence mode="wait">
        {
          Big(beraPrice?.percentage || 0).lt(0) ? (
            <motion.img
              key="down"
              src="/images/home-earth/price-down.gif"
              alt=""
              className="w-[49px] h-[38px]"
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
            Big(beraPrice?.percentage || 0).lt(0) ? (
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
            Big(beraPrice?.percentage || 0).lt(0) ? 'text-[#C60F28]' : 'text-[#CF6]'
          )}
        >
          {Big(beraPrice?.percentage || 0).toFixed(2)}%(1d)
        </div>
      </div>
    </div>
  );
};

export default BeraPrice;
