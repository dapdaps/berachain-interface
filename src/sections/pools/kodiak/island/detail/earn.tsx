import clsx from "clsx";
import Button from "@/components/button";
import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import useClaim from "../hooks/use-claim";
import { useMemo } from "react";

export default function Earn({ earned, farm, onSuccess }: any) {
  const totalEarned = useMemo(() => {
    if (!earned?.length) return Big(0);
    return earned.reduce((acc: any, curr: any) => acc.add(curr || 0), Big(0));
  }, [earned]);

  const { loading, onClaim } = useClaim({
    earned,
    farm,
    onSuccess
  });

  return (
    <div
      className={clsx(
        "rounded-[10px] w-[440px] min-h-[86px] bg-black/5 relative px-[16px] mt-[20px] py-[18px]",
        "md:w-full md:mt-[12px] md:rounded-[20px] md:bg-[#FFFDEB] md:border md:border-black md:p-[10px]"
      )}
    >
      {totalEarned.eq(0) && (
        <div className="absolute left-0 top-0 h-full w-full flex justify-center items-center text-[14px] font-medium">
          <div className="w-[190px] text-center">
            Deposit and stake liquidity to earn extra rewards
          </div>
        </div>
      )}
      <div className={clsx(totalEarned.eq(0) && "blur")}>
        <div className="text-[16px] font-semibold">Earned</div>
        {farm?.rewardTokens?.map((rewardToken: any, i: number) => (
          <div
            className="flex items-start justify-between mt-[10px]"
            key={rewardToken.id}
          >
            <div className="flex items-center gap-[9px]">
              <img
                src={rewardToken.icon}
                alt={rewardToken.symbol}
                width={26}
                height={26}
                className="rounded-full"
              />
              <div className="font-semibold text-[14px]">
                {rewardToken.symbol}
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-[14px]">
                {earned?.[i] ? balanceFormated(earned[i], 4) : "-"}
              </div>
              {/* <div className="font-medium text-[12px]">0.46 KODIAK-1</div> */}
            </div>
          </div>
        ))}
        {totalEarned.gt(0) && (
          <div className="flex justify-end mt-[12px]">
            <Button
              className="w-[96px] h-[36px] flex justify-center items-center"
              type="primary"
              loading={loading}
              isOnlyLoading
              onClick={onClaim}
            >
              Claim
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
