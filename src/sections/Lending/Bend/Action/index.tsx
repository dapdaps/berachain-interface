import { forwardRef, useEffect, useMemo, useState } from "react";
import { TokenInfo } from "../hooks/useBend";
import { formatDisplayNumber } from "@/utils/formatMoney";
import Big from "big.js";
import useMarketStore from "@/stores/useMarketStore";
import useAaveConfig from "@/stores/useAaveConfigStore";

import useAddAction from "@/hooks/use-add-action";
import { useDepositAndWithdraw } from "../hooks/useDepositAndWithdraw";
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
      triggerUpdate,
    } = useMarketStore();
 
    const isDeposit = action === "deposit" || action === "supply";

    const {
      loading,
      approving,
      handleApprove,
      depositETH,
      depositErc20,
      withdrawETH,
      withdrawErc20,
      needApprove,
      setAmount,
      amount
    } = useDepositAndWithdraw({
      token, isDeposit, config, triggerUpdate
    });

    const {
      symbol,
      balance,
      decimals,
      underlyingBalance,
    } = token;

    const currentBalance = isDeposit ? balance : underlyingBalance;

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

      if (isDeposit) {
        if (symbol === config.nativeCurrency.symbol) {
          await depositETH(value);
        } else {
          await depositErc20(value);
        }
      } else {
        if (symbol === config.nativeCurrency.symbol) {
          await withdrawETH(value);
        } else {
          await withdrawErc20(value);
      }
    }
  }


    if (!isOpen) return null;

    return (
      <div className={`absolute z-50 top-[40px] ${className}`} ref={ref}>
        <div className="w-[302px] h-[160px] bg-[#FFFDEB] shadow-shadow1 border border-black rounded-[20px] p-5">
          <h2 className="font-Montserrat text-base font-semibold leading-[14.4px] text-left mb-[18px]">
          {isDeposit ? action === 'supply' ? 'Supply' : 'Deposit' : "Withdraw"}
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
              {isDeposit ? "Balance: " : "Available: "}
              <span className="underline" onClick={() => setAmount(maxValue)}>
                {formatDisplayNumber(currentBalance)}
              </span>
            </div>
            {needApprove ? (
              <Button
                loading={approving}
                disabled={isDisabled}
                onClick={() => {
                  const value = Big(amount).mul(Big(10).pow(decimals)).toFixed(0);
                  handleApprove(value)
                }}
              >
                Approve
              </Button>
            ) : (
              <Button
                loading={loading}
                disabled={isDisabled}
                onClick={handleAction}
              >
                {isDeposit ? action === 'supply' ? 'Supply' : 'Deposit' : "Withdraw"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default Action;
