import InputNumber from "@/components/input-number";
import Range from "@/components/range";
import { Token } from "@/types";
import Big from "big.js";
import clsx from "clsx";
import { memo, useState } from "react";

export default memo(function RangeList({
  token,
  balance,
  onChange
}: {
  token: Token
  balance: string
  onChange?: (value: string) => void
}) {
  const RangeList = [0.25, 0.5, 0.75, 1];
  const [rangeIndex, setRangeIndex] = useState(-1)
  const [percentage, setPercentage] = useState("")
  const [inAmount, setInAmount] = useState("")

  function getPercentage(_amount: string) {
    _amount = Big(_amount).gt(balance) ? balance : _amount;
    return Big(balance).eq(0)
      ? 0
      : Big(_amount)
        .div(balance ?? 1)
        .times(100)
        .toFixed();
  };
  return (
    <div className="p-[17px_16px_12px_12px] h-[93px] flex flex-col justify-center gap-[12px] rounded-[12px] border border-[#373A53] bg-white">
      <div className="flex items-center justify-between">
        <InputNumber value={inAmount} onChange={onChange} />
        <div className="flex items-center gap-[6px]">
          <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
            <img src={token?.icon} alt={token?.symbol} />
          </div>
          <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{token?.symbol}</div>
        </div>
      </div>
      <div className="flex items-center gap-[22px]">
        <div className="flex items-center gap-[8px]">
          {RangeList.map((range: number, index: number) => (
            <div
              key={index}
              className={clsx([
                "cursor-pointer w-[48px] h-[22px] flex items-center justify-center rounded-[6px] border border-[#373A53] text-black font-Montserrat text-[14px]",
                index === rangeIndex ? "bg-[#FFDC50]" : ""
              ])}
              onClick={() => {
                const amount = Big(balance ?? 0)
                  .times(range)
                  .toFixed();
                setInAmount(amount)
                setPercentage(getPercentage(amount))
                setRangeIndex(index)
              }}
            >
              {range === 1 ? "Max" : range * 100 + "%"}
            </div>
          ))}
        </div>
        <Range
          value={percentage}
          onChange={(e) => {
            const percentage = e.target.value;
            setPercentage(percentage)
            setInAmount(Big(balance ? balance : 0)
              .times(Big(percentage).div(100))
              .toFixed())
            setRangeIndex(RangeList.findIndex((range) =>
              Big(range).eq(Big(percentage).div(100))
            ))
          }}
          style={{
            marginTop: 0,
            flex: 1
          }}
        />
      </div>
    </div>

  )
})
