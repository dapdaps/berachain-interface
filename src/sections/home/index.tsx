"use client";

import BearBackground from "@/components/bear-background/laptop";
import ArrowTopSvg from "@public/images/background/arrow-top.svg";
import BridgeSvg from "@public/images/background/bridge.svg";
import DappsSvg from "@public/images/background/dapps.svg";
import CaveSvg from "@public/images/cave/cave.svg";
import DashboardSvg from "@public/images/background/dashboard.svg";
import MarketplaceSvg from "@public/images/background/marketplace.svg";
import EarnSvg from "@public/images/background/earn.svg";
import BearSnow from '@public/images/home/christmas/bear-snow.svg';
import GiftBox from '@public/images/home/christmas/gift-box.svg';
import IconReload from '@public/images/home/christmas/icon-reload.svg';
import VaultsEnterance from "./vaults-enterance";
import MemeEnterance from "@/sections/meme/bros/enterance";
import { memo } from "react";
import { useProgressRouter } from "@/hooks/use-progress-router";
import useIsMobile from "@/hooks/use-isMobile";

import MobileHome from "./mobile";
import { useChristmas } from '@/hooks/use-christmas';

const Navigation = function () {
  const router = useProgressRouter();
  const { isChristmas, path: christmasPath } = useChristmas();

  const onNavigateToBridge = () => {
    router.push("/bridge");
  };
  const onNavigateToDapp = () => {
    router.push("/dapps");
  };
  const onNavigateToMarketplace = () => {
    router.push("/marketplace");
  };

  const onNavigateToDashBoard = () => {
    router.push("/dashboard");
  };

  const onNavigateToCave = () => {
    router.push("/cave");
  };

  const onNavigateToEarn = () => {
    router.push("/earn");
  };

  const onNavigateToVaults = () => {
    router.push("/vaults");
  };

  const onNavigateToBeramas = () => {
    router.push(christmasPath as string);
  };

  return (
    <>
      <div
        className="cursor-pointer absolute left-1/2 top-[31px] flex items-start gap-[14px] translate-x-[-25px]"
        onClick={onNavigateToMarketplace}
        data-bp="1010-006"
      >
        <div className={`flex flex-col gap-[19px] items-center pt-[10px] ${isChristmas ? 'text-white' : 'text-black'}`}>
          <div className={`text-[20px] font-CherryBomb leading-[90%]`}>
            Marketplace
          </div>
          <ArrowTopSvg />
        </div>
        <MarketplaceSvg className="hover:scale-110 transition-transform duration-500" />
      </div>
      <div
        className="absolute right-[35px] top-1/3 cursor-pointer flex flex-col items-end gap-[16px]"
        onClick={onNavigateToBridge}
        data-bp="1010-007"
      >
        <BridgeSvg className='hover:scale-110 transition-transform duration-500' />
        <div className={`flex items-center justify-end gap-[27px] pr-[19px] ${isChristmas ? 'text-white' : 'text-black'}`}>
          <ArrowTopSvg style={{ transform: 'rotate(90deg)' }} />
          <div className='text-[20px] font-CherryBomb leading-[90%]'>
            Bridge
          </div>
        </div>
      </div>
      <VaultsEnterance
        imgSrc="/images/background/vaults.svg"
        onClick={onNavigateToVaults}
        className="absolute right-[35px] bottom-[180px] hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute left-1/2 translate-x-[-50%] bottom-[19px] z-10 flex gap-[100px]">
        <div
          className="cursor-pointer flex items-start gap-[21px] translate-x-[-33px]"
          onClick={onNavigateToDashBoard}
          data-bp="1010-008"
        >
          <div className="flex flex-col gap-[19px] items-center pt-[29px]">
            <ArrowTopSvg style={{ transform: "rotate(180deg)" }} />
            <div className="text-[20px] text-black font-CherryBomb leading-[90%]">
              Dashboard
            </div>
          </div>
          <DashboardSvg className="hover:scale-110 transition-transform duration-500" />
        </div>

        <div
          className="cursor-pointer z-10 flex items-start gap-[21px] translate-x-[-33px]"
          onClick={onNavigateToEarn}
          data-bp="1010-012"
        >
          <EarnSvg className="hover:scale-110 transition-transform duration-500" />
          <div className="flex flex-col gap-[19px] items-center pt-[29px]">
            <ArrowTopSvg style={{ transform: "rotate(180deg)" }} />
            <div className="text-[20px] text-black font-CherryBomb leading-[90%]">
              Earn
            </div>
          </div>
        </div>
      </div>

      <div
        className='cursor-pointer absolute left-[45px] top-1/3 z-10 flex flex-col gap-[8px]'
        onClick={onNavigateToDapp}
        data-bp="1010-009"
      >
        <DappsSvg className='hover:scale-110 transition-transform duration-500' />
        <div className={`flex gap-[15px] items-center pl-[25px] ${isChristmas ? 'text-white' : 'text-black'}`}>
          <div className='text-[20px] text-black font-CherryBomb leading-[90%]'>
            dApps
          </div>
          <ArrowTopSvg style={{ transform: "rotate(270deg)" }} />
        </div>
      </div>

      <div
        className="cursor-pointer absolute left-[15px] bottom-[68px] z-10 flex flex-col gap-[8px]"
        onClick={onNavigateToCave}
        data-bp="1010-010"
      >
        <div className="text-[20px] text-center font-CherryBomb">Bera Cave</div>
        <CaveSvg className="hover:scale-110 transition-transform duration-500" />
      </div>
      <MemeEnterance />

      <div
        className="cursor-pointer absolute right-[10px] bottom-[10px] z-10 hover:scale-105 transition-transform duration-500"
        onClick={onNavigateToBeramas}
      >
        <div className="relative z-[1]">
          <BearSnow />
        </div>
        <div className="absolute left-[0px] bottom-[36px] z-[2] w-[139px] h-[58px] rounded-[29px]">
          <div className="absolute left-[27px] bottom-[23px] z-[1] animate-shake">
            <GiftBox />
          </div>
          <div className="absolute z-[2] left-[17px] bottom-[7px] h-[30px] rounded-[15px] p-[2px] bg-white">
            <div className="w-full h-full bg-[#C8D060] rounded-[13px] border-[2px] border-black pb-[3px]">
              <div className="w-full h-full pl-[8px] bg-[#EBF479] rounded-[10px] flex items-center justify-between">
                <div className="flex items-center gap-[1px] text-[#909649] text-[14px] font-[400] font-CherryBomb leading-[90%]">
                  <div className="text-black">10</div>
                  <div>/</div>
                  <div>10</div>
                </div>
                <button
                  type="button"
                  className="translate-y-[2.8px] translate-x-[4.2px] w-[26px] h-[26px] bg-[url('/images/home/christmas/icon-reload-bg.svg')] bg-center bg-contain"
                >
                  <IconReload className="animate-rotate origin-[12px_12px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(function Home() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileHome />;
  }

  return (
    <BearBackground type="home">
      <Navigation />
    </BearBackground>
  );
});
