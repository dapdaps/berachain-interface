"use client";

import BearBackground from "@/components/bear-background/laptop";
import ArrowTopSvg from "@public/images/background/arrow-top.svg";
import BridgeSvg from "@public/images/background/bridge.svg";
import DappsSvg from "@public/images/background/dapps.svg";
import CaveSvg from "@public/images/cave/cave.svg";
import DashboardSvg from "@public/images/background/dashboard.svg";
import MarketplaceSvg from "@public/images/background/marketplace.svg";
import EarnSvg from "@public/images/background/earn.svg";
import VaultsEnterance from "./vaults-enterance";
import { memo } from "react";
import { useProgressRouter } from "@/hooks/use-progress-router";
import useIsMobile from "@/hooks/use-isMobile";
import MobileHome from "./mobile";
import ChristmasEnterance from "@/sections/activity/christmas/enterance";
import { useChristmas } from "@/hooks/use-christmas";
import clsx from "clsx";
import HomePrompt from '@/sections/activity/christmas/components/home-prompt';


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
        id="btn-group1"
      >
        <div
          className={`flex flex-col gap-[19px] items-center pt-[10px] ${
            isChristmas ? "text-white" : "text-black"
          }`}
        >
          <div className={`text-[20px] font-CherryBomb leading-[90%]`}>
            Marketplace
          </div>
          <ArrowTopSvg />
        </div>
        <MarketplaceSvg className="hover:scale-110 transition-transform duration-500" />
      </div>
      <div
        className={clsx(
          'absolute right-[35px] top-1/3 cursor-pointer flex flex-col items-end gap-[16px]',
          isChristmas ? 'top-1/4' : 'top-1/3'
        )}
        onClick={onNavigateToBridge}
        data-bp="1010-007"
        id="btn-group2"
      >
        <div
          className={`flex items-center justify-end gap-[12px] pr-[10px] ${
            isChristmas ? 'text-white' : 'text-black'
          }`}
        >
          <ArrowTopSvg style={{ transform: 'rotate(90deg)' }} />
          <div
            className={clsx(
              'text-[20px] font-CherryBomb leading-[90%]',
              isChristmas ? 'text-white' : 'text-black'
            )}
          >
            Bridge
          </div>
        </div>
        <BridgeSvg className="hover:scale-110 transition-transform duration-500" />
      </div>
      <VaultsEnterance
        imgSrc="/images/background/vaults.svg"
        onClick={onNavigateToVaults}
        className={clsx(
          'absolute right-[35px] hover:scale-110 transition-transform duration-500',
          isChristmas
            ? 'text-white top-[calc(25%+50px)]'
            : 'text-black] top-[calc(33.333%+50px)]'
        )}
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
        className="cursor-pointer absolute left-[45px] top-1/3 z-10 flex flex-col gap-[8px]"
        onClick={onNavigateToDapp}
        data-bp="1010-009"
      >
        <DappsSvg className="hover:scale-110 transition-transform duration-500" />
        <div
          className={`flex gap-[15px] items-center pl-[15px] ${
            isChristmas ? "text-white" : "text-black"
          }`}
        >
          <div className="text-[20px] font-CherryBomb leading-[90%]">dApps</div>
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

      <ChristmasEnterance path={christmasPath} />
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
      <HomePrompt />
    </BearBackground>
  );
});
