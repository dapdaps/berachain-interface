import { useEffect, useRef, useState } from 'react';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';

const NFTProgress = () => {
  const swiperRef = useRef<any>(null);
  const [current, setCurrent] = useState(1);

  const value = 12;

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
    <div className="flex justify-center mt-[110px]">
      <div className="relative w-[693px] h-[24px] rounded-[12px] bg-black border border-[#FFDC50] p-[3px]">
        <div
          className="relative z-[2] w-[10%] h-full rounded-[9px] bg-[#FFDC50]"
        >
          <Popover
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.TopRight}
            offset={0}
            content={(
              <div className="w-[200px] translate-x-[55px] h-[110px] bg-[url('/images/activity/christmas/bg-progress-cursor.svg')] bg-center bg-no-repeat bg-contain">
                <div className="flex flex-col items-center text-black rotate-[-4.499deg] pt-[14px]">
                  <div className="font-CherryBomb font-[400] leading-[150%] text-[30px]">{value}%</div>
                  <div className="font-[500] text-[14px] leading-normal">Chance to win NFTs</div>
                </div>
              </div>
            )}
            triggerContainerClassName="absolute z-[1] right-[-46px] top-[0] translate-y-[-23px]"
          >
            <img
              src="/images/activity/christmas/icon-progress-cursor.svg"
              alt=""
              className="w-[62px] h-[46px] cursor-pointer"
            />
          </Popover>
        </div>
        <img
          src="/images/activity/christmas/icon-progress-mid.svg"
          alt=""
          className="w-[69px] h-[133px] absolute z-[1] left-1/2 top-0 -translate-x-1/2 -translate-y-[88px]"
        />
        <img
          src="/images/activity/christmas/icon-progress-complete.svg"
          alt=""
          className="w-[119px] h-[121px] absolute z-[1] right-[-60px] top-0 -translate-y-[56px]"
        />
        <Popover
          trigger={PopoverTrigger.Hover}
          placement={PopoverPlacement.TopRight}
          content={(
            <Card className="w-[308px] rounded-[12px] p-[10px]">
              Chance to open a grand prize of an NFT will be increase closers to Xmas day (Dec 24th) and New year eve (Dec 31th)
            </Card>
          )}
          triggerContainerClassName="absolute right-[-66px] top-[4px] z-[1]"
        >
          <div
            className="cursor-pointer text-[#FFF5A9] w-[15px] h-[15px] rounded-full bg-[url('/images/activity/christmas/icon-prompt.svg')] bg-center bg-no-repeat bg-cover"
          />
        </Popover>
      </div>
    </div>
  );
};

export default NFTProgress;