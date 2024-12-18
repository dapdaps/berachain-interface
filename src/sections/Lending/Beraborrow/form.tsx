import Modal from '@/components/modal';
import Info from '@/sections/Lending/Beraborrow/info';
import CurrencyInput from '@/sections/Lending/components/input';
import { useEffect, useMemo, useState } from 'react';
import Health, { getStatus } from '@/sections/Lending/Beraborrow/health';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import InputNumber from '@/components/input-number';
import Big from 'big.js';
import { numberFormatter, numberRemoveEndZero } from '@/utils/number-formatter';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import LendingButton from '@/sections/Lending/components/button';
import { DEFAULT_CHAIN_ID } from '@/configs';
import useAddAction from '@/hooks/use-add-action';
import ClosePositionModal from '@/sections/Lending/Beraborrow/close';
import { useDebounceFn } from 'ahooks';
import useIsMobile from '@/hooks/use-isMobile';
import { ethers, utils } from 'ethers';

const BASE_COLLATERAL_VAULT_ABI = [
  {
    type: "function",
    name: "previewDeposit",
    inputs: [{ name: "assets", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
];

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
    isMobile,
    onClose,
  } = props;

  const { address, chainId } = useAccount();
  const { provider } = useProvider();
  const { addAction } = useAddAction("lending");

  const [loading, setLoading] = useState<boolean>(false);
  const [inputLoading, setInputLoading] = useState<boolean>(false);
  const [closePosition, setClosePosition] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>();
  const [borrowAmount, setBorrowAmount] = useState<string>();
  const [previewAmount, setPreviewAmount] = useState<string>();
  const [ratio, setRatio] = useState<string>();
  const [ratioValue, setRatioValue] = useState<any>();
  const [txData, setTxData] = useState<any>();
  const [actionText, setActionText] = useState<ActionText>();
  const [calcPreviewAmountQueue, setCalcPreviewAmountQueue] = useState<any>([]);

  const calcTotalAmount = (_amount?: string) => {
    if (type === ActionText.Borrow) {
      return numberRemoveEndZero(Big(market.balance || 0).plus(_amount || 0).toFixed(market.decimals, Big.roundDown));
    }
    return numberRemoveEndZero(Big(market.balance || 0).minus(_amount || 0).toFixed(market.decimals, Big.roundDown));
  };
  const calcTotalBorrowAmount = (_borrowAmount?: string) => {
    if (type === ActionText.Borrow) {
      let _debtValue = Big(market.borrowed || 0).plus(Big(_borrowAmount || 0).plus(Big(_borrowAmount || 0).times(borrowingFee)));
      if (market.status !== 'open' && Big(_debtValue).gt(0)) {
        _debtValue = Big(_debtValue).plus(liquidationReserve);
      }
      return numberRemoveEndZero(_debtValue.toFixed(market?.borrowToken.decimals, Big.roundDown));
    }
    return numberRemoveEndZero(Big(market.borrowed || 0).minus(_borrowAmount || 0).toFixed(market?.borrowToken.decimals, Big.roundDown));
  };

  const totalAmount = useMemo(() => {
    if (type === ActionText.Repay) {
      return calcTotalAmount(amount);
    }
    return calcTotalAmount(previewAmount);
  }, [previewAmount, amount, market, type]);
  const totalCollAmount = useMemo(() => {
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
    const collateralValue = Big(collateralAmount || 0).times(market.price || 0);
    // NECT borrowed = collateral value / (Ratio / 100)
    let NECTBorrowed = Big(collateralValue).div(Big(_riskyRatio).div(100));
    // - Liquidation reserve
    NECTBorrowed = Big(NECTBorrowed.toFixed(2, Big.roundDown)).minus(liquidationReserve);
    NECTBorrowed = Big(NECTBorrowed).times(Big(1).minus(borrowingFee));
    let result = NECTBorrowed.minus(market.borrowed || 0).toFixed(5, Big.roundDown);
    if (Big(result).lte(0)) return '0';
    return result;
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

  const liquidationPriceNew = useMemo(() => {
    let liquidationPrice = Big(0);
    if (totalAmount && Big(totalAmount || 0).gt(0)) {
      liquidationPrice = Big(totalBorrowAmount || 0).times(Big(parseFloat(market.MCR)).div(100)).div(totalAmount);
    }
    return liquidationPrice;
  }, [market, totalAmount, totalBorrowAmount]);

  const buttonValid = useMemo(() => {
    let text: any = type;
    let _actions: any = [];
    let _actionTokens: any = [];
    let _actionAmounts: any = [];
    if (type === ActionText.Repay) {
      text = [];
      if (amount && Big(amount).gt(0)) {
        text.push('Withdraw');
        _actions.push('Withdraw');
        _actionTokens.push(market.collToken);
        _actionAmounts.push(amount);
      }
      if (borrowAmount && Big(borrowAmount).gt(0)) {
        text.push('Repay');
        _actions.push('Repay');
        _actionTokens.push(market.borrowToken);
        _actionAmounts.push(borrowAmount);
      }
      text = text.join(' & ');
    }
    if (type === ActionText.Borrow) {
      if (amount && Big(amount).gt(0)) {
        _actions.push('Deposit');
        _actionTokens.push(market);
        _actionAmounts.push(amount);
      }
      if (borrowAmount && Big(borrowAmount).gt(0)) {
        _actions.push('Borrow');
        _actionTokens.push(market.borrowToken);
        _actionAmounts.push(borrowAmount);
      }
    }
    const result = {
      valid: true,
      text: text,
      actions: _actions,
      actionTokens: _actionTokens,
      actionAmounts: _actionAmounts,
    };
    if (type === ActionText.Borrow) {
      if (Big(totalBorrowAmount || 0).lt(minimumDebt)) {
        result.valid = false;
        result.text = `Minimum Debt of ${minimumDebt} required`;
        return result;
      }
    }
    if (type === ActionText.Repay) {
      if (Big(borrowAmount || 0).gt(borrowBalance || 0)) {
        result.valid = false;
        result.text = `Insufficient ${market.borrowToken.symbol} Balance`;
        return result;
      }
      if (Big(totalBorrowAmount || 0).lt(minimumDebt)) {
        result.valid = false;
        result.text = `Minimum Debt of ${minimumDebt} required`;
        return result;
      }
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

  const { run: setCalcPreviewAmountQueueDelay } = useDebounceFn((val?: string) => {
    setCalcPreviewAmountQueue([...calcPreviewAmountQueue, {
      amount: val || '0',
      isCalcRatio: true,
      market,
      provider,
      liquidationReserve,
      type,
      borrowingFee,
    }]);
  }, { wait: 500 });

  const handleAmount = async (val: string) => {
    setInputLoading(true);
    setAmount(val);
    // calc Ratio
    setCalcPreviewAmountQueueDelay(val);
  };

  const handleBorrowAmount = (val: string) => {
    setInputLoading(true);
    setBorrowAmount(val);
    // calc Ratio
    const _borrowAmount = calcTotalBorrowAmount(val);
    const _ratio = calcRatio({
      _amount: totalAmount,
      _borrowAmount: _borrowAmount,
      market,
      liquidationReserve,
      type,
      borrowingFee,
    });
    setRatio(_ratio.ratio);
    setRatioValue(_ratio.ratioValue);
  };

  const handleRatio = (val: string) => {
    setRatio(val);
    setRatioValue(val);
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

  const { run: getTxData, cancel: cancelGetTxData } = useDebounceFn(() => {
    setLoading(true);
  }, { wait: 1000 });

  const { run: reloadList } = useDebounceFn(() => {
    onSuccess?.();
    setAmount('');
    setBorrowAmount('');
    setPreviewAmount('0');
  }, { wait: 1000 });

  useEffect(() => {
    cancelGetTxData();
    setLoading(false);
    if ((!borrowAmount || Big(borrowAmount).lte(0)) && (!amount || Big(amount).lte(0)) && (!ratioValue || Big(ratioValue).lte(0))) {
      return;
    }

    getTxData();
  }, [amount, borrowAmount, ratioValue]);

  useEffect(() => {
    setActionText(type);
  }, [type]);

  useEffect(() => {
    if (!calcPreviewAmountQueue.length) return;
    const curr = calcPreviewAmountQueue[0];
    getPreviewDeposit(curr).then((_preview: any) => {
      if (curr.isCalcRatio) {
        const _amount = calcTotalAmount(_preview);
        const _ratio = calcRatio({
          _amount: _amount,
          _borrowAmount: totalBorrowAmount,
          ...curr,
        });
        setRatio(_ratio.ratio);
        setRatioValue(_ratio.ratioValue);
      }
      setPreviewAmount(_preview);
      setCalcPreviewAmountQueue(calcPreviewAmountQueue.slice(1));
    });
  }, [calcPreviewAmountQueue]);

  return (
    <div
      className="px-[12px] py-[20px] flex justify-between items-stretch gap-4"
      style={isMobile ? { flexDirection: 'column', maxHeight: '80dvh', overflow: 'auto' } : {}}
    >
      <Info
        {...props}
        onClose={handleClosePosition}
        loading={loading}
        style={isMobile ? { width: '100%', order: 2 } : {}}
        newValue={((amount && Big(amount).gt(0)) || (borrowAmount && Big(borrowAmount).gt(0))) ? {
          balanceUsdShown: numberFormatter(Big(totalAmount).times(market.price || 1), 2, true, { prefix: '$' }),
          balanceShown: numberFormatter(totalAmount, 2, true),
          borrowedShown: numberFormatter(totalBorrowAmount, 2, true),
          liquidationPriceShown: numberFormatter(liquidationPriceNew, 2, true, { prefix: '$', round: Big.roundDown }),
          liquidationPrice: liquidationPriceNew,
        } : {}}
      />
      <div
        className="w-[450px] shrink-0 flex flex-col items-stretch gap-[10px]"
        style={isMobile ? { width: '100%', order: 1 } : {}}
      >
        <div className="text-black text-[16px] font-[600]">
          {CollateralAction[type]} Collateral
        </div>
        <CurrencyInput
          className=""
          token={{
            ...(type === ActionText.Repay ? { ...market.collToken, price: market.price } : market),
            balance: collateralBalance,
          }}
          amount={amount}
          onAmount={handleAmount}
          onBalance={() => {
            handleAmount(collateralBalance);
          }}
          tokens={[]}
          tokenSelectorStyle={{
            width: isMobile ? "auto" : 176,
          }}
          renderValue={(_amount: string) => {
            return numberFormatter(Big(previewAmount || 0).times(market.price || 1).toFixed(2, Big.roundDown), 2, true, { prefix: '$' });
          }}
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
            if (type === ActionText.Repay) {
              let _maxRepay = Big(totalBorrowAmount || 0).minus(minimumDebt).minus(liquidationReserve);
              handleBorrowAmount(numberRemoveEndZero(_maxRepay.toFixed(8)));
              return;
            }
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
            loading={loading || inputLoading}
            style={{ height: 60, width: '100%' }}
            amount={buttonValid.actionAmounts[0] || ''}
            token={market}
            toastLoadingMsg={toastLoadingMsg}
            chain={{ chainId: DEFAULT_CHAIN_ID }}
            isSkipApproved={type !== ActionText.Borrow || (market.status === 'open' && Big(amount || 0).lte(0))}
            isSkipAmountEmptyCheck={market.status === 'open' && (Big(amount || 0).gt(0) || Big(borrowAmount || 0).gt(0))}
            spender={market.approveSpender || network[market.vault]}
            provider={provider}
            unsignedTx={txData?.unsignedTx}
            gas={txData?.gas}
            config={{ ...basic, ...network }}
            onApprovedSuccess={() => {
              getTxData();
            }}
            onSuccess={() => {
              reloadList();
            }}
            addAction={addAction}
            addActionText={buttonValid.actions[0]}
            addActionToken={buttonValid.actionTokens[0]}
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
        totalAmount={totalAmount}
        totalCollAmount={totalCollAmount}
        totalBorrowAmount={totalBorrowAmount}
        ratio={ratioValue}
        onLoad={(txData: any) => {
          console.log('%chandler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
          setTxData(txData);
          setLoading(false);
          setInputLoading(false);
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

  const isMobile = useIsMobile();

  return (
    <Modal
      open={visible}
      onClose={onClose}
      isMaskClose={isMobile}
    >
      <div
        className="bg-[#FFFDEB] rounded-[20px] border border-black shadow-shadow1"
        style={{ width: isMobile ? '100%' : 900 }}
      >
        <div className="text-black font-[700] text-[18px] px-[12px] pt-[20px]">
          {type === ActionText.Repay ? 'Manage' : type}
        </div>
        <Form {...props} isMobile={isMobile} />
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

const getPreviewDeposit = ({ amount, market, provider }: { amount: string; market: any; provider: any; }) => {
  return new Promise((resolve) => {
    if (!amount || Big(amount).lte(0)) {
      resolve('0');
      return;
    }
    const contract = new ethers.Contract(market.collVault, BASE_COLLATERAL_VAULT_ABI, provider);
    const params = [utils.parseUnits(amount, market.decimals)];
    contract.previewDeposit(...params).then((res: any) => {
      const _previewAmount = utils.formatUnits(res?._hex || '0', market.decimals);
      resolve(_previewAmount);
    }).catch((err: any) => {
      console.log('getPreviewDeposit failed: %o', err);
      resolve(amount);
    }).finally(() => {
      console.log('getPreviewDeposit amount: %o', amount);
    });
  });
};

const calcRatio = (props: { _amount?: string; _borrowAmount?: string; market: any; liquidationReserve: number; type: ActionText; borrowingFee: number; }) => {
  const { _amount, _borrowAmount, market, type, liquidationReserve, borrowingFee } = props;
  const collateralValue = Big(_amount || 0).times(market.price);
  if (!_borrowAmount || Big(_borrowAmount).lte(0)) {
    const _ratioVal = Big(collateralValue).div(1).times(100);
    return {
      ratio: numberRemoveEndZero(_ratioVal.toFixed(2)),
      ratioValue: _ratioVal,
    };
  }
  const borrowValue = Big(_borrowAmount).times(market.borrowToken.price);
  let _ratioVal = Big(collateralValue).div(Big(borrowValue)).times(100);
  if (market.status === 'open') {
    _ratioVal = Big(collateralValue).div(Big(borrowValue)).times(100);
  }
  if (type === ActionText.Repay) {
    _ratioVal = Big(collateralValue).div(Big(_borrowAmount)).times(100);
  }
  const _ratio = numberRemoveEndZero(_ratioVal.toFixed(2));
  return { ratio: _ratio, ratioValue: _ratioVal };
};
