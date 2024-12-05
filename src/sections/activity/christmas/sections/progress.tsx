import Swiper from '@/sections/activity/christmas/components/swiper';
import ProgressBar from '@/sections/activity/christmas/components/progress-bar';
import Prompt from '@/sections/activity/christmas/components/prompt';
import { useEffect, useRef, useState } from 'react';

const NFTProgress = () => {
  const swiperRef = useRef<any>(null);
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    const autoPlay = () => {
      let _current = current + 1;
      if (_current > 2) {
        _current = 1;
      }
      setCurrent(_current);
    };
    const timer = setInterval(autoPlay, 2000);
    return () => {
      clearInterval(timer);
    };
  }, [current, swiperRef.current]);

  return (
    <div className="w-[611px] mx-auto bg-[linear-gradient(90deg,_#026E6E_0%,_#014B58_100%)] rounded-[8px] p-[11px_15px_15px] shadow-[0px_4px_4px_0px_rgba(0,_0,_0,_0.25)]">
      <div className="flex justify-between">
        <div className="flex justify-between flex-1 gap-1 pr-[14px] border-r border-r-[#FFF5A9]">
          <div className="text-[#FFF5A9] text-[16px] font-[500]">
            <div className="">
              Chance to win NFT
            </div>
            <div className="mt-[px] font-CherryBomb text-[26px]">
              12%
            </div>
          </div>
          <button
            type="button"
            className="border border-[#FFF5A9] rounded-[6px] flex justify-center items-center h-[20px] px-[10px] text-[#FFF5A9] text-[12px] font-[500]"
          >
            Check
          </button>
        </div>
        <div ref={swiperRef} className="flex-1 pl-[33px] overflow-hidden">
          <Swiper
            current={current}
            list={[
              { id: 1 },
              { id: 2 },
            ]}
            renderItem={(item: any) => {
              return (
                <>
                  <div className="text-[#FFF5A9] text-[16px] font-[500]">
                    1{item.id} d 23 : 12 : 03 till Xmas Eve
                  </div>
                  <ProgressBar />
                </>
              );
            }}
          />
        </div>
      </div>
      <Prompt className="mt-[18px]">
        Chance to open a grand prize of an NFT will be increase closers to Xmas day (Dec 24th) and New year eve (Dec 31th)
      </Prompt>
    </div>
  );
};

export default NFTProgress;
