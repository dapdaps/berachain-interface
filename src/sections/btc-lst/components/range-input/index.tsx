import InputNumber from "@/components/input-number";
import Range from "@/components/range";
import { Token } from "@/types";
import Big from "big.js";
import clsx from "clsx";
import { ChangeEvent, memo, useEffect, useState } from "react";

export default memo(function RangeInput({
  token,
  balance,
  onChange
}: {
  token: Token
  balance: string
  onChange?: (value: string) => void
}) {
  const RangeList = [0.25, 0.5, 0.75, 1];
  const [rangeIndex, setRangeIndex] = useState(-1);
  const [percentage, setPercentage] = useState("");
  const [inAmount, setInAmount] = useState("");

  function getPercentage(_amount: any) {
    if (!balance) return "0";
    _amount = Big(_amount).gt(balance) ? balance : _amount;
    return Big(balance).eq(0)
      ? "0"
      : Big(_amount)
        .div(balance ?? 1)
        .times(100)
        .toFixed();
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInAmount(value);
    const newPercentage = getPercentage(value);
    setPercentage(newPercentage);
    
    const matchIndex = RangeList.findIndex((range) => 
      Big(range).times(100).eq(Big(newPercentage))
    );
    setRangeIndex(matchIndex);
    
    if (onChange) {
      onChange(value);
    }
  };
  
  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPercentage = e.target.value;
    setPercentage(newPercentage);
    
    const newAmount = Big(balance || 0)
      .times(Big(newPercentage).div(100))
      .toFixed();
    setInAmount(newAmount);
    
    const matchIndex = RangeList.findIndex((range) => 
      Big(range).times(100).eq(Big(newPercentage))
    );
    setRangeIndex(matchIndex);
    
    if (onChange) {
      onChange(newAmount);
    }
  };
  
  const handleRangeButtonClick = (range: number, index: number) => {
    const newAmount = Big(balance || 0)
      .times(range)
      .toFixed();
    setInAmount(newAmount);
    setPercentage(String(range * 100));
    setRangeIndex(index);
    if (onChange) {
      onChange(newAmount);
    }
  };

  useEffect(() => {
    if (inAmount && balance) {
      const newPercentage = getPercentage(inAmount);
      setPercentage(newPercentage);
      
      if (Big(inAmount).gt(balance)) {
        setInAmount(balance);
        setPercentage("100");
        setRangeIndex(3); 
        if (onChange) {
          onChange(balance);
        }
      }
    }
  }, [balance]);

  return (
    <div className="p-[17px_16px_12px_12px] h-[93px] flex flex-col justify-center gap-[12px] rounded-[12px] border border-[#373A53] bg-white">
      <div className="flex items-center justify-between">
        <InputNumber 
          value={inAmount} 
          onChange={handleInputChange} 
        />
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
              onClick={() => handleRangeButtonClick(range, index)}
            >
              {range === 1 ? "Max" : range * 100 + "%"}
            </div>
          ))}
        </div>
        <Range
          value={percentage}
          onChange={handleRangeChange}
          style={{
            marginTop: 0,
            flex: 1
          }}
        />
      </div>
    </div>
  );
});