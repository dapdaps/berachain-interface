import clsx from "clsx";
import { memo, useEffect, useMemo } from "react";
import useTask from "../hooks/use-task";
import Radio from "./radio";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading";

export default memo(function TaskBoard() {
  const router = useRouter()
  const signArray = new Array(10).fill(null)
  const { task, loading, categoryLoading, categoryVerify, queryVerify } = useTask()
  const handleTradeNow = function () {
    router.push("/bintent")
  }

  return (
    <div className="m-[182px_auto_69px] relative w-[720px] h-[1176px] p-[12px] border-[2px] border-[#7F6C41] rounded-[10px] bg-[linear-gradient(180deg,_#D4A20C_0%,_#FFCC34_100%)]">
      <div className="absolute left-1/2 -top-[39px] -translate-x-1/2 w-[379px] h-[77px] bg-[url('/images/campaign/task_board_bg.svg')] bg-no-repeat bg-center flex items-center justify-center text-[#F7F9EA] text-stroke-2 font-CherryBomb text-[32px] uppercase">
        Task board
      </div>
      <div className="h-full p-[20px] rounded-[10px] border-[2px] border-[#E5C375] bg-[#FFF1C7]">
        <div className="flex flex-col gap-[5px]">
          <div className="relative flex justify-end">
            <div className="absolute -left-[10px] -bottom-[16.84px] w-[220px]">
              <img src="/images/campaign/bookmark_1.svg" alt="bookmark_1" />
            </div>
            <div className="cursor-pointer w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold" onClick={handleTradeNow}>Trade Now</div>
          </div>
          <div className="flex items-center justify-between px-[20px]  h-[68px] rounded-[16px] bg-[#FFFAEA] border border-[#D7C69D] ">
            <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Execute transactions on the first day</span>
            <div className="flex items-center gap-[11px]">
              <span className="text-black font-CherryBomb text-[18px] leading-[120%]">$10</span>
              <Radio checked={task?.quests?.includes("firstDay")} />
            </div>
          </div>
        </div>
        <div className="m-[25px_0_60px] flex flex-col gap-[5px]">
          <div className="relative flex justify-end">
            <div className="absolute -left-[10px] -bottom-[16.84px] w-[298px]">
              <img src="/images/campaign/bookmark_2.svg" alt="bookmark_1" />
            </div>
            <div className="cursor-pointer w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold" onClick={handleTradeNow}>Trade Now</div>
          </div>
          <div className="flex flex-col rounded-[16px] bg-[#FFFAEA] border border-[#D7C69D]">
            <div className="flex items-center justify-between px-[20px] h-[56px]">
              <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Trade across 3 pairs</span>
              <div className="flex items-center gap-[11px]">
                <span className="text-black font-CherryBomb text-[18px] leading-[120%]">$5</span>
                <Radio checked={task?.quests?.includes("dailyAcrossPairs")} />
              </div>
            </div>

            <div className="border-y border-[#D7C69D] flex items-center justify-between px-[20px] h-[56px]">
              <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Execute an intent trade in the first hour</span>
              <div className="flex items-center gap-[11px]">
                <span className="text-black font-CherryBomb text-[18px] leading-[120%]">$10</span>
                <Radio checked={task?.quests?.includes("dailyFirstHour")} />
              </div>
            </div>

            <div className="flex items-center justify-between px-[20px] h-[56px]">
              <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Execute 5 trades at a better price than Shogun</span>
              <div className="flex items-center gap-[11px]">
                <span className="text-black font-CherryBomb text-[18px] leading-[120%]">$5</span>
                <Radio checked={task?.quests?.includes("dailyTransactions")} />
              </div>
            </div>

          </div>
        </div>

        <div className="relative flex flex-col rounded-[16px] bg-[#FFFAEA] border border-[#D7C69D]">
          <div className="absolute -left-[10px] -top-[45px] w-[448px]">
            <img src="/images/campaign/bookmark_3.svg" alt="bookmark_3" />
          </div>
          <div className="p-[12px_12px_8px_20px] flex items-center justify-between">
            <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Earn multipliers through consecutive check-ins </span>
            <div className="cursor-pointer w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold" onClick={handleTradeNow}>Trade Now</div>
          </div>

          <div className="p-[38px_16px_21px] border-t border-[#D7C69D] flex items-center gap-[16px]">
            {
              signArray.map((_, index) => (
                <div className="relative">
                  <div className={clsx("w-[48px] h-[48px] rounded-[12px] border-2 flex items-center justify-center text-black font-CherryBomb text-[18px]", index < task?.trade_days ? "border-[#AF7026] bg-[#FFCF23] border-solid" : "border-[#D7D7D7] border-dashed bg-[#EFEFE9]")}>{index + 1}</div>
                  {
                    (index === 4 || index === 9) && (
                      <div className="absolute w-[64px] left-1/2 top-0 -translate-x-1/2 -translate-y-[100%]">
                        <img src={`/images/campaign/${index === 4 ? "1.2" : "1.5"}_multiple.svg`} alt={index === 4 ? "1.2" : "1.5" + "_multiple"} />
                      </div>
                    )
                  }

                </div>
              ))
            }
          </div>
        </div>
        <div className="mt-[60px] relative flex flex-col rounded-[16px] bg-[#FFFAEA] border border-[#D7C69D]">
          <div className="absolute -left-[10px] -top-[54px] w-[358px]">
            <img src="/images/campaign/bookmark_4.png" alt="bookmark_4" />
          </div>
          <div className="p-[12px_12px_8px_20px] flex items-center justify-between">
            <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Meet any of the following for a x1.2 boost</span>
            {
              categoryLoading["boost1.2"] ? (
                <div
                  className="opacity-50 w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50]"
                ><Loading size={14} /></div>
              ) : categoryVerify["boost1.2"] ? (
                <Radio checked />
              ) : (
                <div
                  className="cursor-pointer w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold"
                  onClick={() => {
                    queryVerify("boost1.2")
                  }}
                >Verify</div>
              )
            }
          </div>

          <div className="p-[22px_36px] border-y border-[#D7C69D]">
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://magiceden.io/collections/berachain/steady-teddys-9" target="_blank">Steady Teddy NFT</a>
            </div>
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://dexscreener.com/berachain/0xcb42b9d09d8da230d0390728c6f236511fac403b" target="_blank">$Henlo</a>
            </div>
          </div>

          <div className="p-[12px_12px_8px_20px] flex items-center justify-between">
            <span className="text-black font-CherryBomb text-[20px] leading-[120%]">Meet any of the following for a x1.1 boost</span>
            {
              categoryLoading["boost1.1"] ? (
                <div
                  className="opacity-50 w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50]"
                ><Loading size={14} /></div>
              ) : categoryVerify["boost1.2"] ? (
                <Radio checked />
              ) : (
                <div
                  className="cursor-pointer w-[121px] h-[36px] flex items-center justify-center rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[14px] font-semibold"
                  onClick={() => {
                    queryVerify("boost1.1")
                  }}
                >Verify</div>
              )
            }
          </div>

          <div className="p-[22px_36px] border-t border-[#D7C69D]">
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://magiceden.io/collections/berachain/thc-20" target="_blank">THC NFT</a>
            </div>
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://magiceden.io/collections/berachain/0x333814f5e16eee61d0c0b03a5b6abbd424b381c2" target="_blank">Bullas NFT</a>
            </div>
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://magiceden.io/collections/berachain/0xa6b1948b42ea485c391730bb721d9f2001ebe504" target="_blank">Yeet NFT</a>
            </div>
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://magiceden.io/collections/berachain/0xac59f7e7e5da0dc4f416a7aeff7a49ac284f10ca" target="_blank">Hungry Bera NFT</a>
            </div>
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://marketplace.kingdomly.app/collection/berachain/0xe8b2acb4553acddf33214749751906dff5887701" target="_blank">Deek NFT</a>
            </div>
            <div className="flex items-center gap-[6px] before:w-[8px] before:h-[8px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <a className="underline" href="https://berascan.com/token/0xbba3eac9ab7cbcaaef36f239f029a56c28ee7d33" target="_blank">BeraBaddies NFT</a>
            </div>
            <div className="flex gap-[6px] before:w-[8px] before:h-[8px] before:mt-[9px] before:rounded-full before:bg-black text-[20px] font-CherryBomb text-black leading-[120%]">
              Holders of <br />$GEAR\$LONK\$SHITZU\$BLACKDRAGON\$REF
            </div>
          </div>
          {/* <div className="p-[17px_0_20px_20px] text-black font-CherryBomb text-[20px] leading-[120%]">Degen trading night xx </div> */}
        </div>
      </div>
    </div>
  )
})
