import { balanceFormated } from "@/utils/balance";
import Item from "../../actions/stake-item";
import { useMemo, useState } from "react";
import { remove, uniq } from "lodash";
import Big from "big.js";
import Button from "@/components/button";

export default function SelectPanel({
  amount,
  amount0,
  amount1,
  info,
  data,
  percent,
  onSuccess
}: any) {
  const [kekIds, setKekIds] = useState<any>([]);
  const [stakedAmounts, setStakedAmounts] = useState<any>({});

  const list = useMemo(() => {
    const _list = info.locked?.items.filter((item: any) => {
      return item.unlocked;
    });
    if (!_list) return [];
    let a0 = Big(0);
    let a1 = Big(0);
    let _amount = Big(0);
    const _ids = _list.map((item: any) => {
      a0 = a0.add(item.amount0);
      a1 = a1.add(item.amount1);
      _amount = _amount.add(item.liquidity);
      return item.kek_id;
    });
    setStakedAmounts({
      amount0: a0.toString(),
      amount1: a1.toString(),
      amount: _amount.div(1e18).toString()
    });
    setKekIds(_ids);
    return _list || [];
  }, [info]);
  const onSelect = (item: any) => {
    const id = item.kek_id;
    let a0 = Big(stakedAmounts.amount0 || 0);
    let a1 = Big(stakedAmounts.amount1 || 0);
    let _amount = Big(stakedAmounts.amount || 0);
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
      amount1: a1.toString(),
      amount: _amount.div(1e18).toString()
    });
    setKekIds(uniq(kekIds));
  };

  const errorTips = useMemo(
    () =>
      (percent === 100 || Big(info.balance).eq(0)) && kekIds.length === 0
        ? "Insufficient liquidity"
        : "",
    [percent, kekIds]
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
        {percent !== 100 && (
          <div className="flex items-center justify-between mt-[6px]">
            <div className="text-[14px] font-medium	text-[#3D405A]">
              Extra withdrawal
            </div>
            <div className="text-[14px] font-medium">
              {balanceFormated(
                balanceFormated((stakedAmounts.amount0 * percent) / 100, 4),
                4
              )}
              {data.token0.symbol}/
              {balanceFormated((stakedAmounts.amount1 * percent) / 100, 4)}
              {data.token1.symbol}
            </div>
          </div>
        )}
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          onSuccess({
            amount: Big(amount)
              .add(stakedAmounts.amount || 0)
              .toString(),
            amount0: Big(amount0)
              .add(stakedAmounts.amount0 || 0)
              .toString(),
            amount1: Big(amount1)
              .add(stakedAmounts.amount1 || 0)
              .toString(),
            selectedItems: kekIds.map((id: string) =>
              info.locked.items.find((item: any) => item.kek_id === id)
            )
          });
        }}
        disabled={!!errorTips}
      >
        {errorTips || (kekIds.length ? "Confirm Unstake" : "Withdraw")}
      </Button>
    </>
  );
}
