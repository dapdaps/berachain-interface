"use client";

import { useEffect, useState } from "react";
import Benefits from "./components/benefits";
import BelongForm from "./components/form";
import HowWork from "./components/how-work";
import { cloneDeep } from "lodash";
import useIsMobile from "@/hooks/use-isMobile";

const FullBreakPoint = 1450;
const MidiumBreakPoint = 1000;
const DefaultStyles = {
  benefits: { order: 1 },
  form: { order: 2 },
  howWork: { order: 3 },
  container: {}
};

const BelongView = () => {
  const [styles, setStyles] = useState<any>(cloneDeep(DefaultStyles));

  const isMobile = useIsMobile();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < MidiumBreakPoint) {
        setStyles({
          container: { padding: isMobile ? "0 10px" : "0 30px" },
          benefits: { order: 2, width: "100%", maxWidth: 520 },
          form: { order: 1, width: "100%", maxWidth: 520 },
          howWork: { order: 3, width: "100%", maxWidth: 520 }
        });
        return;
      }
      if (width < FullBreakPoint) {
        setStyles({
          benefits: { order: 2, marginTop: 15 },
          form: { order: 1 },
          howWork: { order: 3, transform: "translateX(275px) translateY(-80px)" }
        });
        return;
      }
      setStyles(DefaultStyles);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  return (
    <div className="w-full text-[#6E7083] font-Montserrat text-[12px] font-[500] leading-[120%] md:h-screen md:overflow-y-auto md:pb-[90px]">
      <div className="text-[#471C1C] text-center font-Montserrat text-[36px] md:text-[24px] font-bold leading-[80%] uppercase mt-[5px] md:mt-[30px] md:px-[30px]">
        position yourself for{!isMobile && <br />} the future rally of
      </div>
      <div className="uppercase text-center text-[#FFAF0C] text-[36px] md:text-[28px] font-[400] [text-shadow:0px_4px_0px_#471C1C] font-CherryBomb leading-[80%] mt-[4px] text-stroke-1-4b371f">
        berachain
      </div>
      <div className="text-[#3D405A] text-center font-Montserrat text-[14px] font-[500] leading-normal mt-[20px] md:mt-[10px] md:px-[10px]">
        Zap, deposit and LP into the best BERA stable pool{!isMobile && <br />} in the whole ecosystem!
      </div>
      <div className="flex justify-center items-start gap-[35px] md:gap-[10px] flex-wrap" style={styles.container}>
        <Benefits className="w-[430px] shrink-0" style={styles.benefits} />
        <div className="relative mt-[20px] md:mt-[10px] w-[520px] shrink-0" style={styles.form}>
          <BelongForm className="w-full" />
        </div>
        <HowWork className="w-[430px] shrink-0" style={styles.howWork} />
      </div>
    </div>
  );
};

export default BelongView;
