import useUserPoints from "@/hooks/use-user-points";
import IbgtRewards from "@/sections/bgt/components/ibgt-rewards";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import { memo, useMemo } from "react";
export default memo(function InfraredTop() {
  const { dataList, loading, fetchAllData: reload } = useInfraredList();
  const { userPoints } = useUserPoints()
  const rewards = useMemo(() => dataList?.filter(data => Big(data?.earned ?? 0).gt(0)), [dataList])

  return (
    <div className="px-[30px] pb-[23px] flex items-center justify-between">

      <div className="flex flex-col gap-[8px]">
        <div className="">Rewards</div>
        <div className="h-[40px]">
          {
            rewards?.length > 0 ? (
              <IbgtRewards rewards={rewards} onSuccess={reload} />
            ) : (
              <>-</>
            )
          }
        </div>
      </div>
      <div className="flex gap-[60px] text-black font-Montserrat text-[16px] font-medium leading-[100%]">
        <div className="flex flex-col gap-[8px]">
          <span className="font-normal">Points</span>
          <span className="leading-[40px]">{Big(userPoints?.points ?? 0).toFixed(0)}</span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <span className="font-normal">24hr change</span>
          <div className="flex items-center text-[#00830b]">
            <svg class="size-3" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8l256 0c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z"></path></svg>
            <span className="leading-[40px]">{numberFormatter(Big(userPoints?.change_24h_percent ?? 0).times(100).toFixed(), 2, true,)}%</span>
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          <span className="font-normal">Rank</span>
          <span className="leading-[40px]">{userPoints?.rank}</span>
        </div>
      </div>
    </div>
  )
})
