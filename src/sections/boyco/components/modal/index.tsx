import ReactDOM from "react-dom";
import { Gasoek_One } from "next/font/google";
import IconClose from "@public/images/modal/close.svg";
import clsx from "clsx";
import Positions from "../positions";
import Vaults from "../vaults";
import ArrowIcon from "./arrow-icon";
import { motion } from "framer-motion";
import useBoycoData from "@/sections/boyco/use-data";
import { useActivityStore } from "@/stores/useActivityStore";
import { BERA_OPPORTUNITIES } from '@/sections/boyco/config';
import useIsMobile from "@/hooks/use-isMobile";
import IconBoycoTitle from "@public/images/boyco/boyco.svg";
import IconBoycoArrow from "@public/images/boyco/arrow.svg";
import IconBoycoOppot from "@public/images/boyco/oppot.svg";
const gasoekOne = Gasoek_One({
  weight: "400",
  subsets: ["latin"]
});

export default function BoycoModal({ onClose }: { onClose: () => void }) {
  const { totalUsd, positions, assets, vaults, loading } = useBoycoData();
  const { isDefaultTheme } = useActivityStore();
  const isMobile = useIsMobile()

  return ReactDOM.createPortal(
    <div
      className={clsx("fixed top-0 right-0 w-full h-full z-[90] bg-black/50")}
    >
      <motion.div
        className="absolute bottom-[30px] left-[50%] w-[1200px] max-w-[90vw] h-[800px] lg:max-h-[90vh] md:max-h-[80vh]"
        initial={{ opacity: 0, y: 100, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        exit={{ opacity: 0, y: 100, x: "-50%" }}
        transition={{ duration: 0.3 }}
      >
        <button
          className="button absolute z-[11] md:top-[10px] lg:top-[20px] lg:right-[30px] md:right-[10px]"
          onClick={onClose}
        >
          <IconClose />
        </button>
        <div className="absolute w-full h-full left-0 top-0 z-[10] lg:pt-[50px] md:pt-[34px] md:overflow-hidden">
          {
            isMobile ? (
              <IconBoycoTitle></IconBoycoTitle>
            ) : (
              <div
              className={clsx(
                gasoekOne.className,
                "boyco-title_250505",
                "text-[#392C1D] text-center font-normal leading-[90%] whitespace-nowrap"
              )}
            >
              BREAKING: BOYCO UNLOCK COMING ON 6TH OF MAY!
            </div>
            )
          }
          <div className="flex items-center justify-center gap-[10px] mt-[4px] px-[20px]">
            {/*<div className="grow h-[1px] bg-[#392C1D]" />*/}
            {/* <div
              className={clsx(
                "text-[#392C1D] text-[26px] font-bold md:text-[20px]",
                gasoekOne.className
              )}
            >
              Redeploy Your Assets to Earn up to &lt;x&gt; APY
            </div> */}
            {/*<div className="grow h-[1px] bg-[#392C1D]" />*/}
          </div>
          <div className="px-[40px] pt-[20px] pb-[10px] md:hidden">
            <div className="w-full h-[4px] bg-[#392C1D]"></div>
          </div>
          {
            isMobile ? (<div className="px-5 mt-[30px] text-[#392C1D] text-[20px] font-bold leading-[100%] shrink-0">
              Your Boyco Position
            </div>) : (
              <div className="flex justify-between gap-[20px] px-[40px] pt-[20px]">
                <div className="text-[#392C1D] text-[30px] font-bold leading-[100%] shrink-0">
                  Your Boyco Position
                </div>
                <ArrowIcon />
                <div className="text-[#392C1D] text-[30px] font-bold leading-[100%] text-start shrink-0">
                  Your Personalised Yield
                  <br /> Opportunities
                </div>
          </div>
            )
          }
          <div className="lg:px-[40px] md:px-[20px] lg:pt-[10px] md:w-full flex lg:flex-row md:flex-col lg:h-[calc(100%-250px)] md:h-[460px] md:max-h-[460px] overflow-x-hidden overflow-y-auto">
            <div className="md:w-full lg:w-1/2 lg:pl-[10px] lg:pr-[30px]">
              <Positions
                positions={positions}
                totalUsd={totalUsd}
                assets={assets}
                loading={loading}
              />
            </div>
            <div className="md:hidden w-[1px] h-[calc(100%_-_20px)] bg-[#392C1D] mt-[10px]" />
            <div className="lg:hidden flex flex-col items-center w-full gap-[10px] mt-[20px]">
              <IconBoycoArrow />
              <div className="text-[#392C1D] text-[20px] font-bold shrink-0">Your Personalised Yield Opportunities</div>
            </div>
            <div className="lg:w-1/2 lg:pl-[30px] lg:pr-[20px] md:w-full">
              <Vaults vaults={vaults} assets={assets} loading={loading} />
            </div>
            <div className="lg:hidden mt-[20px] flex items-center justify-center gap-2 flex-col">
              <div className="w-full h-[33px] bg-[url(/images/boyco/oppot.svg)] bg-no-repeat shrink-0"></div>
              <div className="p-4 text-center text-[#2B2B2B] font-semibold text-sm space-y-2">
                <div className="flex items-center justify-center">
                  {BERA_OPPORTUNITIES.slice(0,3).map((item, index) => (
                    <>
                      <div key={index} className="flex flex-col items-center mx-4">
                        <span className="uppercase text-xs">{item.label}</span>
                        <span className="text-lg font-bold">{item.value}%</span>
                      </div>
                      {index < 2 && <div className="h-[20px] bg-black w-px"></div>}
                    </>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  {BERA_OPPORTUNITIES.slice(3).map((item, index) => (
                    <>
                      <div key={index} className="flex flex-col items-center mx-4">
                        <span className="uppercase text-xs">{item.label}</span>
                        <span className="text-lg font-bold">{item.value}%</span>
                      </div>
                      {index < 1 && <div className="h-[20px] bg-black w-px"></div>}
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="pl-[50px] pr-[60px] w-full h-[35px] md:hidden">
                <div className="w-full h-full flex items-stretch border-t-[3px] border-b-[3px] border-[#392C1D]">
                  <img src="/images/boyco/opportunities.svg" alt="" className="w-[180px] h-full shrink-0 object-left object-contain" />
                  <div className="flex-1 w-0 flex items-center gap-[30px] overflow-x-auto pr-[10px]">
                    {
                      BERA_OPPORTUNITIES.map((it, idx) => (
                        <>
                          <div key={idx} className=" shrink-0 text-[#392C1D] font-Montserrat text-[13px] font-bold leading-[100%]">
                            {it.label} {it.value}%
                          </div>
                          {
                            idx < BERA_OPPORTUNITIES.length - 1 && (
                              <div className="w-[1px] h-[calc(100%_-_8px)] shrink-0 bg-[#392C1D]"></div>
                            )
                          }
                        </>
                      ))
                    }
                  </div>
                </div>
            </div>
        </div>
        <div className="absolute z-[5] w-full h-full bg-[url(/images/boyco/bg.png)] bg-no-repeat bg-center bg-cover" />
        <div className="md:hidden">
        {!isDefaultTheme() ? (
          <>
            <div className="absolute z-[2] bottom-[-58px] left-[-141px] w-[173px] h-[319px] bg-[url(/images/boyco/b-left-arm.png)] bg-no-repeat bg-center bg-cover" />
            <div className="absolute z-[2] bottom-[-100px] right-[-344px] w-[359px] h-[549px] bg-[url(/images/boyco/b-right-arm.png)] bg-no-repeat bg-center bg-cover" />
            <div className="absolute z-[12] bottom-[75px] left-[-29px] w-[61px] h-[176px] bg-[url(/images/boyco/b-left-finger.png)] bg-no-repeat bg-center bg-cover" />
            <div className="absolute z-[12] bottom-[243px] right-[-38px] w-[121px] h-[168px] bg-[url(/images/boyco/b-right-finger.png)] bg-no-repeat bg-center bg-cover" />
          </>
        ) : (
          <>
            <div className="absolute z-[2] bottom-[-58px] left-[-190px] w-[345px] h-[364px] bg-[url(/images/boyco/left-hand.png)] bg-no-repeat bg-center bg-cover" />
            <div className="absolute z-[2] bottom-[-100px] right-[-344px] w-[370px] h-[657px] bg-[url(/images/boyco/right-hand.png)] bg-no-repeat bg-center bg-cover" />
            <div className="absolute z-[12] bottom-[96px] left-[-92px] w-[157px] h-[148px] bg-[url(/images/boyco/left-paw.png)] bg-no-repeat bg-center bg-cover" />
            <div className="absolute z-[12] bottom-[334px] right-[-90px] w-[159px] h-[152px] bg-[url(/images/boyco/right-paw.png)] bg-no-repeat bg-center bg-cover" />
          </>
        )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
