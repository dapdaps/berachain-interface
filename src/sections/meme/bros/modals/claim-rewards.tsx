import Basic from "./basic";
import Image from "next/image";
import Button from "@/components/button";
import useClaim from "../hooks/use-claim";
import { useEffect, useMemo } from "react";
import Loading from "@/components/loading";
import Big from "big.js";
import { balanceFormated } from "@/utils/balance";

export default function ClaimRewards({ data, open, onClose, onSuccess }: any) {
  const { loading, claiming, info, onQuery, onClaim } = useClaim({
    data,
    onSuccess
  });

  const cachedRewardTokens = useMemo(
    () =>
      data.rewardTokens?.length
        ? data.rewardTokens?.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.address]: curr
            }),
            {}
          )
        : {},
    [data.rewardTokens]
  );

  useEffect(() => {
    if (open) onQuery();
  }, [open]);

  return (
    <Basic open={open} onClose={onClose}>
      <div className="text-[20px] font-bold">Claim Rewards</div>
      {loading ? (
        <div className="flex items-center justify-center pt-[30px]">
          <Loading size={30} />
        </div>
      ) : (
        info?.tokens.map((add: any, i: number) => {
          const token = cachedRewardTokens[add];
          const amount = Big(info.amounts[i])
            .div(10 ** token.decimals)
            .toString();
          return (
            <div className="mt-[19px] flex items-center text-[16px] font-semibold gap-[10px]">
              <div className="flex items-center shrink-0 gap-[10px]">
                <Image
                  src={token.logo}
                  width={26}
                  height={26}
                  alt={token.symbol}
                  className="rounded-full"
                />
                <div>{token.symbol}</div>
              </div>
              <div className="grow border-b border-dashed border-[#160705]/10" />
              <div className="shrink-0">{balanceFormated(amount, 3)}</div>
            </div>
          );
        })
      )}

      <Button
        type="primary"
        className="w-full h-[60px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
        loading={claiming}
        onClick={onClaim}
        isOnlyLoading={true}
      >
        Claim
      </Button>
    </Basic>
  );
}
