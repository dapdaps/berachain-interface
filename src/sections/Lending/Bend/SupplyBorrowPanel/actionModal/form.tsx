import { forwardRef, useMemo } from "react";
import { formatDisplayNumber } from "@/utils/formatMoney";
import Big from "big.js";
import useMarketStore from "@/stores/useMarketStore";
import useAaveConfig from "@/stores/useAaveConfigStore";
import { useBorwAndRepay } from "../../hooks/useBorwAndRepay";
import Button from "../../BendButton";
import { IProps } from './index';
import AmountSelector from '@/sections/Lending/components/amount-selector';


const ActionForm = forwardRef<HTMLDivElement, IProps>(
  (props: IProps, ref) => {
    const { isOpen, onClose, action, token, isMobile } = props;
    const { config } = useAaveConfig();
    const {
      initData: { provider, chainId, account },
      triggerUpdate,
      userAccountData,
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
      // @ts-ignore
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
    } = token as any;

    const currentBalance = isBorrow ? userAccountData.availableBorrowsBaseUSD : netBaseData.yourTotalBorrow;

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

    return (
      <>
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
        {
          isMobile && (
            <AmountSelector
              token={token}
              setAmount={setAmount}
              balance={{
                value: currentBalance,
              }}
            >
              <Balance
                isBorrow={isBorrow}
                setAmount={setAmount}
                maxValue={maxValue}
                currentBalance={currentBalance}
              />
            </AmountSelector>
          )
        }
        <div className="flex justify-between items-center mt-3 md:flex-col md:items-stretch">
          <Balance
            isBorrow={isBorrow}
            setAmount={setAmount}
            maxValue={maxValue}
            currentBalance={currentBalance}
            className="md:hidden"
          />
          {needApprove ? (
            <Button
              onClick={handleApprove}
              disabled={isDisabled}
              loading={approving}
              className="md:mt-[37px] md:h-[46px] md:leading-[44px] md:rounded-[10px]"
            >
              Approve
            </Button>
          ) : (
            <Button
              disabled={isDisabled}
              onClick={handleAction}
              loading={loading}
              className="md:mt-[37px] md:h-[46px] md:leading-[44px] md:rounded-[10px]"
            >
              {isBorrow ? "Borrow" : "Repay"}
            </Button>
          )}
        </div>
      </>
    );
  }
);

export default ActionForm;

const smartFormatNumber = (amount: Big, decimals: number): string => {
  const formatted = amount.toFixed(decimals).replace(/\.?0+$/, "");
  return formatted.includes(".") ? formatted : formatted + ".0";
};


const MIN_ETH_GAS_FEE = 0

const calculateMaxValue = (
  balance: string,
  symbol: string,
  decimals: number,
  config: any
): string => {
  if (!balance) return "0";
  const balanceBig = new Big(balance);
  return smartFormatNumber(balanceBig.minus(MIN_ETH_GAS_FEE), decimals);
};

const Balance = (props: any) => {
  const { isBorrow, setAmount, maxValue, currentBalance, className } = props;

  return (
    <div className={`font-Montserrat text-sm font-normal leading-[17px] text-left ${className}`}>
      {isBorrow ? "Borrow Max: " : "Balance: "}
      <span className="underline cursor-pointer" onClick={() => setAmount(maxValue)}>
        {formatDisplayNumber(currentBalance)}
      </span>
    </div>
  );
};
