import useIsMobile from "@/hooks/use-isMobile"
import { Token } from "@/types"
import clsx from "clsx"
import { memo } from "react"
import { LstHookResult } from "../../constant"
import { balanceShortFormated } from "@/utils/balance"

export default memo(function TokenCard({
  item,
  className,
  onClick
}: {
  item: any,
  className?: string
  onClick: () => void
}) {

  return (

    <div className="relative md:w-full w-[calc((100%_-_42px)_/_3)]">
      <div className={clsx("h-[270px] rounded-[20px] bg-[#FFFDEB] border border-black drop-shadow-[10px_10px_0px_rgba(0,0,0,0.25]", item.disabled ? "blur-[10px]" : "")}>
        <div className="p-[24px_24px_30px] flex items-center gap-[10px]">
          <img src={item?.targetToken?.icon || item?.sourceToken?.icon} className="w-[60px] h-[60px] rounded-full overflow-hidden"></img>
          <div className="flex flex-col gap-[8px]">
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[100%]">{item?.targetToken?.symbol || '-'}</div>
            <div className="flex items-center gap-[3px]">
              <img src={item.dappIcon} className="w-[16px] h-[16px]"></img>
                <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</div>
            </div>
          </div>
        </div>
        <div className="px-[20px]">
          <div className="mb-[30px] flex items-start justify-between">
            <div className="flex flex-col gap-[7px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">TVL</div>
              <div className="flex items-center gap-[3px]">
                <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">{balanceShortFormated(item.tvl)}</div>
                <div className="w-[16px]"></div>
              </div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">${balanceShortFormated(item.tvlUsd)}</div>
            </div>

            <div className="flex flex-col gap-[7px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">APY</div>
              <div className="text-[#72A807] font-Montserrat text-[16px] font-semibold leading-[100%]">{item.apy}</div>
            </div>

            <div className="flex flex-col gap-[7px]">
              <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Your Staked</div>
              <div className="flex items-center gap-[3px]">
                <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">{balanceShortFormated(item.stakedAmount)}</div>
                <div className="w-[16px]"></div>
              </div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">${balanceShortFormated(item.stakedAmountUsd)}</div>
            </div>
          </div>
          <div className="flex items-center gap-[10px]" onClick={() => {
            
          }}>
            <div
              onClick={onClick}
              className="cursor-pointer flex items-center justify-center flex-1 h-[50px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[16px] font-semibold"
            >
              Stake
            </div>
          </div>
        </div>
      </div>
      {
        item.disabled && (
          <div className="absolute left-0 right-0 top-0 bottom-0 z-10 flex items-center justify-center text-black font-Montserrat text-[16px] font-semibold">Coming soon</div>
        )
      }
    </div>

  )
})
