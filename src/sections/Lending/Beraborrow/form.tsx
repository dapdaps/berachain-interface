import Modal from '@/components/modal';
import Info from '@/sections/Lending/Beraborrow/info';
import CurrencyInput from '@/sections/Lending/components/input';
import { useEffect, useMemo, useState } from 'react';
import Health, { getStatus } from '@/sections/Lending/Beraborrow/health';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import InputNumber from '@/components/input-number';
import Button from '@/components/button';
import Big from 'big.js';
import { numberRemoveEndZero } from '@/utils/number-formatter';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import LendingButton from '@/sections/Lending/components/button';
import { DEFAULT_CHAIN_ID } from '@/configs';
import useAddAction from '@/hooks/use-add-action';
import ClosePositionModal from '@/sections/Lending/Beraborrow/close';

const BeraborrowHandler = dynamic(() => import('@/sections/Lending/handlers/beraborrow'));

export const Form = (props: any) => {
  const {
    type,
    market,
    riskyRatio,
    borrowingFee,
    liquidationReserve,
    minimumDebt,
    basic,
    network,
    onSuccess,
  } = props;

  const { address, chainId } = useAccount();
  const { provider } = useProvider();
  const { addAction } = useAddAction("lending");

  const [loading, setLoading] = useState<boolean>(false);
  const [closePosition, setClosePosition] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>();
  const [borrowAmount, setBorrowAmount] = useState<string>();
  const [ratio, setRatio] = useState<string>();
  const [txData, setTxData] = useState<any>();
  const [actionText, setActionText] = useState<ActionText>();

  const calcTotalAmount = (_amount?: string) => {
    if (type === ActionText.Borrow) {
      return numberRemoveEndZero(Big(market.balance || 0).plus(_amount || 0).toFixed(market.decimals, Big.roundDown));
    }
    return numberRemoveEndZero(Big(market.balance || 0).minus(_amount || 0).toFixed(market.decimals, Big.roundDown));
  };
  const calcTotalBorrowAmount = (_borrowAmount?: string) => {
    if (type === ActionText.Borrow) {
      return numberRemoveEndZero(Big(market.borrowed || 0).plus(_borrowAmount || 0).toFixed(market?.borrowToken.decimals, Big.roundDown));
    }
    return numberRemoveEndZero(Big(market.borrowed || 0).minus(_borrowAmount || 0).toFixed(market?.borrowToken.decimals, Big.roundDown));
  };

  const totalAmount = useMemo(() => {
    return calcTotalAmount(amount);
  }, [amount, market, type]);
  const totalBorrowAmount = useMemo(() => {
    return calcTotalBorrowAmount(borrowAmount);
  }, [borrowAmount, market, type]);

  const borrowTokenLabel = useMemo(() => {
    if (type === ActionText.Repay) {
      return `Partially Repay ${market?.borrowToken?.symbol}`;
    }
    if (market.status === 'open') {
      return `${market?.borrowToken?.symbol} to be Minted`;
    }
    return `Borrow ${market?.borrowToken?.symbol}`;
  }, [type, market, market?.borrowToken]);

  const calcNECTBorrowed = (collateralAmount: any, _riskyRatio: string) => {
    const collateralValue = Big(collateralAmount || 0).times(market.price);
    // NECT borrowed = collateral value / (Ratio / 100)
    let NECTBorrowed = Big(collateralValue).div(Big(_riskyRatio).div(100));
    // - Liquidation reserve
    NECTBorrowed = Big(NECTBorrowed.toFixed(2, Big.roundDown)).minus(liquidationReserve);
    NECTBorrowed = Big(NECTBorrowed).times(Big(1).minus(borrowingFee));
    let result = NECTBorrowed.minus(market.borrowed || 0).toFixed(5, Big.roundDown);
    if (Big(result).lte(0)) return '0';
    return result;
  };

  const calcRatio = (_amount?: string, _borrowAmount?: string) => {
    const collateralValue = Big(_amount || 0).times(market.price);
    if (!_borrowAmount || Big(_borrowAmount).lte(0)) {
      const _ratio = numberRemoveEndZero(Big(collateralValue).div(1).times(100).toFixed(2));
      setRatio(_ratio);
      return;
    }
    let _ratio = numberRemoveEndZero(Big(collateralValue).div(Big(_borrowAmount).plus(liquidationReserve).plus(Big(_borrowAmount).times(borrowingFee))).times(100).toFixed(2));
    if (type === ActionText.Repay) {
      _ratio = numberRemoveEndZero(Big(collateralValue).div(Big(_borrowAmount)).times(100).toFixed(2));
    }
    setRatio(_ratio);
  };

  const borrowLimit = useMemo(() => {
    if (!totalAmount || Big(totalAmount).lte(0)) return '0';
    return calcNECTBorrowed(totalAmount, riskyRatio);
  }, [market, totalAmount, riskyRatio]);

  const ratioRisk = useMemo(() => {
    return getStatus(market, ratio);
  }, [market, ratio]);

  const collateralBalance = useMemo(() => {
    if (type === ActionText.Borrow) {
      return market.walletBalance;
    }
    return market.balance;
  }, [market, type]);

  const borrowBalance = useMemo(() => {
    if (type === ActionText.Borrow) {
      return borrowLimit;
    }
    return market?.borrowToken?.walletBalance;
  }, [type, borrowLimit]);

  const buttonValid = useMemo(() => {
    let text: any = type;
    if (type === ActionText.Repay) {
      text = [];
      if (amount && Big(amount).gt(0)) {
        text.push('Withdraw');
      }
      if (borrowAmount && Big(borrowAmount).gt(0)) {
        text.push('Repay');
      }
      text = text.join(' & ');
    }
    const result = {
      valid: true,
      text: text,
    };
    if (type === ActionText.Borrow && Big(totalBorrowAmount || 0).lt(minimumDebt)) {
      result.valid = false;
      result.text = `Minimum Debt of ${minimumDebt} required`;
      return result;
    }
    if (type === ActionText.Repay && Big(borrowAmount || 0).gt(borrowBalance || 0)) {
      result.valid = false;
      result.text = `Insufficient ${market.borrowToken.symbol} Balance`;
      return result;
    }
    if (Big(ratio || 0).lt(market.MCR)) {
      result.valid = false;
      result.text = `Ratio must be at least ${market.MCR}%`;
      return result;
    }
    if (Big(amount || 0).gt(collateralBalance || 0)) {
      result.valid = false;
      result.text = `Insufficient ${market.symbol} Balance`;
      return result;
    }
    return result;
  }, [type, totalBorrowAmount, market, ratio, amount, borrowAmount, collateralBalance, borrowBalance]);

  const toastLoadingMsg = useMemo(() => {
    if (type === ActionText.Borrow) {
      return `Submitting ${market?.borrowToken?.symbol} borrow request...`;
    }
    if (buttonValid.text.includes('Repay')) {
      return `Submitting ${market?.borrowToken?.symbol} repay request...`;
    }
    return `Submitting ${market?.collToken?.symbol} withdraw request...`;
  }, [type, buttonValid]);

  const handleAmount = (val: string) => {
    setAmount(val);
    // calc Ratio
    const _amount = calcTotalAmount(val);
    calcRatio(_amount, totalBorrowAmount);
  };

  const handleBorrowAmount = (val: string) => {
    setBorrowAmount(val);
    // calc Ratio
    const _borrowAmount = calcTotalBorrowAmount(val);
    calcRatio(totalAmount, _borrowAmount);
  };

  const handleRatio = (val: string) => {
    setRatio(val);
    // calc BorrowAmount
    if (!val || Big(val).lte(0)) {
      setBorrowAmount('');
      return;
    }
    const _borrowed = calcNECTBorrowed(totalAmount, val);
    setBorrowAmount(_borrowed);
  };

  const handleClosePosition = () => {
    setClosePosition(true);
  };

  useEffect(() => {
    if ((!borrowAmount || Big(borrowAmount).lte(0)) && (!amount || Big(amount).lte(0))) return;
    setLoading(true);
  }, [amount, borrowAmount]);

  useEffect(() => {
    setActionText(type);
  }, [type]);

  return (
    <div className="px-[12px] py-[20px] flex justify-between items-stretch gap-4">
      <Info
        {...props}
        onClose={handleClosePosition}
        loading={loading}
      />
      <div className="w-[450px] shrink-0 flex flex-col items-stretch gap-[10px]">
        <div className="text-black text-[16px] font-[600]">
          {CollateralAction[type]} Collateral
        </div>
        <CurrencyInput
          className=""
          token={{
            ...(type === ActionText.Repay ? market.collToken : market),
            balance: collateralBalance,
          }}
          amount={amount}
          onAmount={handleAmount}
          onBalance={() => {
            handleAmount(collateralBalance);
          }}
          tokens={[]}
        />
        <div className="text-black text-[16px] font-[600]">
          {borrowTokenLabel}
        </div>
        <CurrencyInput
          className=""
          balanceText={type !== ActionText.Repay ? 'Limit' : void 0}
          token={{
            ...market?.borrowToken,
            balance: borrowBalance,
          }}
          amount={borrowAmount}
          onAmount={handleBorrowAmount}
          onBalance={() => {
            handleBorrowAmount(borrowLimit);
          }}
          tokens={[]}
        />
        <div className="text-black text-[16px] font-[600] flex justify-between items-center">
          <div className="flex items-center gap-[5px]">
            <div>Updated Ratio</div>
            <Popover
              trigger={PopoverTrigger.Hover}
              placement={PopoverPlacement.Top}
              contentStyle={{ zIndex: 200 }}
              content={(
                <Card className="w-[300px] text-[14px]">
                  The ratio of your bHONEY's value to your NECT debt. It's vital to maintain this ratio above the minimum ratio of {market.MCR}% to avoid liquidations
                </Card>
              )}
            >
              <img src="/images/icon-tips.svg" alt="" className="w-[18px] h-[18px] cursor-pointer" />
            </Popover>
          </div>
          <Health risk={ratioRisk} />
        </div>
        <div className="w-full h-[72px] relative">
          <InputNumber
            className="w-full h-full border border-[#373A53] bg-white rounded-[12px] text-[26px] font-[700] pl-[20px] pr-[40px]"
            placeholder="0"
            value={ratio}
            onNumberChange={handleRatio}
          />
          <div className="absolute right-[20px] top-0 h-full flex items-center text-[26px] font-[700] text-black">%</div>
        </div>
        <div className="w-full mt-[10px]">
          <LendingButton
            type="primary"
            disabled={!buttonValid.valid || loading}
            invalidText={buttonValid.valid ? void 0 : buttonValid.text}
            loading={loading}
            style={{ height: 60, width: '100%' }}
            amount={amount || borrowAmount || ''}
            token={market}
            toastLoadingMsg={toastLoadingMsg}
            chain={{ chainId: DEFAULT_CHAIN_ID }}
            spender={market.approveSpender || network[market.vault]}
            provider={provider}
            unsignedTx={txData?.unsignedTx}
            gas={txData?.gas}
            config={{ ...basic, ...network }}
            onApprovedSuccess={() => {
              setLoading(true);
            }}
            onSuccess={() => {
              onSuccess?.();
              setAmount('');
              setBorrowAmount('');
            }}
            addAction={addAction}
          >
            {buttonValid.text}
          </LendingButton>
        </div>
      </div>

      <BeraborrowHandler
        config={{
          ...basic,
          ...network,
        }}
        market={market}
        actionText={actionText}
        provider={provider}
        update={loading}
        chainId={chainId}
        account={address}
        amount={amount}
        borrowAmount={borrowAmount}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
        }}
      />

      <ClosePositionModal
        {...props}
        visible={closePosition}
        onClose={() => {
          setClosePosition(false);
        }}
      />
    </div>
  );
};

const BorrowModal = (props: any) => {
  const { visible, onClose, type } = props;

  return (
    <Modal
      open={visible}
      onClose={onClose}
      isMaskClose={false}
    >
      <div className="bg-[#FFFDEB] rounded-[20px] border border-black shadow-shadow1 w-[900px]">
        <div className="text-black font-[700] text-[18px] px-[12px] pt-[20px]">
          {type === ActionText.Repay ? 'Manage' : type}
        </div>
        <Form {...props} />
      </div>
    </Modal>
  );
};

export default BorrowModal;

export enum ActionText {
  Borrow = 'Borrow',
  Repay = 'Repay',
  Close = 'Close',
}

export const CollateralAction: any = {
  [ActionText.Borrow]: 'Deposit',
  [ActionText.Repay]: 'Withdraw',
};