

'use client';
import BearBackground from '@/components/bear-background';
import ArrowTopSvg from "@public/images/background/arrow-top.svg";
import BridgeSvg from "@public/images/background/bridge.svg";
import DappsSvg from "@public/images/background/dapps.svg";
import DashboardSvg from "@public/images/background/dashboard.svg";
import ExploreSvg from "@public/images/background/explore.svg";
import { memo } from "react";
import { useRouter } from 'next/navigation';

const Navigation = function () {

  const router = useRouter();

  const onNavigateToBridge = () => {
    router.push('/bridge');
  }
  const onNavigateToDapp = () => {
    router.push('');
  }
  const onNavigateToMarketplace = () => {
    router.push('/marketplace');
  }

  const onNavigateToDashBoard = () => {
    router.push('/dashboard');
  }
  return (
    <>
      <div className="absolute left-1/2 top-[31px] flex items-start gap-[14px] translate-x-[-25px]">
        <div className="flex flex-col gap-[19px] items-center pt-[10px]" onClick={onNavigateToMarketplace}>
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Explore</div>
          <ArrowTopSvg />
        </div>
        <ExploreSvg onClick={onNavigateToMarketplace}/>
      </div>

      <div className="absolute right-[35px] top-[363px] flex flex-col items-end gap-[16px]">
        <BridgeSvg onClick={onNavigateToBridge} />
        <div className="flex items-center justify-end gap-[27px] pr-[19px]" onClick={onNavigateToBridge}>
          <ArrowTopSvg style={{ transform: 'rotate(90deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Explore</div>
        </div>
      </div>

      <div className="absolute left-1/2 bottom-[19px] z-10 flex items-start gap-[21px] translate-x-[-33px]">
        <div className="flex flex-col gap-[19px] items-center pt-[29px]" onClick={onNavigateToDashBoard}>
          <ArrowTopSvg style={{ transform: 'rotate(180deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Dashboard</div>
        </div>
        <DashboardSvg onClick={onNavigateToDashBoard}/>
      </div>

      <div className="absolute left-[45px] top-[348px] z-10 flex flex-col gap-[8px]">
        <DappsSvg  onClick={onNavigateToDapp}/>
        <div className="flex gap-[15px] items-center pl-[25px]" onClick={onNavigateToDapp}>
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">dApps</div>
          <ArrowTopSvg style={{ transform: 'rotate(270deg)' }} />
        </div>
      </div>
    </>
  )
}

export default memo(function Home() {
  return (
    <BearBackground type='home'>
      <Navigation />
    </BearBackground>
  );
});
