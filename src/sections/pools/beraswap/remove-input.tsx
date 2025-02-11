"use client";
import { useState } from "react";
import { balanceFormated } from "@/utils/balance";
import Loading from "@/components/circle-loading";
import Range from "@/components/range";
import { motion } from "framer-motion";
import Big from "big.js";

export default function TokenAmout({
  amount,
  currency,
  onCurrencySelectOpen,
  onAmountChange,
  tokenBalance
}: any) {
  const [percent, setPercent] = useState<any>(0);
  const handleRangeChange = (e: any, isAmountChange = true) => {
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    const _percent = e.target.value || 0;
    setPercent(_percent);
    isAmountChange &&
      onAmountChange?.(
        Big(tokenBalance)
          .times(Big(_percent).div(100))
          .toFixed(currency?.decimals)
          .replace(/[.]?0+$/, "")
      );
  };
  const setRange = (val: string) => {
    const formatedBalance = balanceFormated(tokenBalance);
    if (["-", "Loading", "0"].includes(formatedBalance)) return;
    let percent: any = Big(val || 0)
      .div(formatedBalance)
      .times(100)
      .toFixed(2);
    percent = Math.min(Math.max(+percent, 0), 100);
    handleRangeChange?.({ target: { value: percent } }, false);
  };

  return (
    <div className="border border-[#000] rounded-[12px] p-[14px] bg-white">
      <div className="flex items-center justify-between gap-[10px]">
        <div
          className={`border bg-[#FFFDEB] flex items-center justify-between border-[#000] rounded-[8px]  w-[176px] h-[46px] px-[7px] cursor-pointer`}
          onClick={() => {
            onCurrencySelectOpen();
          }}
        >
          {currency ? (
            <div className="flex items-center gap-[10px]">
              <div className="relative">
                <img
                  className="w-[26px] h-[26px]"
                  src={currency.icon || "/assets/tokens/default_icon.png"}
                />
              </div>
              <div>
                <div className="text-[16px] font-[600]">{currency?.symbol}</div>
              </div>
            </div>
          ) : (
            <div className="text-[16px] font-[600]">Select a token</div>
          )}
          <svg
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L6 5L11 1"
              stroke="black"
              stroke-width="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex-1">
          <input
            className="w-[100%] h-[100%] text-[26px] text-right"
            value={amount}
            onChange={(ev) => {
              if (isNaN(Number(ev.target.value))) return;
              const val = ev.target.value.replace(/\s+/g, "");
              onAmountChange?.(val);
              setRange(val);
            }}
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex justify-between md:flex-col md:items-stretch md:justify-start items-center gap-[22px] mt-[12px]">
        <div className="flex items-center gap-[8px]">
          {BalancePercentList.map((p) => (
            <motion.div
              key={p.value}
              className="cursor-pointer h-[22px] rounded-[6px] border border-[#373A53] text-black text-[14px] font-[400] px-[8px]"
              animate={percent == p.value ? { background: "#FFDC50" } : {}}
              onClick={() => handleRangeChange({ target: p })}
            >
              {p.label}
            </motion.div>
          ))}
        </div>
        <Range
          style={{ marginTop: 0, flex: 1 }}
          value={percent}
          onChange={handleRangeChange}
        />
      </div>
    </div>
  );
}

const BalancePercentList = [
  { value: 25, label: "25%" },
  { value: 50, label: "50%" },
  { value: 75, label: "75%" },
  { value: 100, label: "Max" }
];
