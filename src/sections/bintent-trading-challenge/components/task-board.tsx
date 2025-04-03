import clsx from "clsx";
import { memo, useEffect, useMemo } from "react";
import useTask from "../hooks/use-task";
import Radio from "./radio";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";
import useIsMobile from "@/hooks/use-isMobile";
import useClickTracking from "@/hooks/use-click-tracking";


function VerifyButton({
  type,
  verify,
  loading,
  className,
  queryVerify,
}) {
  const { handleReport } = useClickTracking();
  const isMobile = useIsMobile()

  if (isMobile && verify?.[type]) {
    return <></>
  }
  return (
    <div className={className}>
      {
        loading?.[type] ? (
          <div
            className="opacity-50 w-full h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50]"
          ><Loading size={14} /></div>
        ) : verify?.[type] ? (
          <Radio checked />
        ) : (
          <div
            className="cursor-pointer w-full h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold"
            onClick={() => {
              handleReport("1023-007")
              queryVerify(type)
            }}
          >Verify</div>
        )
      }
    </div>
  )
}
export default memo(function TaskBoard() {
  const { handleReport } = useClickTracking();
  const isMobile = useIsMobile()
  const router = useRouter()
  const signArray = new Array(10).fill(null)
  const { task, loading, categoryLoading, categoryVerify, queryVerify } = useTask()
  const handleTradeNow = function () {
    router.push("/bintent")
  }

  return (
    <div className="md:m-[56px_0_65px] m-[182px_auto_69px] relative md:w-full w-[720px] md:h-[1085px] h-[836px] p-[12px] border-[2px] border-[#7F6C41] rounded-[10px] bg-[linear-gradient(180deg,_#D4A20C_0%,_#FFCC34_100%)]">
      <div className="absolute left-1/2 md:-top-[27px] -top-[39px] -translate-x-1/2 md:w-[235px] w-[379px] md:h-[59px] h-[77px] md:bg-[url('/images/campaign/mobile/task_board_bg.svg')] bg-[url('/images/campaign/task_board_bg.svg')] bg-cover bg-no-repeat bg-center flex items-center justify-center text-[#F7F9EA] text-stroke-2 font-CherryBomb md:text-[26px] text-[32px] uppercase">
        Task board
      </div>
      <div className="h-full md:p-[10px] p-[20px] md:rounded-[16px] rounded-[10px] border-[2px] border-[#E5C375] bg-[#FFF1C7]">
        <div className="md:mt-[90px] mt-[50px] relative flex flex-col rounded-[16px] bg-[#FFFAEA] border border-[#D7C69D]">
          <div className="absolute md:-left-[8px] -left-[10px] md:-top-[66px] -top-[45px] md:w-[330px] w-[448px]">
            <img src={isMobile ? "/images/campaign/mobile/bookmark_3.svg" : "/images/campaign/bookmark_3.svg"} alt="bookmark_3" />
          </div>
          <div className="md:p-[19px_0_39px_13px] p-[12px_12px_8px_20px] flex items-center justify-between">
            <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Earn multipliers through consecutive check-ins </span>
            <div data-bp="1023-006" className="cursor-pointer md:hidden w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold" onClick={handleTradeNow}>Trade Now</div>
          </div>

          <div className="md:p-[0_15px_50px] p-[38px_16px_21px] md:border-0 border-t border-[#D7C69D] flex items-center md:flex-wrap gap-[16px]">
            {
              signArray.map((_, index) => (
                <div className="relative">
                  <div className={clsx("w-[48px] h-[48px] rounded-[12px] border-2 flex items-center justify-center text-black font-CherryBomb text-[18px]", index < task?.trade_days ? "border-[#AF7026] bg-[#FFCF23] border-solid" : "border-[#D7D7D7] border-dashed bg-[#EFEFE9]")}>{index + 1}</div>
                  {
                    (index === 4 || index === 9) && (isMobile ? (
                      <div className={clsx("absolute w-[64px] left-1/2 -translate-x-1/2 ", index === 9 ? "top-[40px]" : "-top-[35px]")}>
                        <img src={`/images/campaign/mobile/${index === 4 ? "1.2" : "1.5"}_multiple.svg`} alt={index === 4 ? "1.2" : "1.5" + "_multiple"} />
                      </div>
                    ) : (
                      <div className="absolute top-0 w-[64px] left-1/2 -translate-x-1/2 -translate-y-[100%]">
                        <img src={`/images/campaign/${index === 4 ? "1.2" : "1.5"}_multiple.svg`} alt={index === 4 ? "1.2" : "1.5" + "_multiple"} />
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
          <div data-bp="1023-006" className="cursor-pointer md:flex hidden m-[0_auto_17px] w-[302px] h-[36px] items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold" onClick={handleTradeNow}>Trade Now</div>
        </div>
        <div className="mt-[60px] relative flex flex-col md:rounded-none rounded-[16px] md:bg-transparent bg-[#FFFAEA] md:border-0 border border-[#D7C69D]">
          <div className="absolute -left-[10px] -top-[54px] w-[358px]">
            <img src="/images/campaign/bookmark_4.png" alt="bookmark_4" />
          </div>
          <div className="md:mb-[10px] md:rounded-[16px] md:bg-[#FFFAEA] md:border md:border-[#D7C69D]">
            <div className="md:p-[23px_5px_15px_13px] p-[12px_12px_8px_20px] flex items-center gap-[8px] justify-between">
              <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Meet any of the following for a x1.2 boost</span>
              {
                isMobile && categoryVerify?.["boost1.2"] ? (
                  <Radio checked />
                ) : (
                  <VerifyButton className="md:hidden flex justify-end w-[121px]" type="boost1.2" loading={categoryLoading} verify={categoryVerify} queryVerify={queryVerify} />
                )
              }
            </div>
            <div className="md:p-[0_8px_16px] p-[22px_36px] md:border-0 border-y border-[#D7C69D]">
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://magiceden.io/collections/berachain/steady-teddys-9" target="_blank">Steady Teddy NFT</a>
              </div>
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://dexscreener.com/berachain/0xcb42b9d09d8da230d0390728c6f236511fac403b" target="_blank">$Henlo</a>
              </div>

              <VerifyButton className="m-[14px_auto_0] md:flex w-[302px] hidden" type="boost1.2" loading={categoryLoading} verify={categoryVerify} queryVerify={queryVerify} />
            </div>
          </div>
          <div className="md:rounded-[16px] md:bg-[#FFFAEA] md:border md:border-[#D7C69D]">
            <div className="md:p-[11px_5px_15px_13px] p-[12px_12px_8px_20px] flex items-center gap-[8px] justify-between">
              <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Meet any of the following for a x1.1 boost</span>
              {
                isMobile && categoryVerify?.["boost1.1"] ? (
                  <Radio checked />
                ) : (
                  <VerifyButton className="md:hidden  flex justify-end w-[121px]" type="boost1.1" loading={categoryLoading} verify={categoryVerify} queryVerify={queryVerify} />
                )
              }
            </div>
            <div className="md:p-[0_8px_16px] p-[22px_36px] md:border-0 border-t border-[#D7C69D]">
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://magiceden.io/collections/berachain/thc-20" target="_blank">THC NFT</a>
              </div>
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://magiceden.io/collections/berachain/0x333814f5e16eee61d0c0b03a5b6abbd424b381c2" target="_blank">Bullas NFT</a>
              </div>
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://magiceden.io/collections/berachain/0xa6b1948b42ea485c391730bb721d9f2001ebe504" target="_blank">Yeet NFT</a>
              </div>
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://magiceden.io/collections/berachain/0xac59f7e7e5da0dc4f416a7aeff7a49ac284f10ca" target="_blank">Hungry Bera NFT</a>
              </div>
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://marketplace.kingdomly.app/collection/berachain/0xe8b2acb4553acddf33214749751906dff5887701" target="_blank">Deek NFT</a>
              </div>
              <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                Holders of <a className="underline" href="https://berascan.com/token/0xbba3eac9ab7cbcaaef36f239f029a56c28ee7d33" target="_blank">BeraBaddies</a>
              </div>
              <div className="flex gap-[6px] before:w-[8px] before:h-[8px] before:mt-[9px] before:rounded-full before:bg-black md:text-[16px] text-[20px] md:font-Montserrat font-CherryBomb md:font-semibold text-black md:leading-[150%] leading-[120%]">
                {
                  isMobile ? (
                    <>
                      Holders of <br />$GEAR\$LONK\$SHITZU\<br />$BLACKDRAGON\$REF
                    </>
                  ) : (
                    <>
                      Holders of <br />$GEAR\$LONK\$SHITZU\$BLACKDRAGON\$REF
                    </>
                  )
                }
              </div>

              <VerifyButton className="m-[14px_auto_0] md:flex w-[302px] hidden" type="boost1.1" loading={categoryLoading} verify={categoryVerify} queryVerify={queryVerify} />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
})
