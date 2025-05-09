import useUserPoints from "@/hooks/use-user-points";
import IbgtRewards from "@/sections/bgt/components/ibgt-rewards";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import clsx from "clsx";
import { memo, useEffect, useMemo } from "react";
export default memo(function InfraredTop({
  hiddenRewards,
  pointsClass
}: {
  hiddenRewards?: boolean
  pointsClass?: string
}) {
  const { dataList, loading, fetchAllData: reload } = useInfraredList();
  const { userPoints } = useUserPoints()
  const pools = useMemo(() => dataList?.filter(data => data?.rewards?.length > 0), [dataList])

  return (
    <div className="md:px-[10px] px-[30px] md:pb-0 md:pt-[15px] pb-[23px] flex items-center justify-between md:flex-col">
      {
        !hiddenRewards && (
          <div className="flex flex-col gap-[8px] md:w-full md:p-[11px_20px_13px] md:rounded-[20px] md:bg-[#FFFDEB] md:border md:border-black">
            <div className="">Rewards</div>
            <div className="md:h-[32px] h-[40px]">
              {
                pools?.length > 0 ? (
                  <IbgtRewards pools={pools} onSuccess={reload} />
                ) : (
                  <>-</>
                )
              }
            </div>
          </div>
        )
      }
      <div className={clsx("flex md:justify-between gap-[60px] text-black font-Montserrat md:text-[14px] text-[16px] font-medium leading-[100%] md:w-full md:text-white md:p-[11px_20px_13px] md:rounded-[10px] md:bg-black/50", pointsClass)}>
        <div className="flex flex-col gap-[8px]">
          <span className="font-normal">Points</span>
          <span className="leading-[40px] md:leading-[100%]">{Big(userPoints?.points ?? 0).toFixed(0)}</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <span className="font-normal">24hr change</span>
          <div className="flex items-center text-[#00830b]">
            <svg class="size-3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"></path></svg>
            <span className="leading-[40px] md:leading-[100%]">{numberFormatter(Big(userPoints?.change_24h_percent ?? 0).times(100).toFixed(), 2, true,)}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <span className="font-normal">Rank</span>
          <span className="leading-[40px] md:leading-[100%]">{userPoints?.rank}</span>
        </div>
      </div>
    </div>
  )
})
