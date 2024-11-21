import { balanceFormated } from "@/utils/balance";
import Item from "../../actions/stake-item";
import { useMemo, useState } from "react";
import { remove, uniq } from "lodash";
import Big from "big.js";
import Button from "@/components/button";

export default function SelectPanel({
  amount0 = 0,
  amount1 = 0,
  info,
  data,
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
    const liquidity = Big(item.liquidity).div(1e18);
    if (kekIds.includes(id)) {
      remove(kekIds, (i) => i === id);
      a0 = a0.minus(item.amount0);
      a1 = a1.minus(item.amount1);
      _amount = _amount.minus(liquidity);
    } else {
      kekIds.push(id);
      a0 = a0.add(item.amount0);
      a1 = a1.add(item.amount1);
      _amount = _amount.add(liquidity);
    }
    setStakedAmounts({
      amount0: a0.toString(),
      amount1: a1.toString(),
      amount: _amount.div(1e18).toString()
    });
    setKekIds(uniq(kekIds));
  };

  const {
    extraAmount0,
    extraAmount1,
    remainingAmount0,
    remainingAmount1,
    islandAmount0,
    islandAmount1,
    errorTips
  } = useMemo(() => {
    let _i0 = Big(0);
    let _i1 = Big(0);
    let _errorTips = "";

    const _ir0 = Big(amount0).minus(stakedAmounts.amount0 || 0);
    const _ir1 = Big(amount1).minus(stakedAmounts.amount1 || 0);

    const _r0 = _ir0.minus(info.balanceAmount0);
    const _r1 = _ir1.minus(info.balanceAmount1);

    if (_ir0.gt(info.balanceAmount0) || _ir1.gt(info.balanceAmount1)) {
      _errorTips = "Insufficient Liquidity";
      _i0 = Big(info.balanceAmount0);
      _i1 = Big(info.balanceAmount1);
    } else {
      _i0 = _ir0;
      _i1 = _ir1;
    }
    _i0 = _i0.lt(0) ? Big(0) : _i0;
    _i1 = _i1.lt(0) ? Big(0) : _i1;
    const _e0 = Big(stakedAmounts.amount0 || 0)
      .add(_i0)
      .minus(amount0);
    const _e1 = Big(stakedAmounts.amount1 || 0)
      .add(_i1)
      .minus(amount1);

    return {
      extraAmount0: _e0.gt(0) ? _e0.toString() : 0,
      extraAmount1: _e1.gt(0) ? _e1.toString() : 0,
      remainingAmount0: _r0.gt(0) ? _r0.toString() : 0,
      remainingAmount1: _r1.gt(0) ? _r1.toString() : 0,
      islandAmount0: _i0.toString(),
      islandAmount1: _i1.toString(),
      errorTips: _errorTips
    };
  }, [amount0, amount1, info, stakedAmounts]);

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
            {balanceFormated(islandAmount0, 4)}
            {data.token0.symbol}/{balanceFormated(islandAmount1, 4)}
            {data.token1.symbol}
          </div>
        </div>
        {!!(extraAmount0 && extraAmount1) && (
          <div className="flex items-center justify-between mt-[6px]">
            <div className="text-[14px] font-medium	text-[#3D405A]">
              Extra withdrawal
            </div>
            <div className="text-[14px] font-medium">
              {balanceFormated(balanceFormated(extraAmount0, 4), 4)}
              {data.token0.symbol}/{balanceFormated(extraAmount1, 4)}
              {data.token1.symbol}
            </div>
          </div>
        )}
        {!!(remainingAmount0 && remainingAmount1) && (
          <div className="flex items-center justify-between mt-[6px]">
            <div className="text-[14px] font-medium	text-[#3D405A]">
              Remaining
            </div>
            <div className="text-[14px] font-medium">
              {balanceFormated(balanceFormated(remainingAmount0, 4), 4)}
              {data.token0.symbol}/{balanceFormated(remainingAmount1, 4)}
              {data.token1.symbol}
            </div>
          </div>
        )}
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          const _a = Big(info.balanceAmount0 || 0).gt(0)
            ? Big(info.balance).mul(islandAmount0).div(info.balanceAmount0)
            : 0;

          onSuccess({
            amount: Big(stakedAmounts.amount || 0)
              .add(_a)
              .toString(),
            amount0: Big(islandAmount0)
              .add(stakedAmounts.amount0 || 0)
              .toString(),
            amount1: Big(islandAmount1)
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
