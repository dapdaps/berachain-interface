import Button from "@/components/button";
import { useMemo, useState } from "react";
import useUnstake from "../../hooks/use-unstake";
import Big from "big.js";
import { remove, uniq } from "lodash";
import Item from "./stake-item";

export default function Unstake({ data, info, onSuccess }: any) {
  const [amount, setAmount] = useState("");
  const [kekIds, setKekIds] = useState<any>([]);

  const { loading, onUnstake } = useUnstake({
    farmContract: data.farmAddress,
    kekIds,
    token: { symbol: data.symbol },
    amount,
    onSuccess
  });

  const onSelect = (item: any) => {
    const id = item.kek_id;
    let _amount = Big(amount || 0);
    if (kekIds.includes(id)) {
      remove(kekIds, (i) => i === id);
      _amount = _amount.minus(item.liquidity);
    } else {
      kekIds.push(id);
      _amount = _amount.add(item.liquidity);
    }
    setKekIds(uniq(kekIds));
    setAmount(_amount.div(1e18).toString());
  };

  return (
    <>
      {info.locked.items.map((item: any) => (
        <Item
          key={item.kek_id}
          token0={data.token0}
          token1={data.token1}
          item={item}
          onClick={onSelect}
          active={kekIds.includes(item.kek_id)}
        />
      ))}
      <Button
        disabled={!kekIds.length}
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        loading={loading}
        onClick={onUnstake}
      >
        {!!kekIds.length ? "Unstake" : "None Positions"}
      </Button>
    </>
  );
}
