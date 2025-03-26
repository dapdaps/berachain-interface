import useIsMobile from "@/hooks/use-isMobile"
import { Token } from "@/types"
import clsx from "clsx"
import { memo } from "react"

export default memo(function TokenCard({
  token,
  className,

}: {
  token: Token,
  className: string
}) {
  const comingSoon = false
  return (

    <div className="relative md:w-full w-[calc((100%_-_42px)_/_3)]">
      <div className={clsx("h-[270px] rounded-[20px] bg-[#FFFDEB] border border-black drop-shadow-[10px_10px_0px_rgba(0,0,0,0.25]", comingSoon ? "blur-[10px]" : "")}>
        <div className="p-[24px_24px_30px] flex items-center gap-[10px]">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden"></div>
          <div className="flex flex-col gap-[8px]">
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[100%]">UniBTC</div>
            <div className="flex items-center gap-[3px]">
              <div className="w-[16px] h-[16px]"></div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">Bedrock</div>
            </div>
          </div>
        </div>
        <div className="px-[20px]">
          <div className="mb-[30px] flex items-start justify-between">
            <div className="flex flex-col gap-[7px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">TVL</div>
              <div className="flex items-center gap-[3px]">
                <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">4.29K</div>
                <div className="w-[16px]"></div>
              </div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">$1.12B</div>
            </div>

            <div className="flex flex-col gap-[7px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">APY</div>
              <div className="text-[#72A807] font-Montserrat text-[16px] font-semibold leading-[100%]">4.29K</div>
            </div>

            <div className="flex flex-col gap-[7px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Your Staked</div>
              <div className="flex items-center gap-[3px]">
                <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">0.3512</div>
                <div className="w-[16px]"></div>
              </div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">$1.12B</div>
            </div>
          </div>
          <div className="flex items-center gap-[10px]">
            <div
              className="cursor-pointer flex items-center justify-center flex-1 h-[50px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[16px] font-semibold"
            >
              Stake
            </div>
            <div className="cursor-pointer flex items-center justify-center flex-1 h-[50px] rounded-[10px] border border-black bg-white text-black font-Montserrat text-[16px] font-semibold">
              Unstake
            </div>
          </div>
        </div>
      </div>
      {
        comingSoon && (
          <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex items-center justify-center text-black font-Montserrat text-[16px] font-semibold">Coming soon</div>
        )
      }
    </div>

  )
})
