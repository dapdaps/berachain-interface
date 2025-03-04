"use client";
import { useMemo, useEffect } from "react";
import useTokenBalance from "@/hooks/use-token-balance";
import { balanceFormated } from "@/utils/balance";
import Loading from "@/components/circle-loading";
import clsx from "clsx";

export default function TokenAmount({
  tab,
  type,
  amount,
  disabled,
  currency,
  onCurrencySelectOpen,
  onAmountChange,
  onUpdateCurrencyBalance,
  updater
}: any) {

  const { tokenBalance, isLoading, update } = useTokenBalance(
    currency?.isNative ? "native" : currency?.address,
    currency?.decimals,
    currency?.chainId
  );

  useEffect(() => {
    if (tokenBalance && onUpdateCurrencyBalance)
      onUpdateCurrencyBalance(tokenBalance);
  }, [tokenBalance]);

  useEffect(() => {
    update();
  }, [updater]);

  const isSelectable = (tab === 'mint' && type === 'in') || (tab === 'redeem' && type === 'out');

  return (
    <div className="border border-[#373A53] rounded-[12px] p-[8px] bg-white">
      <div className="flex items-center justify-between gap-[10px]">
        <div className="flex-1">
          <input
            className="w-[100%] h-[100%] text-[26px] text-left"
            value={amount}
            onChange={(ev) => {
              if (isNaN(Number(ev.target.value))) return;
              const val = ev.target.value.replace(/\s+/g, "");
              onAmountChange?.(val);
            }}
            placeholder="0"
          />
        </div>
        <div
          className={clsx(`flex items-center border-[#373A53] rounded-[8px] w-[176px] h-[38px] px-[7px]`, isSelectable ? "border bg-[#FFFDEB] justify-between cursor-pointer" : "justify-end")}
          onClick={() => {
            if (isSelectable) {
              onCurrencySelectOpen?.();
            }
          }}
        >
          {currency ? (
            <div className="flex items-center gap-[10px]">
              <div className="relative shrink-0">
                <img
                  className="w-[26px] h-[26px]"
                  src={currency.icon || "/assets/tokens/default_icon.png"}
                />
              </div>
              <div className="text-[16px] font-[600] max-w-[100px] truncate">
                {currency?.symbol}
              </div>
            </div>
          ) : (
            <div className="text-[16px] font-[600]">Select a token</div>
          )}
          {isSelectable && (
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
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
      </div>
      <div
        onClick={() => {
          const formatedBalance = balanceFormated(tokenBalance);
          if (["-", "Loading", "0"].includes(formatedBalance)) return;
          onAmountChange?.(tokenBalance);
        }}
        className="flex cursor-pointer items-center justify-end text-[#3D405A] mt-[10px] font-medium text-[12px]"
      >
        <div className="flex items-center gap-[4px]">
          balance:{" "}
          {isLoading ? (
            <Loading />
          ) : (
            <span
              style={{
                textDecoration: disabled ? "none" : "underline"
              }}
            >
              {currency ? balanceFormated(tokenBalance) : "-"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

