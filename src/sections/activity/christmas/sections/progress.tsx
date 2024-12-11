import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import { ChristmasContext } from '@/sections/activity/christmas/context';
import { getUTCTimestamp } from '@/utils/date';
import Big from 'big.js';
import * as dateFns from 'date-fns';
import { WinningOdds } from '@/sections/activity/christmas/config';

const START_TIME = new Date('2024-12-10 00:00:00');
const MAS_TIME = new Date('2024-12-25 00:00:00');
const END_TIME = new Date('2025-01-01 00:00:00');

const TIME_DIFF = getUTCTimestamp(END_TIME) - getUTCTimestamp(START_TIME);

const NFTProgress = () => {
  const {
    currentDateTime,
  } = useContext(ChristmasContext);

  const today = useMemo<any>(() => {
    if (!currentDateTime) return {};
    let str = dateFns.format(currentDateTime, 'yyyy-MM-dd');
    return WinningOdds[str] || {};
  }, [currentDateTime]);

  const progress = useMemo(() => {
    if (!currentDateTime) return '0';
    let _progress = Big(new Date(currentDateTime).getTime()).minus(getUTCTimestamp(START_TIME)).div(TIME_DIFF).times(100).toFixed(1);
    if (Big(_progress).lt(0)) _progress = '0';
    if (Big(_progress).gt(100)) _progress = '100';
    return _progress;
  }, [currentDateTime]);

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
    <div className="flex justify-center mt-[110px]">
      <div id="tour-id-3" className="relative w-[693px] h-[24px] rounded-[12px] bg-black border border-[#FFDC50] p-[3px]">
        <div
          className="relative z-[2] h-full rounded-[9px] bg-[#FFDC50]"
          style={{ width: `${progress}%` }}
        >
          <Popover
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.TopRight}
            offset={0}
            content={(
              <div className="w-[240px] translate-x-[80px] h-[140px] bg-[url('/images/activity/christmas/bg-progress-cursor.svg')] bg-center bg-no-repeat bg-contain">
                <div className="flex flex-col items-center text-black rotate-[-4.499deg] pt-[20px]">
                  <div className="font-CherryBomb font-[400] leading-[150%] text-[30px]">{today?.display ?? ''}</div>
                  <div className="font-[500] text-[14px] leading-normal">Chance To Win Rare Prize</div>
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
        <Popover
          trigger={PopoverTrigger.Hover}
          placement={PopoverPlacement.TopRight}
          offset={0}
          content={(
            <div className="w-[240px] translate-x-[80px] h-[140px] bg-[url('/images/activity/christmas/bg-progress-cursor.svg')] bg-center bg-no-repeat bg-contain">
              <div className="flex flex-col items-center text-black rotate-[-4.499deg] pt-[20px]">
                <div className="font-CherryBomb font-[400] leading-[150%] text-[16px]">Merry Xmas!</div>
                <div className="font-CherryBomb font-[400] leading-[150%] text-[20px]">{WinningOdds['2024-12-24']?.display}</div>
                <div className="font-[500] text-[14px] leading-normal">Chance To Win Rare Prize</div>
              </div>
            </div>
          )}
          triggerContainerClassName="absolute z-[1] left-[calc(68%_-_35px)] top-0 -translate-y-[88px]"
        >
          <img
            src="/images/activity/christmas/icon-progress-mid.svg"
            alt=""
            className="w-[69px] h-[133px] cursor-pointer"
          />
        </Popover>
        <Popover
          trigger={PopoverTrigger.Hover}
          placement={PopoverPlacement.TopRight}
          offset={0}
          content={(
            <div className="w-[240px] translate-x-[70px] h-[140px] bg-[url('/images/activity/christmas/bg-progress-cursor.svg')] bg-center bg-no-repeat bg-contain">
              <div className="flex flex-col items-center text-black rotate-[-4.499deg] pt-[20px]">
                <div className="font-CherryBomb font-[400] leading-[150%] text-[16px]">Happy New Year!</div>
                <div className="font-CherryBomb font-[400] leading-[150%] text-[20px]">{WinningOdds['2024-12-31']?.display}</div>
                <div className="font-[500] text-[14px] leading-normal">Chance To Win Rare Prize</div>
              </div>
            </div>
          )}
          triggerContainerClassName="absolute z-[1] right-[-60px] top-0 -translate-y-[56px]"
        >
          <img
            src="/images/activity/christmas/icon-progress-complete.svg"
            alt=""
            className="w-[119px] h-[121px] cursor-pointer"
          />
        </Popover>
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
