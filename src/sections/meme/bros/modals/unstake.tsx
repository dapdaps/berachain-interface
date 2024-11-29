import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button/submit-button";
import { usePriceStore } from "@/stores/usePriceStore";
import { useMemo, useState } from "react";
import useUnstake from "../hooks/use-unstake";
import Big from "big.js";
import { formatDistance } from "date-fns";

export default function Unstake({
  data,
  userData,
  open,
  onClose,
  onSuccess
}: any) {
  const prices = usePriceStore((store: any) => store.price);
  const [amount, setAmount] = useState("");
  const { loading, onUnstake } = useUnstake({
    token: data,
    amount,
    onSuccess
  });

  const balance = useMemo(
    () => userData[data.token.address]?.stakedAmount || 0,
    [userData]
  );

  const errorTips = useMemo(() => {
    if (Number(amount || 0) === 0) return "Enter an amount";
    if (Big(amount).gt(balance || 0)) {
      return "Insufficient Balance";
    }
    return "";
  }, [amount, balance]);
  return (
    <Basic open={open} onClose={onClose} className="w-[520px]">
      <div className="flex text-[20px] font-bold pt-[10px] md:pt-0">
        Unstake {data.token.symbol}
      </div>
      <div className="mt-[20px]">
        <TokenAmout
          currency={data.token}
          prices={prices}
          amount={amount}
          defaultBalance={balance}
          outputCurrencyReadonly={true}
          onAmountChange={(val: any) => {
            setAmount(val);
          }}
        />
      </div>
      <Button
        token={data.token}
        amount={amount}
        loading={loading}
        errorTips={errorTips}
        disabled={!!errorTips}
        onClick={onUnstake}
      >
        Unstake
      </Button>
      <div className="flex items-center gap-[6px] text-[14px] py-[18px]">
        <div className="font-CherryBomb w-[20px] h-[20px] rounded-full bg-[#FFB7BF] text-center shrink-0">
          !
        </div>
        <div className="font-medium">
          The unstaked assets will available to be withdrawn{" "}
          {formatDistance(Date.now(), Date.now() + data.delayTime)}.
        </div>
      </div>
    </Basic>
  );
}
