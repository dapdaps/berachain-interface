import { balanceFormated } from "@/utils/balance";
import Item from "../../actions/stake-item";
import { useMemo, useState } from "react";
import { remove, uniq } from "lodash";
import Big from "big.js";
import Button from "@/components/button";
import useUnstake from "../../../hooks/use-unstake";

export default function SelectPanel({
  amount,
  amount0,
  amount1,
  info,
  data,
  onSuccess
}: any) {
  const [unstakedAmount, setUnstakedAmount] = useState("");
  const [kekIds, setKekIds] = useState<any>([]);
  const [stakedAmounts, setStakedAmounts] = useState<any>({});
  const { loading, onUnstake } = useUnstake({
    farmContract: data.farmAddress,
    kekIds,
    token: { symbol: data.symbol },
    amount: unstakedAmount,
    onSuccess: () => {
      onSuccess({
        amount: Big(amount).add(unstakedAmount).toString(),
        amount0: Big(amount0).add(stakedAmounts.amount0).toString(),
        amount1: Big(amount0).add(stakedAmounts.amount1).toString()
      });
    }
  });

  const list = useMemo(() => {
    const _list = info.locked?.items.filter((item: any) => {
      return item.unlocked;
    });
    return _list || [];
  }, [info]);
  const onSelect = (item: any) => {
    const id = item.kek_id;
    let a0 = Big(stakedAmounts.amount0 || 0);
    let a1 = Big(stakedAmounts.amount1 || 0);
    let _amount = Big(amount || 0);
    if (kekIds.includes(id)) {
      remove(kekIds, (i) => i === id);
      a0 = a0.minus(item.amount0);
      a1 = a1.minus(item.amount1);
      _amount = _amount.minus(item.liquidity);
    } else {
      kekIds.push(id);
      a0 = a0.add(item.amount0);
      a1 = a1.add(item.amount1);
      _amount = _amount.add(item.liquidity);
    }
    setStakedAmounts({
      amount0: a0.toString(),
      amount1: a1.toString()
    });
    setKekIds(uniq(kekIds));
    setUnstakedAmount(_amount.div(1e18).toString());
  };

  const errorTips = useMemo(
    () =>
      Big(info.balance).eq(0) && kekIds.length === 0
        ? "Insufficient liquidity"
        : "",
    [info, kekIds]
  );

  return (
    <>
      {list.map((item: any) => (
        <Item
          key={item.kek_id}
          token0={data.token0}
          token1={data.token1}
          item={item}
          onClick={onSelect}
          active={kekIds.includes(item.kek_id)}
        />
      ))}
      <div className="mt-[10px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Withdraw from Staking
          </div>
          <div className="text-[14px] font-medium">
            {balanceFormated(stakedAmounts.amount0, 4)}
            {data.token0.symbol}/{balanceFormated(stakedAmounts.amount1, 4)}
            {data.token1.symbol}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Withdraw from Island
          </div>
          <div className="text-[14px] font-medium">
            {balanceFormated(amount0, 4)}
            {data.token0.symbol}/{balanceFormated(amount1, 4)}
            {data.token1.symbol}
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          if (kekIds.length === 0) {
            onSuccess({ amount, amount0, amount1 });
          } else {
            onUnstake();
          }
        }}
        loading={loading}
        disabled={!!errorTips}
      >
        {errorTips || "Unstake"}
      </Button>
    </>
  );
}
