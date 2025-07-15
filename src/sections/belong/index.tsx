"use client";

import Benefits from "./components/benefits";
import BelongForm from "./components/form";
import HowWork from "./components/how-work";
import useIsMobile from "@/hooks/use-isMobile";
import BelongTitle from "./components/title";
import Partners from "./components/partners";

const BelongView = () => {

  const isMobile = useIsMobile();

  return (
    <div className="relative w-full text-[#6E7083] font-Montserrat text-[12px] font-[500] leading-[120%] md:h-screen md:overflow-y-auto md:pb-[90px]">
      <div className="text-white text-center font-Montserrat text-[36px] font-bold leading-[80%] uppercase">
        position yourself for{!isMobile && <br />} the future rally of
      </div>
      <BelongTitle>
        berachain
      </BelongTitle>
      <div className="text-[#A1A0A1] text-center font-Syne text-[16px] font-[500] leading-normal mt-[22px] md:mt-[10px] md:px-[10px]">
        Zap, deposit and LP into the best BERA stable{!isMobile && <br />} pool in the whole ecosystem!
      </div>
      <div className="relative  z-[1]mt-[56px] mx-auto w-[452px] shrink-0">
        <BelongForm className="w-full" />
      </div>
      <Benefits className="mt-[230px] relative z-[1]" />
      <HowWork className="mt-[168px] w-[928px] mx-auto" />
      <Partners className="mt-[133px] w-[846px] mx-auto" />
      <img
        src="/images/belong/v2/mc-belong.gif"
        className="absolute z-0 right-0 top-[550px] w-[380px] h-[380px]"
      />
    </div>
  );
};

export default BelongView;
