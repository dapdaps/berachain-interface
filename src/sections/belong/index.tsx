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
    <div className="relative w-full text-[#6E7083] font-Montserrat text-[12px] font-[500] leading-[120%]">
      <div className="text-white text-center font-Montserrat text-[36px] font-bold leading-[80%] uppercase md:text-[30px]">
        position yourself for{!isMobile && <br />} the future rally of
      </div>
      <BelongTitle className="md:mt-[10px]">
        berachain
      </BelongTitle>
      <div className="text-[#A1A0A1] md:text-white text-center font-Syne text-[16px] font-[500] leading-normal mt-[22px] md:mt-[10px] md:px-[10px]">
        Zap, deposit and LP into the best BERA stable{!isMobile && <br />} pool - iBERA-wgBERA in the whole ecosystem!
      </div>
      <div className="relative z-[1] mt-[56px] md:mt-[20px] mx-auto w-[452px] md:w-full md:px-[10px] shrink-0">
        <BelongForm className="w-full" />
      </div>
      <Benefits className="mt-[230px] md:mt-[200px] relative z-[1] md:w-full md:overflow-hidden" />
      <HowWork className="mt-[168px] md:mt-[100px] w-[928px] mx-auto md:w-full md:overflow-hidden" />
      <Partners className="mt-[133px] md:mt-[100px] w-[846px] mx-auto md:w-full md:px-[10px]" />
      <img
        src="/images/belong/v2/mc-belong.gif"
        className="absolute z-0 right-0 top-[550px] w-[380px] h-[380px] pointer-events-none"
      />
    </div>
  );
};

export default BelongView;
