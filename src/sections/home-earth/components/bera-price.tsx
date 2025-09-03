import clsx from 'clsx';
import { useContext } from 'react';
import { HomeEarthContext } from '@/sections/home-earth/context';
import { AnimatePresence, motion } from 'framer-motion';
import { numberFormatter } from '@/utils/number-formatter';
import { VisibleAnimation } from '@/sections/home-earth/utils';
import Big from 'big.js';
import { useRouter } from 'next/navigation';
import { useRainyDayStore } from '@/stores/rainy-day';

const BeraPrice = (props: any) => {
  const { className } = props;

  const { beraPrice } = useContext(HomeEarthContext);
  const router = useRouter();
  const { isWeatherOpen, setIsWeatherOpen } = useRainyDayStore();

  return (
    <div
      onClick={() => router.push('/marketplace?from=bera-price')}
      className={clsx('absolute pt-[15px] flex flex-col items-center right-[10px] bottom-0 z-[5] w-[140px] h-[126px] overflow-hidden bg-[url("/images/home-earth/bera-price-signpost.svg")] bg-no-repeat bg-center bg-contain cursor-pointer', className)}
    >
      <div className="w-full flex items-center gap-[0px] justify-center pr-[10px]">
        <AnimatePresence mode="wait">
          {
            Big(beraPrice?.percentage || 0).lt(0) ? (
              <motion.img
                key="down"
                src="/images/home-earth/price-down.gif"
                alt=""
                className="w-[38px] h-[38px]"
                {...VisibleAnimation}
              />
            ) : (
              <motion.img
                key="up"
                src="/images/home-earth/bera-price-up-icon.svg"
                alt=""
                className="w-[38px] h-[38px]"
                {...VisibleAnimation}
              />
            )
          }
        </AnimatePresence>
        <div className="flex flex-col items-start">
          <div className="flex justify-center gap-[2px] items-center">
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
      </div>
      <div className="w-full flex items-center justify-between px-[20px] mt-[15px]">
        <div className="font-CherryBomb text-[12px] text-black font-[400] leading-[90%]">
          Weather
        </div>
        <button
          type="button"
          className={clsx(
            "w-[32px] h-[18px] shrink-0 border border-black rounded-[10px] flex items-center p-[1px]",
            isWeatherOpen ? "bg-[#FFDC50]" : "bg-[#7A4A12]"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsWeatherOpen(!isWeatherOpen);
          }}
        >
          <motion.div
            className="w-[14px] h-full border border-black rounded-full bg-[#BC9549]"
            animate={{
              x: isWeatherOpen ? "100%" : 0,
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default BeraPrice;
