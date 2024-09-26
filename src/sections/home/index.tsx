

'use client';
import ArrowTopSvg from "@public/images/arrow-top.svg";
import BridgeSvg from "@public/images/bridge.svg";
import CloudSvg from "@public/images/cloud.svg";
import DashboardSvg from "@public/images/dashboard.svg";
import ExploreSvg from "@public/images/explore.svg";
import { memo } from "react";

const Clouds = function () {
  return (
    <>
      <div className="absolute left-1/2 top-[109px] translate-x-[-465px]">
        <CloudSvg />
      </div>
      <div className="absolute left-1/2 top-[13px] translate-x-[154px]">
        <CloudSvg />
      </div>
      <div className="absolute left-1/2 top-[143px] translate-x-[360px]">
        <CloudSvg />
      </div>
    </>
  )
}
const Navigation = function () {
  return (
    <>
      <div className="absolute left-1/2 top-[31px] flex items-start gap-[14px]">
        <div className="flex flex-col gap-[19px] items-center pt-[10px]">
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Explore</div>
          <ArrowTopSvg />
        </div>
        <ExploreSvg />
      </div>

      <div className="absolute right-[35px] top-[363px] flex flex-col items-end gap-[16px]">
        <BridgeSvg />
        <div className="flex items-center justify-end gap-[27px] pr-[19px]">
          <ArrowTopSvg style={{ transform: 'rotate(90deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Explore</div>
        </div>
      </div>

      <div className="absolute left-1/2 bottom-[19px] z-10 flex items-start gap-[21px]">
        <div className="flex flex-col gap-[19px] items-center pt-[29px]">
          <ArrowTopSvg style={{ transform: 'rotate(180deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Dashboard</div>
        </div>
        <DashboardSvg />
      </div>

      <div className="absolute left-1/2 bottom-[19px] z-10 flex items-start gap-[21px]">
        <div className="flex flex-col gap-[19px] items-center pt-[29px]">
          <ArrowTopSvg style={{ transform: 'rotate(180deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Dashboard</div>
        </div>
        <DashboardSvg />
      </div>
    </>
  )
}

export default memo(function Home() {
  return (
    <div className="relative" style={{ height: 'calc(100dvh - 68px)', minHeight: 899 }}>
      <Clouds />
      <Navigation />
      <div className="absolute bottom-0 left-0 w-full h-[233px] bg-[#B6DF5D] border-t border-black" />
    </div>
  );
});
