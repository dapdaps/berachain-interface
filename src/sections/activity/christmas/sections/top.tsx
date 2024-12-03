import Moon from '@/sections/activity/christmas/components/moon';
import ProgressBar from '@/sections/activity/christmas/components/progress-bar';
import { useEffect, useRef, useState } from 'react';
import Swiper from '@/sections/activity/christmas/components/swiper';
import Prompt from '@/sections/activity/christmas/components/prompt';

const Top = () => {
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
    <div className="relative">
      <div className="w-full absolute left-0 top-[-260px] h-[334px] flex justify-center items-center">
        <Moon />
      </div>
      <div className="pt-[35px] w-full h-[443px] bg-[url('/images/activity/christmas/bg-cloud.svg')] bg-no-repeat bg-cover bg-top">
        <div className="flex flex-col items-center gap-[0px]">
          <div className="relative w-[791px] h-[254px]">
            <img src="/images/activity/christmas/title.svg" alt="" width={791} height={254} />
            <img
              src="/images/activity/christmas/title-circle-left.svg"
              alt=""
              className="absolute left-[240px] bottom-[100px] animate-blink"
              style={{ animationDelay: '2s', animationDuration: '5s' }}
            />
            <img
              src="/images/activity/christmas/title-circle-right.svg"
              alt=""
              className="absolute right-[247px] bottom-[85px] animate-blink"
              style={{ animationDelay: '0', animationDuration: '8s' }}
            />
            <img
              src="/images/activity/christmas/star-left-top.svg"
              alt=""
              className="absolute left-0 top-0 animate-blink"
              style={{ animationDelay: '0', animationDuration: '7s' }}
            />
            <img
              src="/images/activity/christmas/star-left-bot.svg"
              alt=""
              className="absolute left-[80px] bottom-[55px] animate-blink"
              style={{ animationDelay: '2s', animationDuration: '3s' }}
            />
            <img
              src="/images/activity/christmas/star-center-top.svg"
              alt=""
              className="absolute left-[270px] bottom-[155px] animate-blink"
              style={{ animationDelay: '0', animationDuration: '10s' }}
            />
            <img
              src="/images/activity/christmas/star-right-top.svg"
              alt=""
              className="absolute right-[150px] bottom-[120px] animate-blink"
              style={{ animationDelay: '1s', animationDuration: '8s' }}
            />
            <img
              src="/images/activity/christmas/star-right-bot.svg"
              alt=""
              className="absolute right-[0px] bottom-[10px] animate-blink"
              style={{ animationDelay: '5s', animationDuration: '5s' }}
            />
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default Top;
