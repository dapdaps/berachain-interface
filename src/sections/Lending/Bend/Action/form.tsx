import { IProps } from '@/sections/Lending/Bend/Action/index';
import { formatDisplayNumber } from '@/utils/formatMoney';
import Button from '@/sections/Lending/Bend/BendButton';
import Big from 'big.js';
import useAaveConfig from "@/stores/useAaveConfigStore";
import useMarketStore from '@/stores/useMarketStore';
import { useDepositAndWithdraw } from '@/sections/Lending/Bend/hooks/useDepositAndWithdraw';
import { useMemo } from 'react';
import AmountSelector from '@/sections/Lending/components/amount-selector';
import useAccount from '@/hooks/use-account';

const ActionPanelForm = (props: IProps) => {
  const { action, token, isMobile } = props;

  const { chainId } = useAccount()  

  const { config } = useAaveConfig();

  const {
    triggerUpdate,
    userAccountData
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
    token, isDeposit, config, triggerUpdate, chainId
  });

  const {
    symbol,
    balance,
    decimals,
    underlyingBalance,
  } = token as any;

  const currentBalance = isDeposit ? balance : underlyingBalance;

  const isDisabled = useMemo(() => {
    return (
      Big(currentBalance || 0).eq(0) ||
      Big(amount || 0).eq(0) ||
      Big(amount || 0).gt(currentBalance || 0)
    );
  }, [currentBalance, amount]);

  const showTipsInRepay = useMemo(() => action === 'withdraw' && Big(userAccountData.totalDebtBaseUSD).gt(0) && symbol !== 'HONEY', [token, userAccountData, action]);

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

  return (
    <>
      <input
        type="number"
        placeholder="Enter amount"
        disabled={showTipsInRepay}
        value={amount}
        onChange={(e) => changeValue(e.target.value)}
        className="w-full h-[40px] border border-[#373A53] rounded-[12px] px-3
                     font-Montserrat text-base font-semibold leading-[19.5px] text-left
                     placeholder-black placeholder-opacity-30
                     focus:outline-none focus:ring-2 focus:ring-[#373A53] md:h-[56px] md:leading-[54px] md:text-[20px]"
      />
      {showTipsInRepay && (
        <div className="text-left text-xs text-[#F87272] my-2">
          Waring: Please be sure to pay your entire honey debt, you will not be able to withdraw your collateral until you repay your honey loan.
        </div>
      )}
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
              isDeposit={isDeposit}
              setAmount={setAmount}
              maxValue={maxValue}
              currentBalance={currentBalance}
            />
          </AmountSelector>
        )
      }
      <div className="flex justify-between items-center mt-3 md:flex-col md:items-stretch">
        <Balance
          isDeposit={isDeposit}
          setAmount={setAmount}
          maxValue={maxValue}
          currentBalance={currentBalance}
          className="md:hidden"
        />
        {needApprove ? (
          <Button
            loading={approving}
            disabled={isDisabled}
            onClick={() => {
              const value = Big(amount).mul(Big(10).pow(decimals)).toFixed(0);
              handleApprove(value)
            }}
            className="md:mt-[37px] md:h-[46px] md:leading-[44px] md:rounded-[10px]"
          >
            Approve
          </Button>
        ) : (
          <Button
            loading={loading}
            disabled={isDisabled}
            onClick={handleAction}
            className="md:mt-[37px] md:h-[46px] md:leading-[44px] md:rounded-[10px]"
          >
            {isDeposit ? action === 'supply' ? 'Supply' : 'Deposit' : "Withdraw"}
          </Button>
        )}
      </div>
    </>
  );
};

export default ActionPanelForm;

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
  const { isDeposit, setAmount, maxValue, currentBalance, className } = props;

  return (
    <div className={`font-Montserrat text-sm font-normal leading-[17px] text-left md:text-right ${className}`}>
      {isDeposit ? "Balance: " : "Available: "}
      <span className="underline cursor-pointer" onClick={() => setAmount(maxValue)}>
            {formatDisplayNumber(currentBalance)}
          </span>
    </div>
  );
};
