import Card from "@/components/card"
import CircleLoading from "@/components/circle-loading"
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover"
import { numberFormatter } from "@/utils/number-formatter"
import Big from "big.js"
import { memo, useMemo } from "react"

export default memo(function InfaredRewards({
  rewards,
  claiming,
  handleClaim
}: {
  rewards: any
  claiming: boolean,
  handleClaim: VoidFunction
}) {
  const usdEarned = useMemo(() => {
    let count = 0
    rewards?.forEach(reward => {
      count = Big(count).plus(Big(reward?.earned).times(reward?.price))
    })
    return count
  }, [rewards])

  return (
    <div className="flex flex-col gap-[27px] md:gap-[7px]">
      <div className="text-black font-Montserrat text-[18px] md:text-[14px] font-bold md:font-normal leading-[90%]">
        Rewards
      </div>
      <div className="flex items-center md:flex-col md:gap-[7px] justify-between">
        <Popover
          trigger={PopoverTrigger.Hover}
          placement={PopoverPlacement.Bottom}
          content={(
            <Card>
              <div className="w-[260px] flex flex-col gap-[16px]">
                {
                  rewards?.map(reward => (
                    <div className="flex items-center justify-between font-medium">
                      <div className="flex items-center gap-[8px]">
                        <div className="w-[24px]">
                          <img src={reward?.image} alt={reward?.symbol} />
                        </div>
                        <div>{reward?.symbol}</div>
                      </div>
                      <div className="flex items-center gap-[8px]">
                        <span>{numberFormatter(reward?.earned, 2, true)}</span>
                        <span>({numberFormatter(Big(reward?.earned).times(reward?.price), 2, true, { isShort: true, prefix: "$" })})</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          )}
        >
          <div className="flex items-center gap-[14px] cursor-pointer">
            <div className="flex items-center">
              {
                rewards?.map((reward, index) => (
                  <div className="w-[32px] h-[32px] rounded-full" style={{ objectPosition: "left center", marginLeft: -10 * index }}>
                    <img
                      src={reward?.image}
                    />
                  </div>
                ))
              }
            </div>
            <div className="underline text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
              {numberFormatter(usdEarned, 2, true, { isShort: true, prefix: "$" })}
            </div>
          </div>
        </Popover>
        {Big(usdEarned ?? 0).gt(0) && (
          <button
            disabled={claiming}
            className="cursor-pointer flex items-center justify-center w-[148px] h-[46px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[18px] font-semibold leading-[90%] disabled:opacity-30"
            onClick={handleClaim}
          >
            {claiming ? <CircleLoading size={14} className="mr-3" /> : ""}{" "}
            Claim
          </button>
        )}
      </div>
    </div>
  )
})
