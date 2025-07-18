import useAddAction from "@/hooks/use-add-action";
import { useProvider } from "@/hooks/use-provider";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { numberRemoveEndZero } from "@/utils/number-formatter";
import Big from "big.js";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import Card from "@/components/card";
import { useDebounceFn } from "ahooks";
import { ethers, utils } from "ethers";
import { getStatus } from '@/sections/Lending/Beraborrow/health';

export function useBeraborrow(props: any) {
  const {
    type,
    market,
    riskyRatio,
    borrowingFee,
    liquidationReserve,
    minimumDebt,
    onSuccess,
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
    if (!market) return '0';
    if (type === ActionText.Borrow) {
      return numberRemoveEndZero(Big(market.balance || 0).plus(_amount || 0).toFixed(market.decimals, Big.roundDown));
    }
    return numberRemoveEndZero(Big(market.balance || 0).minus(_amount || 0).toFixed(market.decimals, Big.roundDown));
  };
  const calcTotalBorrowAmount = (_borrowAmount?: string) => {
    if (!market || !market?.borrowToken) return '0';
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
    if (market?.status === 'open') {
      return `${market?.borrowToken?.symbol} to be Minted`;
    }
    return `${market?.borrowToken?.symbol} to be Minted`;
  }, [type, market, market?.borrowToken]);

  const calcNECTBorrowed = (collateralAmount: any, _riskyRatio: string) => {
    const collateralValue = Big(collateralAmount || 0).times(market?.price || 0);
    // NECT borrowed = collateral value / (Ratio / 100)
    let NECTBorrowed = Big(collateralValue).div(Big(_riskyRatio).div(100));
    // - Liquidation reserve
    NECTBorrowed = Big(NECTBorrowed.toFixed(2, Big.roundDown)).minus(liquidationReserve);
    NECTBorrowed = Big(NECTBorrowed).times(Big(1).minus(borrowingFee));
    let result = NECTBorrowed.minus(market?.borrowed || 0).toFixed(5, Big.roundDown);
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
      return market?.walletBalance;
    }
    return market?.balance;
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
    if (!market || !market.borrowToken) return result;
    if (type === ActionText.Borrow) {
      if (Big(totalBorrowAmount || 0).lt(minimumDebt)) {
        result.valid = false;
        result.text = (
          <div className='flex items-center justify-center gap-[8px]'>
            <Popover
              trigger={PopoverTrigger.Hover}
              placement={PopoverPlacement.Top}
              contentStyle={{ zIndex: 200 }}
              content={(
                <Card className="w-[300px] text-[14px]">
                  A minimum debt of {minimumDebt} is required to proceed with this action. Please increase the amount of 70 you are minting or Close your Position
                </Card>
              )}
            >
              <img src="/images/icon-tips.svg" alt="" className="w-[18px] h-[18px] cursor-pointer" />
            </Popover>
            <span>{`Minimum Debt of ${minimumDebt} required`}</span>
          </div>
        );
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

  return {
    handleClosePosition,
    loading,
    amount,
    borrowAmount,
    totalAmount,
    totalBorrowAmount,
    liquidationPriceNew,
    handleAmount,
    collateralBalance,
    previewAmount,
    borrowTokenLabel,
    borrowBalance,
    handleBorrowAmount,
    borrowLimit,
    ratioRisk,
    ratio,
    handleRatio,
    buttonValid,
    inputLoading,
    toastLoadingMsg,
    provider,
    txData,
    getTxData,
    reloadList,
    addAction,
    actionText,
    chainId,
    address,
    totalCollAmount,
    ratioValue,
    setTxData,
    setLoading,
    setInputLoading,
    closePosition,
    setClosePosition,
  };
}


export enum ActionText {
  Borrow = 'Borrow',
  Repay = 'Repay',
  Close = 'Close',
}

export const CollateralAction: any = {
  [ActionText.Borrow]: 'Deposit',
  [ActionText.Repay]: 'Withdraw',
};

export const BASE_COLLATERAL_VAULT_ABI = [
  {
    type: "function",
    name: "previewDeposit",
    inputs: [{ name: "assets", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
];

export const getPreviewDeposit = ({ amount, market, provider }: { amount: string; market: any; provider: any; }) => {
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
    });
  });
};

const calcRatio = (props: { _amount?: string; _borrowAmount?: string; market: any; liquidationReserve: number; type: ActionText; borrowingFee: number; }) => {
  const { _amount, _borrowAmount, market, type, liquidationReserve, borrowingFee } = props;
  const collateralValue = Big(_amount || 0).times(market.price || 0);
  if (!_borrowAmount || Big(_borrowAmount).lte(0)) {
    const _ratioVal = Big(collateralValue).div(1).times(100);
    return {
      ratio: numberRemoveEndZero(_ratioVal.toFixed(2)),
      ratioValue: _ratioVal,
    };
  }
  const borrowValue = Big(_borrowAmount).times(market.borrowToken?.price || 0);
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

export const LEVERAGE_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "currentColl", type: "uint256" },
      { internalType: "uint256", name: "currentDebt", type: "uint256" },
      { internalType: "uint256", name: "margin", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
      { internalType: "uint256", name: "minimumCR", type: "uint256" }
    ],
    name: "calculateMaxLeverage",
    outputs: [
      { internalType: "uint256", name: "maxLeverageInBp", type: "uint256" }
    ],
    stateMutability: "pure",
    type: "function"
  },
  {
    inputs: [
      { internalType: "contract IDenManager", name: "denManager", type: "address" },
      { internalType: "address", name: "position", type: "address" },
      { internalType: "uint256", name: "margin", type: "uint256" },
      { internalType: "uint256", name: "leverage", type: "uint256" },
      { internalType: "uint256", name: "minimumCR", type: "uint256" },
      { internalType: "bool", name: "isRecoveryMode", type: "bool" }
    ],
    name: "calculateDebtAmount",
    outputs: [
      { internalType: "uint256", name: "debtAmount", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IDenManager",
        "name": "denManager",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "flashloanNectAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "marginCollAmount",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "maxFeePercentage",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "upperHint",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "lowerHint",
                "type": "address"
              }
            ],
            "internalType": "struct ILeverageRouter.DenParams",
            "name": "denParams",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bytes",
                "name": "dexCalldata",
                "type": "bytes"
              },
              {
                "internalType": "uint256",
                "name": "outputMin",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "swapRouter",
                "type": "address"
              }
            ],
            "internalType": "struct ILeverageRouter.DexAggregatorParams",
            "name": "nectToColl",
            "type": "tuple"
          }
        ],
        "internalType": "struct ILeverageRouter.DenLoopingParams",
        "name": "denLoopingParams",
        "type": "tuple"
      }
    ],
    "name": "automaticLoopingOpenDen",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IDenManager",
        "name": "denManager",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "flashloanNectAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "marginCollAmount",
            "type": "uint256"
          },
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "maxFeePercentage",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "upperHint",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "lowerHint",
                "type": "address"
              }
            ],
            "internalType": "struct ILeverageRouter.DenParams",
            "name": "denParams",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bytes",
                "name": "dexCalldata",
                "type": "bytes"
              },
              {
                "internalType": "uint256",
                "name": "outputMin",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "swapRouter",
                "type": "address"
              }
            ],
            "internalType": "struct ILeverageRouter.DexAggregatorParams",
            "name": "nectToColl",
            "type": "tuple"
          }
        ],
        "internalType": "struct ILeverageRouter.DenLoopingParams",
        "name": "denLoopingParams",
        "type": "tuple"
      }
    ],
    "name": "automaticLoopingAddCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const BORROWER_OPERATIONS_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "owner", "type": "address" },
      { "internalType": "address", "name": "caller", "type": "address" }
    ],
    "name": "isApprovedDelegate",
    "outputs": [
      { "internalType": "bool", "name": "isApproved", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_delegate", "type": "address" },
      { "internalType": "bool", "name": "_isApproved", "type": "bool" }
    ],
    "name": "setDelegateApproval",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const COLL_VAULAT_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "assets", "type": "uint256" },
      { "internalType": "address", "name": "receiver", "type": "address" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "shares", "type": "uint256" },
      { "internalType": "address", "name": "receiver", "type": "address" },
      { "internalType": "address", "name": "_owner", "type": "address" }
    ],
    "name": "redeem",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "shares", "type": "uint256" }
    ],
    "name": "previewRedeem",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getWithdrawFee",
    "outputs": [
      { "internalType": "uint16", "name": "", "type": "uint16" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "contract IInfraredCollateralVault", "name": "collVault", "type": "address" },
      { "internalType": "uint256", "name": "sharesToRedeem", "type": "uint256" }
    ],
    "name": "previewRedeemUnderlying",
    "outputs": [
      { "internalType": "address[]", "name": "tokens", "type": "address[]" },
      { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

