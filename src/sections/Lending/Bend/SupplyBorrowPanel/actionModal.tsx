import { forwardRef, useEffect, useMemo, useState } from "react";
import { TokenInfo } from "../hooks/useBend";
import { formatDisplayNumber } from "@/utils/formatMoney";
import Big from "big.js";
import useMarketStore from "@/stores/useMarketStore";
import useAaveConfig from "@/stores/useAaveConfigStore";
import { useBorwAndRepay } from "../hooks/useBorwAndRepay";
import Button from "../BendButton";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  action: string;
  token: TokenInfo;
  className?: string;
}

const MIN_ETH_GAS_FEE = 0.001;

const smartFormatNumber = (amount: Big, decimals: number): string => {
  const formatted = amount.toFixed(decimals).replace(/\.?0+$/, "");
  return formatted.includes(".") ? formatted : formatted + ".0";
};

const calculateMaxValue = (
  balance: string,
  symbol: string,
  decimals: number,
  config: any
): string => {
  if (!balance) return "0";
  const balanceBig = new Big(balance);

  if (symbol === config.nativeCurrency.symbol) {
    return smartFormatNumber(balanceBig.minus(MIN_ETH_GAS_FEE), decimals);
  } else {
    return smartFormatNumber(balanceBig, decimals);
  }
};

const Action = forwardRef<HTMLDivElement, IProps>(
  ({ isOpen, onClose, action, token, className }: IProps, ref) => {
    const { config } = useAaveConfig();
    const {
      initData: { provider, chainId, account },
      triggerUpdate,
      netBaseData
    } = useMarketStore();
    const isBorrow = action === "borrow";

    const {
      needApprove,
      setAmount,
      amount,
      borrowETH,
      borrowERC20,
      repayETH,
      repayERC20,
      handleApprove,
      approving,
      loading,
    } = useBorwAndRepay({
      token,
      isBorrow,
      provider,
      chainId,
      account,
      config,
      triggerUpdate,
    })

    const {
      symbol,
      balance,
      decimals,
      availableBorrows
    } = token;

    const currentBalance = isBorrow ? availableBorrows : netBaseData.yourTotalBorrow;

    const isDisabled = useMemo(() => {
      return (
        Big(currentBalance || 0).eq(0) ||
        Big(amount || 0).eq(0) ||
        Big(amount || 0).gt(currentBalance || 0)
      );
    }, [currentBalance, amount]);

    const maxValue = useMemo(() => {
      return calculateMaxValue(currentBalance, symbol, decimals, config);
    }, [currentBalance, symbol, decimals, config]);

    const changeValue = (value: string) => {
      setAmount(value);
    };

    const handleAction = async () => {
      const value = Big(amount).mul(Big(10).pow(decimals)).toFixed(0);
      if (isBorrow) {
        if (symbol === config.nativeCurrency.symbol) {
          await borrowETH(value);
        } else {
          await borrowERC20(value);
        }
      } else {
        if (symbol === config.nativeCurrency.symbol) {
          await repayETH(value);
        } else {
          await repayERC20(value);
        }
      }
  }


    if (!isOpen) return null;

    return (
      <div className={`absolute z-50 top-[40px] ${className}`} ref={ref}>
        <div className="w-[302px] h-[160px] bg-[#FFFDEB] shadow-shadow1 border border-black rounded-[20px] p-5">
          <h2 className="font-Montserrat text-base font-semibold leading-[14.4px] text-left mb-[18px]">
            {isBorrow ? "Borrow" : "Repay"}
          </h2>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => changeValue(e.target.value)}
            className="w-full h-[40px] border border-[#373A53] rounded-[12px] px-3
                     font-Montserrat text-base font-semibold leading-[19.5px] text-left
                     placeholder-black placeholder-opacity-30
                     focus:outline-none focus:ring-2 focus:ring-[#373A53]"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="font-Montserrat text-sm font-normal leading-[17px] text-left">
              {isBorrow ? "Borrow Max: " : "Balance: "}
              <span className="underline" onClick={() => setAmount(maxValue)}>
                {formatDisplayNumber(currentBalance)}
              </span>
            </div>
            {needApprove ? (
              <Button
                onClick={handleApprove}
                disabled={isDisabled}
                loading={approving}
              >
                Approve
              </Button>
            ) : (
              <Button
                disabled={isDisabled}
                onClick={handleAction}
                loading={loading}
              >
                {isBorrow ? "Borrow" : "Repay"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default Action;
