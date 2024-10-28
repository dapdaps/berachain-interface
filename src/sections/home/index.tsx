'use client';

import BearBackground from '@/components/bear-background';
import ArrowTopSvg from "@public/images/background/arrow-top.svg";
import BridgeSvg from "@public/images/background/bridge.svg";
import DappsSvg from "@public/images/background/dapps.svg";
import CaveSvg from "@public/images/cave/cave.svg";
import DashboardSvg from "@public/images/background/dashboard.svg";
import MarketplaceSvg from "@public/images/background/marketplace.svg";
import { memo } from "react";
import { useProgressRouter } from '@/hooks/use-progress-router';

const Navigation = function () {

  const router = useProgressRouter();

  const onNavigateToBridge = () => {
    router.push('/bridge');
  }
  const onNavigateToDapp = () => {
    router.push('/dapps');
  }
  const onNavigateToMarketplace = () => {
    router.push('/marketplace');
  }

  const onNavigateToDashBoard = () => {
    router.push('/dashboard');
  }

  const onNavigateToCave = () => {
    router.push('/cave');
  }

  return (
    <>
      <div
        className="cursor-pointer absolute left-1/2 top-[31px] flex items-start gap-[14px] translate-x-[-25px]"
        onClick={onNavigateToMarketplace}
        data-bp="1001-006"
      >
        <div className="flex flex-col gap-[19px] items-center pt-[10px]">
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Marketplace</div>
          <ArrowTopSvg />
        </div>
        <MarketplaceSvg className="hover:scale-110 transition-transform duration-500" />
      </div>

      <div
        className="cursor-pointer absolute right-[35px] top-[363px] flex flex-col items-end gap-[16px]"
        onClick={onNavigateToBridge}
        data-bp="1001-007"
      >
        <BridgeSvg className="hover:scale-110 transition-transform duration-500" />
        <div className="flex items-center justify-end gap-[27px] pr-[19px]">
          <ArrowTopSvg style={{ transform: 'rotate(90deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Bridge</div>
        </div>
      </div>

      <div
        className="cursor-pointer absolute left-1/2 bottom-[19px] z-10 flex items-start gap-[21px] translate-x-[-33px]"
        onClick={onNavigateToDashBoard}
        data-bp="1001-008"
      >
        <div className="flex flex-col gap-[19px] items-center pt-[29px]">
          <ArrowTopSvg style={{ transform: 'rotate(180deg)' }} />
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">Dashboard</div>
        </div>
        <DashboardSvg className="hover:scale-110 transition-transform duration-500" />
      </div>

      <div
        className="cursor-pointer absolute left-[45px] top-[348px] z-10 flex flex-col gap-[8px]"
        onClick={onNavigateToDapp}
        data-bp="1001-009"
      >
        <DappsSvg className="hover:scale-110 transition-transform duration-500" />
        <div className="flex gap-[15px] items-center pl-[25px]">
          <div className="text-[20px] text-black font-CherryBomb leading-[90%]">dApps</div>
          <ArrowTopSvg style={{ transform: 'rotate(270deg)' }} />
        </div>
      </div>


      <div
        className="cursor-pointer absolute left-[15px] bottom-[68px] z-10 flex flex-col gap-[8px]"
        onClick={onNavigateToCave}
        data-bp="1001-010"
      >
        <div className='text-[20px] text-center font-CherryBomb'>Bera Cave</div>
        <CaveSvg className="hover:scale-110 transition-transform duration-500" />
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
