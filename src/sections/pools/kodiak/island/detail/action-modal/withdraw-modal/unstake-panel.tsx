import { balanceFormated } from "@/utils/balance";
import { useMemo } from "react";
import Big from "big.js";
import Button from "@/components/button";
import useUnstake from "../../../hooks/use-unstake";

export default function UnstakePanel({
  data,
  selectedItems = [],
  info,
  onSuccess
}: any) {
  const [kekIds, amount, amount0, amount1] = useMemo(() => {
    let _a = Big(0);
    let _a0 = Big(0);
    let _a1 = Big(0);
    const _ids = selectedItems.map((item: any) => {
      _a = _a.add(item.liquidity);
      _a0 = _a0.add(item.amount0);
      _a1 = _a1.add(item.amount1);
      return item.kek_id;
    });
    return [_ids, _a.div(1e18).toString(), _a0.toString(), _a1.toString()];
  }, [selectedItems]);
  const { loading, onUnstake } = useUnstake({
    farmContract: data.farm?.id,
    kekIds,
    token: { symbol: data.symbol },
    amount,
    amount0,
    amount1,
    data,
    onSuccess
  });

  return (
    <>
      <div className="mt-[10px] rounded-[12px] border border-[#373A53] p-[12px]">
        {selectedItems.map((item: any) => (
          <div
            className="flex items-center justify-between mt-[6px]"
            key={item.kek_id}
          >
            <div className="flex items-center">
              <img
                src={data.token0.icon}
                alt={data.token0.name}
                width={26}
                height={26}
                className="rounded-full"
              />
              <img
                src={data.token1.icon}
                alt={data.token1.name}
                width={26}
                height={26}
                className="rounded-full ml-[-8px]"
              />
              <div className="font-semibold ml-[8px]">
                {data.token0.symbol}-{data.token1.symbol}
              </div>
            </div>
            <div className="font-semibold">
              {balanceFormated(Big(item.liquidity).div(1e18).toString())}{" "}
              {data.symbol}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-[10px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="text-[14px] text-black/50">
          You will also unlock the following tokens as rewards
        </div>
        {data.farm?.rewardTokens?.map((rewardToken: any, i: number) => (
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
                {info?.earned?.[i] ? balanceFormated(info.earned[i], 4) : "-"}
              </div>
              {/* <div className="font-medium text-[12px]">0.46 KODIAK-1</div> */}
            </div>
          </div>
        ))}
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          if (kekIds.length === 0) {
            onSuccess();
          } else {
            onUnstake();
          }
        }}
        loading={loading}
      >
        Unstake
      </Button>
    </>
  );
}
