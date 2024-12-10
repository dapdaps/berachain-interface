import { forwardRef, useMemo, useState, useEffect } from "react";
import { formatDisplayNumber } from "@/utils/formatMoney";
import Big from "big.js";
import useMarketStore from "@/stores/useMarketStore";
import useAaveConfig from "@/stores/useAaveConfigStore";
import { useBorwAndRepay } from "../hooks/useBorwAndRepay";
import { useDepositAndWithdraw } from "../hooks/useDepositAndWithdraw";
import Button from "../BendButton";
import AmountSelector from '@/sections/Lending/components/amount-selector';

interface IProps {
  action: "borrow" | "repay" | "supply" | "deposit" | "withdraw" & any;
  token?: any;
  isMobile?: boolean;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

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

const Balance = (props: any) => {
  const { action, setAmount, maxValue, currentBalance, className } = props;

  const getBalanceLabel = () => {
    switch (action) {
      case 'borrow': return 'Borrow Max: ';
      case 'withdraw': return 'Available: ';
      default: return 'Balance: ';
    }
  };

  return (
    <div className={`font-Montserrat text-sm font-normal leading-[17px] text-left md:text-right ${className}`}>
      {getBalanceLabel()}
      <span className="underline cursor-pointer" onClick={() => setAmount(maxValue)}>
        {formatDisplayNumber(currentBalance)}
      </span>
    </div>
  );
};

const ActionPanelForm = forwardRef<HTMLDivElement, IProps>(
  (props: IProps, ref) => {
    const { action, token, isMobile } = props;
    const { config } = useAaveConfig();
    const { triggerUpdate, userAccountData, netBaseData, initData: { provider, chainId, account } } = useMarketStore();

    const isBorrowOrRepay = ["borrow", "repay"].includes(action);

    const borrowRepayHook = useBorwAndRepay({
      token,
      isBorrow: action === "borrow",
      provider,
      chainId,
      account,
      config,
      triggerUpdate,
    });

    const depositWithdrawHook = useDepositAndWithdraw({
      token,
      isDeposit: ["deposit", "supply"].includes(action),
      config,
      triggerUpdate,
      chainId,
    });

    const hook: any = isBorrowOrRepay ? borrowRepayHook : depositWithdrawHook;

    const {
      symbol,
      balance,
      decimals,
      availableBorrows,
      underlyingBalance
    } = token as any;

    const currentBalance = (() => {
      switch (action) {
        case 'borrow': return userAccountData.availableBorrowsBaseUSD;
        case 'repay': return netBaseData.yourTotalBorrow;
        case 'deposit':
        case 'supply': return balance;
        case 'withdraw': return underlyingBalance;
        default: return '0';
      }
    })();

    const isDisabled = useMemo(() => {
      return (
        Big(currentBalance || 0).eq(0) ||
        Big(hook.amount || 0).eq(0) ||
        Big(hook.amount || 0).gt(currentBalance || 0)
      );
    }, [currentBalance, hook.amount]);

    const maxValue = useMemo(() => {
      return calculateMaxValue(currentBalance, symbol, decimals, config);
    }, [currentBalance, symbol, decimals, config]);

    const [inputValue, setInputValue] = useState<string>(hook.amount || '');

    useEffect(() => {
      setInputValue(hook.amount || '');
    }, [hook.amount]);

    const handleAction = async () => {
      const value = Big(hook.amount).mul(Big(10).pow(decimals)).toFixed(0);

      if (isBorrowOrRepay) {
        if (action === 'borrow') {
          symbol === config.nativeCurrency.symbol ? await hook.borrowETH(value) : await hook.borrowERC20(value);
        } else {
          symbol === config.nativeCurrency.symbol ? await hook.repayETH(value) : await hook.repayERC20(value);
        }
      } else {
        if (action === 'deposit' || action === 'supply') {
          symbol === config.nativeCurrency.symbol ? await hook.depositETH(value) : await hook.depositErc20(value);
        } else {
          symbol === config.nativeCurrency.symbol ? await hook.withdrawETH(value) : await hook.withdrawErc20(value);
        }
      }
    };

    const showTipsInRepay = useMemo(() => 
      action === 'withdraw' && 
      Big(userAccountData.totalDebtBaseUSD).gt(0) && 
      symbol !== 'HONEY', 
    [token, userAccountData, action]);


    return (
      <>
        <input
          placeholder="Enter amount"
          disabled={showTipsInRepay}
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            if (value === '') {
              hook.setAmount('');
              return;
            }
            hook.setAmount(value);
          }}
          className="w-full h-[40px] border border-[#373A53] rounded-[12px] px-3
                     font-Montserrat text-base font-semibold leading-[19.5px] text-left
                     placeholder-black placeholder-opacity-30
                     focus:outline-none focus:ring-2 focus:ring-[#373A53] md:h-[56px] md:leading-[54px] md:text-[20px]"
        />

        {showTipsInRepay && (
          <div className="text-left text-xs text-[#F87272] my-2">
            Warning: Please be sure to pay your entire honey debt, you will not be able to withdraw your collateral until you repay your honey loan.
          </div>
        )}

        {isMobile && (
          <AmountSelector
            token={token}
            setAmount={hook.setAmount}
            onChange={(value: string) => hook.setAmount(value)}
            balance={{ value: currentBalance }}
            currentAmount={hook.amount}
          >
            <Balance
              action={action}
              setAmount={hook.setAmount}
              maxValue={maxValue}
              currentBalance={currentBalance}
            />
          </AmountSelector>
        )}

        <div className="flex justify-between items-center mt-3 md:flex-col md:items-stretch">
          <Balance
            action={action}
            setAmount={hook.setAmount}
            maxValue={maxValue}
            currentBalance={currentBalance}
            className="md:hidden"
          />

          {hook.needApprove ? (
            <Button
              loading={hook.approving}
              disabled={isDisabled}
              amount={hook.amount}
              maxValue={maxValue}
              onClick={() => {
                const value = Big(hook.amount).mul(Big(10).pow(decimals)).toFixed(0);
                hook.handleApprove(value);
              }}
              className="md:mt-[37px] md:h-[46px] md:leading-[44px] md:rounded-[10px]"
            >
              Approve
            </Button>
          ) : (
            <Button
              loading={hook.loading}
              disabled={isDisabled}
              onClick={handleAction}
              amount={hook.amount}
              maxValue={maxValue}
              className="md:mt-[37px] md:h-[46px] md:leading-[44px] md:rounded-[10px]"
            >
              {capitalizeFirstLetter(action)}
            </Button>
          )}
        </div>
      </>
    );
  }
);

export default ActionPanelForm;