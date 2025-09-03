"use client";

import { usePathname } from "next/navigation";
import HomeEarthTop from "../home-earth/components/top";
import Lights from "./components/lights";
import Link from "next/link";
import clsx from "clsx";
import { PlaygroundProvider } from "./context";
import { usePlayground } from "./hooks";
import { numberFormatter } from "@/utils/number-formatter";
import PlaygroundRulesModal from "./components/rules";
import { useState } from "react";

const PlaygroundLayout = (props: any) => {
  const { children } = props;

  const pathname = usePathname();
  const playground = usePlayground();

  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <PlaygroundProvider value={playground}>
      <div className="w-full">
        <HomeEarthTop isLogo={false} isAirdrop={false} className="!pt-[0]" />
        <div className="absolute w-full top-[80px] flex justify-center items-center gap-[4px] z-[2]">
          <div className="text-[60px] font-CherryBomb [text-shadow:_0_4px_0_#4B371F] leading-[90%] text-white font-[400]">
            Carnival
          </div>
          <button
            type="button"
            className="text-black text-center font-CherryBomb text-[16px] font-[400] leading-[90%] w-[55px] h-[30px] rotate-[-8.017deg] translate-y-[5px] flex-shrink-0 rounded-[12px] border border-black bg-[linear-gradient(180deg,_#FFCE78_0%,_#9E762F_100%)]"
            onClick={() => {
              setShowRulesModal(true);
            }}
          >
            Rules
          </button>
        </div>
        <div className="absolute left-0 top-0 w-full h-[430px] pointer-events-none overflow-hidden bg-[url('/images/playground/lights-long.png')] bg-[length:100%_auto] bg-bottom bg-no-repeat">
          <Lights className="!absolute left-0 top-0" delay={0} />
          <Lights className="!absolute right-[-80px] top-[-50px] rotate-[30deg]" delay={0.5} />
          {/* <Lights className="!absolute left-[-50px] bottom-[0px] rotate-[10deg]" delay={1} />
        <Lights className="!absolute right-[-90px] bottom-[30px] rotate-[0deg]" delay={1.5} /> */}
        </div>
        <div
          className="w-full min-h-[100dvh] bg-[length:100%_auto] bg-bottom bg-no-repeat relative z-[1]"
          style={{
            backgroundImage: ["/carnival/lucky-bera"].includes(pathname) ? "url('/images/playground/bg-ground.png')" : "url('/images/playground/bg-ground2.png')",
          }}
        >
          {
            ["/carnival/lucky-bera"].includes(pathname) && (
              <Link
                href="/carnival/big-wheel"
                prefetch
                className="block absolute w-[186px] h-[222px] left-1/2 -translate-x-[calc(50%_+_500px)] bottom-[177px] z-[1] bg-[url('/images/playground/big-wheel.png')] bg-no-repeat bg-center bg-contain"
              >
                <Signpost>
                  <img
                    src="/images/check-in/spin.png"
                    alt=""
                    className="w-[44px] h-[44px] shrink-0 object-center object-contain"
                  />
                  <div>x{numberFormatter(playground?.wheelUserData?.wheel_balance, 2, true, { isShort: true, isShortUppercase: true })}</div>
                </Signpost>
              </Link>
            )
          }
          {children}
          {
            ["/carnival/big-wheel"].includes(pathname) && (
              <Link
                href="/carnival/lucky-bera"
                prefetch
                className="block absolute w-[210px] h-[258px] left-1/2 -translate-x-[calc(50%_-_500px)] bottom-[177px] z-[1] bg-[url('/images/playground/lucky-bera.png')] bg-no-repeat bg-center bg-contain"
              >
                <Signpost className="!top-[unset] bottom-[-10px] !w-[130px]">
                  <img
                    src="/images/playground/lucky-bera/ticket-spin.png"
                    alt=""
                    className="w-[50px] h-[46px] shrink-0 object-center object-contain"
                  />
                  <div>x{numberFormatter(playground?.spinUserData?.spin_balance, 2, true, { isShort: true, isShortUppercase: true })}</div>
                </Signpost>
              </Link>
            )
          }
        </div>
        <PlaygroundRulesModal
          open={showRulesModal}
          onClose={() => {
            setShowRulesModal(false);
          }}
        />
      </div>
    </PlaygroundProvider>
  );
};

export default PlaygroundLayout;

const Signpost = (props: any) => {
  const { className, children } = props;

  return (
    <div className={clsx("w-[100px] h-[50px] flex justify-center items-center gap-[2px] text-[20px] pb-[4px] font-[400] leading-[100%] font-CherryBomb text-white [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F] [text-shadow:0_3px_0_#4B371F] bg-[url('/images/playground/spin-signpost.png')] bg-no-repeat bg-center bg-[length:100%_100%] absolute left-1/2 -translate-x-1/2 top-[100px]", className)}>
      {children}
    </div>
  );
};
