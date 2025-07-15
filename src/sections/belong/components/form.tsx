import LazyImage from "@/components/layz-image";
import Range from "@/components/range";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import beraborrowConfig from "@/configs/lending/beraborrow";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import useCustomAccount from "@/hooks/use-account";
import { numberFormatter, numberRemoveEndZero } from "@/utils/number-formatter";
import { ActionText, BORROWER_OPERATIONS_ABI, COLL_VAULAT_ABI, getPreviewDeposit, LEVERAGE_ROUTER_ABI, useBeraborrow } from "@/sections/Lending/hooks/use-beraborrow";
import Big from "big.js";
import { getStatus } from "@/sections/Lending/Beraborrow/health";
import { useRequest } from "ahooks";
import { getHint } from "@/sections/Lending/handlers/beraborrow";
import axios from "axios";
import { _normalizeDenCreation, Den, SCALING_FACTOR, SCALING_FACTOR_BP, UserDenStatus } from "@/sections/Lending/datas/beraborrow/den";
import { Contract } from "ethers";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import Card from "@/components/card";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Loading from "@/components/loading";
import { useSwitchChain } from 'wagmi';
import useApprove from "@/hooks/use-approve";
import TokenAmount from "@/sections/swap/TokenAmount";
import TokenSelector from "@/sections/swap/TokenSelector";
import BelongTips from "./tips";
import clsx from "clsx";
import Link from "next/link";
import { ERC20_ABI } from "@/hooks/use-tokens-balance";
import ResultModal from "./result";
import useTokenBalance from "@/hooks/use-token-balance";
import Position from "./position";
import ShareModal from "./share";

const BeraborrowData = dynamic(() => import('@/sections/Lending/datas/beraborrow'));

const DEFAULT_SLIPPAGE_TOLERANCE = BigInt(10000000000000000);
const MAXIMUM_BORROWING_MINT_RATE = BigInt(50000000000000000);

const BelongForm = (props: any) => {
  const { className } = props;

  const { basic, networks }: any = beraborrowConfig;
  let {
    leverageMarkets = [],
    riskyRatio,
    liquidationReserve,
    borrowingFee,
    minimumDebt,
    multiCollateralHintHelpers,
    leverageRouter,
    borrowerOperations,
  } = networks?.[DEFAULT_CHAIN_ID + ''] || {};

  // KODI iBERA-wgBERA
  const TARGET_MARKET = leverageMarkets.find((m: any) => m.id === 8);

  const { account, provider, chainId } = useCustomAccount();
  const prices = usePriceStore((store) => store.price);
  const toast = useToast();
  const { addAction } = useAddAction("belong");
  const modal = useConnectModal();
  const { switchChain } = useSwitchChain();

  const vaultRef = useRef<any>();

  const [currentInputMarket, setCurrentInputMarket] = useState<any>(leverageMarkets[0]);
  const [currentInputAmount, setCurrentInputAmount] = useState<any>();
  const [currentInputSwaped, setCurrentInputSwaped] = useState<any>(false);
  const [currentInputSwapedData, setCurrentInputSwapedData] = useState<any>();

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [leverage, setLeverage] = useState("1");
  const [leverageProgress, setLeverageProgress] = useState(0);
  const [currentMarket] = useState<any>(TARGET_MARKET);
  const [data, setData] = useState<any>();
  const [marginInSharesData, setMarginInSharesData] = useState<any>();
  const [maxLeverage, setMaxLeverage] = useState<any>("6");
  const [tokenSelectorVisible, setTokenSelectorVisible] = useState<any>(false);
  const [inputCurrencyUpdater, setInputCurrencyUpdater] = useState<any>(1);
  const [resultModalOpen, setResultModalOpen] = useState<any>(false);
  const [shareModalOpen, setShareModalOpen] = useState<any>(false);
  const [currentLeverageTxHash, setCurrentLeverageTxHash] = useState<any>("");

  const [isLeverage] = useMemo(() => {
    return [!!leverage && Big(leverage).gt(1)];
  }, [leverage]);

  const [currentMarketData] = useMemo(() => {
    if (!data || !data.markets || !data.markets.length) {
      return [];
    }
    return [
      { ...data, ...data.markets[0] },
    ];
  }, [data]);

  const isChainSupported = useMemo(() => {
    if (!chainId) {
      return false;
    }
    const currChain = networks[chainId];
    return !!currChain;
  }, [chainId]);

  const beraborrowData = useBeraborrow({
    type: ActionText.Borrow,
    market: currentMarketData || currentMarket,
    riskyRatio,
    borrowingFee,
    liquidationReserve,
    minimumDebt,
    onSuccess: () => { },
  });
  const {
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
    inputLoading,
    toastLoadingMsg,
    txData,
    getTxData,
    reloadList,
    actionText,
    address,
    totalCollAmount,
    ratioValue,
    setTxData,
    setLoading,
    setInputLoading,
    closePosition,
    setClosePosition,
  } = beraborrowData;

  const {
    approved: collateralApproved,
    approve: onCollateralApprove,
    approving: collateralApproving,
    checking: collateralChecking,
    allowance: collateralAllowance,
    checkApproved: collateralCheckApproved,
  } = useApprove({
    token: currentMarket,
    amount,
    spender: leverageRouter,
  });

  const { runAsync: getOutputAmountData, loading: outputAmountDataLoading, data: outputAmountData } = useRequest(async () => {
    setCurrentInputSwaped(false);
    if (!currentInputMarket || !account || !currentInputAmount || Big(currentInputAmount).lte(0)) {
      handleAmount("");
      return;
    }
    if (currentInputMarket.address === currentMarket.address) {
      handleAmount(currentInputAmount);
      setCurrentInputSwaped(true);
      setCurrentInputSwapedData({
        value: currentInputAmount,
        big: BigInt(Big(currentInputAmount).times(SCALING_FACTOR.toString()).toFixed(0)),
      });
      return {
        amountOutValue: currentInputAmount,
        amountOutBig: BigInt(Big(currentInputAmount).times(SCALING_FACTOR.toString()).toFixed(0)),
      };
    }
    const DexCallURL = new URL("https://api.beraborrow.com/v1/enso/swap");
    DexCallURL.searchParams.set("tokenIn", currentInputMarket.isNative ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" : currentInputMarket.address);
    DexCallURL.searchParams.set("tokenOut", isLeverage ? currentMarket.address : currentMarket.beraborrowToken);
    DexCallURL.searchParams.set("to", account);
    DexCallURL.searchParams.set("amount", Big(currentInputAmount || 0).times(SCALING_FACTOR.toString()).toFixed(0));
    DexCallURL.searchParams.set("slippage", Big(DEFAULT_SLIPPAGE_TOLERANCE.toString()).div(10 ** 16).toString());
    try {
      const res = await axios({
        url: DexCallURL.toString(),
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200 && res.data?.data?.amountOut) {
        const { amountOut } = res.data.data;
        const amountOutValue = numberRemoveEndZero(Big(amountOut).div(SCALING_FACTOR.toString()).toFixed(currentMarket.decimals));
        handleAmount(amountOutValue);
        return {
          ...res.data.data,
          amountOutValue,
          amountOutBig: BigInt(amountOut),
        };
      }
      console.log("getOutputAmount res: %o", res);
    } catch (err: any) {
      console.log('getOutputAmount failed: %o', err);
    }
    handleAmount("");
  }, {
    refreshDeps: [
      currentInputMarket,
      account,
      currentInputAmount,
      isLeverage,
    ],
    debounceWait: 1000,
  });

  const {
    approved: inputApproved,
    approve: onInputApprove,
    approving: inputApproving,
    checking: inputChecking,
    allowance: inputAllowance,
    checkApproved: inputCheckApproved,
  } = useApprove({
    token: currentInputMarket,
    amount: currentInputAmount,
    spender: outputAmountData?.tx?.to,
  });

  const {
    approved: depositApproved,
    approve: onDepositApprove,
    approving: depositApproving,
    checking: depositChecking,
    allowance: depositAllowance,
    checkApproved: depositCheckApproved,
  } = useApprove({
    token: currentMarket,
    amount: currentInputSwapedData?.value,
    spender: currentMarket?.collVault,
  });

  const {
    tokenBalance: currentInputMarketWalletBalance,
    update: updateCurrentInputMarketWalletBalance
  } = useTokenBalance(currentInputMarket.address, currentInputMarket.decimals);

  const { runAsync: getMarginInShares, cancel: cancelGetMarginInShares, loading: marginInSharesLoading } = useRequest(async () => {
    if (!currentMarketData) {
      return;
    }
    const priceBig = BigInt(Big(currentMarketData.price).times(SCALING_FACTOR.toString()).toFixed(0));
    const collPriceBig = BigInt(Big(currentMarketData.collPrice).times(SCALING_FACTOR.toString()).toFixed(0));
    const debtPriceBig = BigInt(Big(currentMarketData.borrowToken.realPrice).times(SCALING_FACTOR.toString()).toFixed(0));
    const MCRBig = BigInt(Big(currentMarketData.MCR).div(100).times(SCALING_FACTOR.toString()).toFixed(0));
    const borrowingRateBig = BigInt(Big(currentMarketData.borrowingRate).times(SCALING_FACTOR.toString()).toFixed(0));
    const leverageBP = BigInt(Big(leverage).minus(1).times(SCALING_FACTOR_BP.toString()).toFixed(0));
    const liquidationReserveBig = BigInt(Big(liquidationReserve).times(SCALING_FACTOR.toString()).toFixed(0));
    const amountBig = BigInt(Big(amount || 0).times(SCALING_FACTOR.toString()).toFixed(0));

    // First get the latest den
    const addedCollateralDen = currentMarketData.den?.addCollateral(BigInt(Big(amount || 0).times(SCALING_FACTOR.toString()).toFixed(0)));
    // Get the accumulated collateral
    const addedCollateral = addedCollateralDen.collateral;
    // Get the accumulated debt
    const addedDebt = addedCollateralDen.debt;

    if (addedCollateral === BigInt(0)) {
      return;
    }

    // Get the accumulated PreviewDeposit
    let addedPreviewDeposit: any = await getPreviewDeposit({
      amount: amount || "0",
      market: currentMarketData,
      provider,
    });
    addedPreviewDeposit = BigInt(Big(addedPreviewDeposit || 0).times(SCALING_FACTOR.toString()).toFixed(0));
    // Convert CollateralShares
    const collateralSharesDen = addedCollateralDen.convertCollateralToCollateralShares(addedPreviewDeposit);
    // Get the accumulated CollateralShares
    const addedCollateralShares = collateralSharesDen.getCollateralShares();

    // Calculate maximum _leverage
    let maxLeverageRes: any = "1";
    try {
      const calculateMaxLeverageParams = [
        addedCollateral,
        addedDebt,
        addedCollateralShares,
        collPriceBig,
        MCRBig,
      ];
      const res = await new Contract(leverageRouter, LEVERAGE_ROUTER_ABI, provider).calculateMaxLeverage(...calculateMaxLeverageParams);
      maxLeverageRes = res ? Big(Big(res.toString()).div(SCALING_FACTOR_BP.toString()).toFixed(1, 0)) : "1";
      setMaxLeverage((_maxLeverage: any) => {
        if (maxLeverageRes !== _maxLeverage && Big(maxLeverageRes).gt(1)) {
          const _leverageProgress = Big(Big(leverage).minus(1)).div(Big(maxLeverageRes).minus(1)).times(100).toNumber();
          setLeverageProgress(_leverageProgress);
        }
        return maxLeverageRes;
      });
      if (Big(maxLeverageRes).lt(leverage)) {
        setLeverage("1");
      }
    } catch (err: any) {
      console.log('Failed to calculate maximum _leverage: %o', err);
    }

    return {
      priceBig,
      collPriceBig,
      debtPriceBig,
      MCRBig,
      borrowingRateBig,
      leverageBP,
      addedCollateral,
      addedDebt,
      addedPreviewDeposit,
      addedCollateralDen,
      marginInShares: addedCollateralShares,
      liquidationReserveBig,
      amountBig,
    };
  }, {
    manual: true,
    debounceWait: 1000,
  });

  const calculateDebtAmountData = useMemo(() => {
    if (!marginInSharesData || !currentMarketData || !currentMarketData.borrowToken) {
      return { big: BigInt(0), value: "0", fee: "0" };
    }
    const {
      priceBig,
      collPriceBig,
      debtPriceBig,
      MCRBig,
      leverageBP,
      addedCollateral,
      addedDebt,
      addedPreviewDeposit,
      addedCollateralDen,
      marginInShares,
      liquidationReserveBig,
    } = marginInSharesData;
    const isActive = currentMarketData.denStatus === UserDenStatus.active;

    // Calculate leveraged debt
    const leveragedDebt = addedCollateralDen.calculateLeveragedDebt(
      addedCollateral,
      leverageBP,
      collPriceBig,
      debtPriceBig,
    );
    const borrowingFeeValue = Big(leveragedDebt.toString()).div(SCALING_FACTOR.toString()).times(borrowingFee).toFixed(2);
    const borrowingFeeBig = BigInt(Big(leveragedDebt.toString()).times(borrowingFee).toFixed(0));
    const totalDebt = addedCollateralDen.debt + leveragedDebt + borrowingFeeBig + (isActive ? BigInt(0) : liquidationReserveBig);
    const totalDebtValue = Big(totalDebt.toString()).div(SCALING_FACTOR.toString()).toString();
    const debtValue = Big(leveragedDebt.toString()).div(SCALING_FACTOR.toString()).toString();
    handleBorrowAmount(totalDebtValue);
    return {
      big: leveragedDebt,
      value: debtValue,
      totalBig: totalDebt,
      totalValue: totalDebtValue,
      borrowingFee: borrowingFeeValue,
      liquidationReserveFee: isActive ? "0" : liquidationReserve,
      fee: Big((borrowingFeeBig + (isActive ? BigInt(0) : liquidationReserveBig)).toString()).div(SCALING_FACTOR.toString()).toString(),
    };
  }, [
    marginInSharesData,
    currentMarketData,
    account,
    chainId,
    provider,
    isLeverage
  ]);

  const { runAsync: automaticLooping, data: automaticLoopingData, loading: automaticLoopingLoading } = useRequest(async () => {
    if (!marginInSharesData || !calculateDebtAmountData || calculateDebtAmountData.big === BigInt(0) || !currentMarketData || !currentMarketData.borrowToken) {
      return;
    }

    const {
      priceBig,
      collPriceBig,
      debtPriceBig,
      MCRBig,
      leverageBP,
      addedCollateral,
      addedDebt,
      addedPreviewDeposit,
      addedCollateralDen,
      marginInShares,
      amountBig,
    } = marginInSharesData;
    const { big: debtBig, value: debtValue, totalBig: totalDebtBig, totalValue: totalDebtValue } = calculateDebtAmountData;

    // Get swap
    let dexCalldataResp: any;
    const DexCallURL = new URL("https://api.beraborrow.com/v1/enso/leverage-swap");
    DexCallURL.searchParams.set("user", account);
    DexCallURL.searchParams.set("dmAddr", currentMarketData.denManager);
    DexCallURL.searchParams.set("marginInShares", addedPreviewDeposit.toString());
    DexCallURL.searchParams.set("leverage", Big(leverage || 0).times(SCALING_FACTOR_BP.toString()).toFixed(0));
    DexCallURL.searchParams.set("debtAmount", debtBig);
    DexCallURL.searchParams.set("slippage", Big(DEFAULT_SLIPPAGE_TOLERANCE.toString()).div(10 ** 16).toString());
    try {
      dexCalldataResp = await axios.get(DexCallURL.toString());
    } catch (err: any) {
      console.log('automaticLooping failed: %o', err);
    }

    if (dexCalldataResp?.status !== 200 || !dexCalldataResp?.data?.data?.amountOut) {
      return;
    }

    const { amountOut } = dexCalldataResp.data.data;

    const _amountOutValue = Big(amountOut).div(10 ** currentMarketData.decimals).plus(Big(addedCollateral.toString()).div(SCALING_FACTOR.toString()));
    const route = {
      ...dexCalldataResp.data.data,
      amountOutValue: numberRemoveEndZero(_amountOutValue.toFixed(currentMarketData.decimals)),
      amountOutUsd: Big(_amountOutValue).times(currentMarketData?.collPrice || 0).toFixed(2),
    };

    // Get liquidation price
    const dexCollOutput = BigInt(amountOut);
    const dexCollOutputInShares = dexCollOutput + addedCollateral;
    const params: any = { borrowNECT: debtBig, depositCollateral: dexCollOutputInShares };
    const newDen = new Den(dexCollOutputInShares, debtBig);
    const _liquidationPrice = newDen.calculateLiquidationPrice(MCRBig);
    const liquidationPrice = {
      big: _liquidationPrice,
      value: Big(_liquidationPrice.toString()).div(SCALING_FACTOR.toString()).toString(),
    };

    // Get hints
    const hints = await getHint({
      market: {
        ...currentMarketData,
        den: newDen,
      },
      account,
      chainId,
      provider,
      multiCollateralHintHelpers,
    });

    // Get ratio
    const newRatioDen = new Den(dexCollOutput + addedCollateral, totalDebtBig);
    const leverageRatio = newRatioDen.collateralRatio(collPriceBig);

    return {
      route,
      hints,
      liquidationPrice,
      leverageRatio: {
        big: leverageRatio,
        value: Big(leverageRatio.toString()).div(SCALING_FACTOR.toString()).times(100).toString(),
      },
      params,
      den: newRatioDen,
    };
  }, {
    refreshDeps: [
      marginInSharesData,
      calculateDebtAmountData,
      currentMarketData,
      account,
      chainId,
      provider,
    ],
    debounceWait: 1000,
  });

  const handleLeverageChange = (value: any) => {
    if (Big(maxLeverage || 1).lte(1)) {
      return;
    }
    setLeverageProgress(value);
    const _leverage = Big(maxLeverage).minus(1).times(Big(value || 0).div(100)).plus(1).toFixed(1);
    setLeverage(_leverage);
  };

  const { runAsync: getApproved, loading: checkApproving, data: approved } = useRequest(async () => {
    if (!account || !provider) {
      return false;
    }

    const borrowerOperationsContract = new Contract(borrowerOperations, BORROWER_OPERATIONS_ABI, provider);
    const isApproved = await borrowerOperationsContract.isApprovedDelegate(account, leverageRouter);
    return isApproved;
  }, {
    refreshDeps: [
      account,
      provider,
    ]
  });

  const { runAsync: setApprove, loading: approving } = useRequest(async () => {
    if (!account || !provider) {
      return;
    }

    let toastId = toast.loading({ title: "Approving..." });
    const signer = provider.getSigner(account);
    const borrowerOperationsContract = new Contract(borrowerOperations, BORROWER_OPERATIONS_ABI, signer);
    try {
      const tx = await borrowerOperationsContract.setDelegateApproval(leverageRouter, true);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming...", tx: tx.hash, chainId: DEFAULT_CHAIN_ID });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({ title: "Approved successfully!", tx: transactionHash, chainId: DEFAULT_CHAIN_ID });
      } else {
        toast.fail({ title: "Approve Failed!" });
      }
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : ""
      });
    }
    getApproved();
  }, {
    manual: true
  });

  const { runAsync: handleSwap, loading: swapping, data: swappedData } = useRequest(async (params?: { isDeposit?: boolean; }) => {
    let toastId: any;
    const signer = provider.getSigner(account);

    setCurrentInputSwapedData(void 0);

    // swap approve
    if (!inputApproved) {
      onInputApprove();
      return false;
    }
    if (!outputAmountData) {
      toast.fail({ title: "Failed to get route, please try again later!" });
      return false;
    }
    try {
      toastId = toast.loading({ title: params?.isDeposit ? "Depositing..." : "Swapping..." });
      const swapTx = await signer.sendTransaction(outputAmountData.tx);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming...", tx: swapTx.hash, chainId: DEFAULT_CHAIN_ID });
      const { status, transactionHash } = await swapTx.wait();
      toast.dismiss(toastId);
      if (status !== 1) {
        toast.fail({ title: `${params?.isDeposit ? "Deposited" : "Swapped"} Failed!` });
        return false;
      }
      toast.success({
        title: `${params?.isDeposit ? "Deposited" : "Swapped"} successfully!`,
        tx: transactionHash,
        chainId: DEFAULT_CHAIN_ID
      });
    } catch (swapError: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: swapError?.message?.includes("user rejected transaction") ? "User rejected transaction" : `${params?.isDeposit ? "Deposited" : "Swapped"} Failed!`
      });
      return false;
    }
    // get swapped output amount
    let swappedOutputAmount = BigInt(outputAmountData.amountOut);
    // get balance of output token
    const outputTokenContract = new Contract(currentMarketData.address, ERC20_ABI, provider);
    const outputTokenBalance = await outputTokenContract.balanceOf(account);
    const outputTokenBalanceValue = outputTokenBalance ? BigInt(outputTokenBalance.toString()) : BigInt(0);
    let depositAmountValue: any = swappedOutputAmount;
    if (swappedOutputAmount > outputTokenBalanceValue) {
      depositAmountValue = outputTokenBalanceValue;
    }
    const _depositAmountValue = Big(depositAmountValue.toString()).div(10 ** currentMarketData.decimals).toFixed(currentMarketData.decimals);
    if (params?.isDeposit) {
      afterSuccess();
    } else {
      setCurrentInputSwaped(true);
      setCurrentInputSwapedData({ value: _depositAmountValue, big: depositAmountValue });
    }
    return { value: _depositAmountValue, big: depositAmountValue };
  }, { manual: true });

  const afterSuccess = () => {
    setCurrentInputSwaped(false);
    setCurrentInputAmount("");
    setCurrentInputSwapedData(void 0);
    updateCurrentInputMarketWalletBalance();
    vaultRef.current?.getPositionBalance?.();
  };

  const { runAsync: handleDeposit, loading: depositing } = useRequest(async (params: any) => {
    let toastId: any;
    const signer = provider.getSigner(account);
    const depositContract = new Contract(currentMarketData.collVault, COLL_VAULAT_ABI, signer);
    const depositOptions: any = {};
    const depositParams = [
      params.big,
      account
    ];

    if (!depositApproved) {
      onDepositApprove();
      return;
    }

    try {
      const gasLimit = await depositContract.estimateGas.deposit(...depositParams, depositOptions);
      depositOptions.gasLimit = gasLimit;
    } catch (err: any) {
      console.log("estimate gas error: %o", err);
      depositOptions.gasLimit = 4000000;
    }
    try {
      toastId = toast.loading({ title: "Depositing..." });
      const tx = await depositContract.deposit(...depositParams, depositOptions);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming...", tx: tx.hash, chainId: DEFAULT_CHAIN_ID });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({ title: "Deposit successfully!", tx: transactionHash, chainId: DEFAULT_CHAIN_ID });
        afterSuccess();
      } else {
        toast.fail({ title: "Deposit Failed!" });
      }
    } catch (err: any) {
      console.log("deposit error: %o", err);
      toast.dismiss(toastId);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : "Deposit Failed!"
      });
    }
  }, { manual: true });

  const { runAsync: handleSubmit, loading: submitting } = useRequest(async () => {
    let toastId: any;
    const signer = provider.getSigner(account);

    if (!account) {
      modal.openConnectModal?.();
      return;
    }

    if (DEFAULT_CHAIN_ID !== chainId) {
      switchChain({
        chainId: DEFAULT_CHAIN_ID,
      });
      return;
    }

    // Without leverage
    if (!isLeverage) {
      // skip swap and deposit to vault directly
      if (currentInputMarket.address === currentMarket.address) {
        await handleDeposit({
          value: currentInputAmount,
          big: BigInt(Big(currentInputAmount).times(10 ** currentInputMarket.decimals).toFixed(0)),
        });
      }
      // swap to bb token directly
      else {
        await handleSwap({ isDeposit: true });
      }
      return;
    }

    if (!automaticLoopingData || !currentMarketData || !currentMarketData.den || !marginInSharesData) {
      return;
    }

    const { route, hints }: any = automaticLoopingData;
    if (!route || !hints) {
      return;
    }

    if (!currentInputSwaped) {
      const _swappedData = await handleSwap();
      if (!_swappedData) {
        return;
      }
      // after swap, we should reload the marginInSharesData
      if (Big(_swappedData.value || 0).gt(amount || 0)) {
        handleAmount(_swappedData.value);
        return;
      }
    }

    if (!approved) {
      setApprove();
      return;
    }

    if (!collateralApproved && Big(amount || 0).gt(0)) {
      onCollateralApprove();
      return;
    }

    toast.dismiss(toastId);
    toastId = toast.loading({ title: "Leveraging..." });

    const {
      priceBig,
      debtPriceBig,
      MCRBig,
      leverageBP,
      addedCollateral,
      addedDebt,
      addedPreviewDeposit,
      addedCollateralDen,
      marginInShares,
      borrowingRateBig,
      amountBig,
    } = marginInSharesData;

    const isActive = currentMarketData.denStatus === UserDenStatus.active;
    const liquidationReserveBig = BigInt(Big(liquidationReserve).times(SCALING_FACTOR.toString()).toFixed(0));
    const normalizedParams = _normalizeDenCreation(automaticLoopingData.params);
    const maxBorrowingRate = borrowingRateBig + DEFAULT_SLIPPAGE_TOLERANCE < MAXIMUM_BORROWING_MINT_RATE ? borrowingRateBig + DEFAULT_SLIPPAGE_TOLERANCE : MAXIMUM_BORROWING_MINT_RATE;
    const debtAmount = normalizedParams.borrowNECT;
    const newDen = Den.create(normalizedParams, liquidationReserveBig, borrowingRateBig);
    const swapRouter = route.tx.to;
    const dexCalldata = route.tx.data;
    const dexCollOutput = BigInt(route.amountOut);
    const dexCollOutputMin = dexCollOutput - (dexCollOutput * DEFAULT_SLIPPAGE_TOLERANCE) / SCALING_FACTOR;

    // estimate gas
    // const decayedBorrowingRate = maxBorrowingRate;
    // const decayedDen = Den.create(normalizedParams, liquidationReserveBig, decayedBorrowingRate);
    // const denRecreate = Den.recreate(decayedDen, liquidationReserveBig, borrowingRateBig);
    // if (denRecreate === undefined) {
    //   toast.dismiss(toastId);
    //   toast.fail({
    //     title: "Leverage Failed!",
    //     text: "Den's unable to recreate"
    //   });
    //   return;
    // }
    const leverageContract = new Contract(leverageRouter, LEVERAGE_ROUTER_ABI, signer);
    let leverageMethod = "automaticLoopingOpenDen";
    const leverageParams = [
      currentMarketData.denManager,
      {
        flashloanNectAmount: debtAmount,
        marginCollAmount: amountBig,
        denParams: { maxFeePercentage: maxBorrowingRate, upperHint: hints.lowerHint, lowerHint: hints.upperHint },
        nectToColl: { dexCalldata: dexCalldata, outputMin: dexCollOutputMin, swapRouter },
      },
    ];
    const leverageOptions: any = {};

    if (!isActive) {
      leverageMethod = "automaticLoopingAddCollateral";
    }

    try {
      leverageOptions.gasLimit = await leverageContract.estimateGas[leverageMethod](...leverageParams);
    } catch (err: any) {
      console.log("estimate gas error: %o", err);
      leverageOptions.gasLimit = 4000000;
    }
    try {
      const tx = await leverageContract[leverageMethod](...leverageParams, leverageOptions);

      toast.dismiss(toastId);
      toastId = toast.loading({
        title: "Confirming...",
        tx: tx.hash,
        chainId: DEFAULT_CHAIN_ID
      });

      const { status, transactionHash } = await tx.wait();

      setCurrentLeverageTxHash(transactionHash);
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Leverage successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        setResultModalOpen(true);
      } else {
        toast.fail({ title: "Leverage failed!" });
      }
      setDataLoading(true);
      addAction({
        type: 'Lending',
        action: 'Leverage',
        token: currentMarket,
        amount: Big(addedCollateral.toString()).div(SCALING_FACTOR.toString()).toString(),
        template: "Beraborrow",
        add: false,
        status,
        transactionHash
      });
    } catch (err: any) {
      console.log(`${leverageMethod} error: %o`, err);
      toast.dismiss(toastId);
      toast.fail({
        title: "Leverage Failed!",
        text: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : ""
      });
    }
  }, { manual: true });

  const buttonValid = useMemo(() => {
    const result: any = { valid: true, text: "ACTIVATE LOOPING", loading: false };

    //#region Check account
    if (!account) {
      result.text = `Connect Wallet`;
      return result;
    }

    if (DEFAULT_CHAIN_ID !== chainId) {
      result.text = `Switch Network`;
      return result;
    }
    //#endregion

    //#region Check input amount
    if (!currentInputAmount || Big(currentInputAmount || 0).lte(0)) {
      result.valid = false;
      result.text = `Enter an amount`;
      return result;
    }
    //#endregion

    //#region Check loading
    if (
      submitting
      || marginInSharesLoading
      || automaticLoopingLoading
      || checkApproving
      || approving
      || collateralChecking
      || collateralApproving
      || outputAmountDataLoading
      || inputApproving
      || inputChecking
      || depositApproving
      || depositChecking
    ) {
      result.loading = true;
    }
    //#endregion

    //#region Check den
    if (!currentMarketData?.den) {
      result.valid = false;
      result.text = `Loading...`;
      return result;
    }
    //#endregion

    //#region Without leverage
    if (!isLeverage) {
      result.text = "DEPOSIT";
      // Check wallet balance
      if (Big(currentInputAmount || 0).gt(currentInputMarketWalletBalance || 0)) {
        result.valid = false;
        result.text = `Insufficient ${currentInputMarket.symbol} Balance`;
        return result;
      }
      if (currentInputMarket.address === currentMarket.address) {
        if (!depositApproved) {
          result.text = `Approve ${currentMarket.symbol} deposit`;
          return result;
        }
      } else {
        if (!inputApproved) {
          result.text = `Approve ${currentInputMarket.symbol} swap`;
          return result;
        }
      }
      return result;
    }
    //#endregion

    // Leverage
    if (!marginInSharesData || !automaticLoopingData || !calculateDebtAmountData) {
      result.valid = false;
      return result;
    }

    if (marginInSharesData.addedCollateral <= BigInt(0)) {
      result.valid = false;
      result.text = `Insufficient Collateral`;
      return result;
    }

    if (Big(automaticLoopingData.leverageRatio?.value ?? 0).lt(currentMarketData.MCR)) {
      result.valid = false;
      result.text = `Ratio must be at least ${currentMarketData.MCR}%`;
      return result;
    }

    if (Big(calculateDebtAmountData.totalValue ?? 0).lt(minimumDebt)) {
      result.valid = false;
      result.text = (
        <div className='flex items-center justify-center gap-[8px]'>
          <Popover
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.Top}
            contentStyle={{ zIndex: 200 }}
            content={(
              <Card className="w-[300px] text-[14px] !p-[10px] !rounded-[4px]">
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

    if (Big(currentInputAmount || 0).gt(currentInputMarketWalletBalance || 0)) {
      result.valid = false;
      result.text = `Insufficient ${currentInputMarket.symbol} Balance`;
      return result;
    }

    if (!currentInputSwaped) {
      if (!inputApproved) {
        result.text = `Approve ${currentInputMarket.symbol}`;
        return result;
      }
      result.text = `Swap ${currentInputMarket.symbol} to ${currentMarket.symbol}`;
      return result;
    }

    if (!approved) {
      result.text = `Approve Delegate`;
      return result;
    }

    if (!collateralApproved && Big(amount || 0).gt(0)) {
      result.text = `Approve ${currentMarketData.symbol}`;
      return result;
    }

    result.text = "ACTIVATE LOOPING";

    return result;
  }, [
    account,
    amount,
    currentInputAmount,
    chainId,
    currentMarketData,
    marginInSharesData,
    automaticLoopingData,
    calculateDebtAmountData,
    submitting,
    marginInSharesLoading,
    automaticLoopingLoading,
    approved,
    checkApproving,
    approving,
    collateralApproved,
    collateralApproving,
    collateralChecking,
    outputAmountDataLoading,
    currentMarket,
    currentInputMarket,
    currentInputMarketWalletBalance,
    isLeverage,
    inputApproved,
    inputApproving,
    inputChecking,
    depositApproving,
    depositChecking,
    depositApproved,
  ]);

  const riskData = useMemo(() => {
    return getStatus(currentMarketData, automaticLoopingData?.leverageRatio?.value || "0");
  }, [currentMarketData, automaticLoopingData]);

  useEffect(() => {
    setDataLoading(isChainSupported);
  }, [isChainSupported, account, currentMarket]);

  useEffect(() => {
    setMarginInSharesData(void 0);
    cancelGetMarginInShares();
    getMarginInShares().then((_marginInSharesData: any) => {
      setMarginInSharesData(_marginInSharesData);
    });
  }, [
    amount,
    currentMarketData,
    leverage,
    provider,
    account,
  ]);

  return (
    <div className={clsx("relative", className)}>
      <Card className="w-full !p-[20px] !rounded-[20px] text-[#000] text-[12px] font-Montserrat font-[500]">

        {/*#region Deposit collateral*/}
        <div className="w-full">
          <div className="text-[12px] text-[#A1A0A1]">
            Deposit
          </div>
          <TokenAmount
            className="!p-[14px_12px_10px] mt-[10px] w-full"
            type="in"
            currency={currentInputMarket}
            amount={currentInputAmount}
            prices={prices}
            isPrice={true}
            account
            onCurrencySelectOpen={() => {
              setTokenSelectorVisible(true);
            }}
            onAmountChange={(_amount: string) => {
              setCurrentInputAmount(_amount);
            }}
            updater={inputCurrencyUpdater}
            balanceLabel="Balance"
            onUpdateCurrencyBalance={(_balance: string) => { }}
            balancePercentClassName={({ selected }: any) => {
              if (selected) {
                return "!border-[#000] text-[#000]";
              }
              return "!border-[#D9D9D9] text-[#808290]";
            }}
            isRange={false}
            balanceContainerClassName="!text-[#A1A0A1]"
          />
        </div>
        {/*#endregion*/}

        {/*#region Leverage*/}
        <div className="mt-[12px]">
          <div className="flex justify-between items-center gap-[10px] text-[#A1A0A1] text-[12px]">
            <div className="flex items-center gap-[2px] text-[12px] leading-[100%]">
              <div className="">
                Leverage:
              </div>
              <div className="font-[600] text-black">
                {leverage}x
              </div>
            </div>
            <div className="flex justify-end items-center gap-[2px]">
              <div className="">Liquidation risk:</div>
              <div
                className={clsx((!leverage || Big(leverage).lte(1) || !automaticLoopingData) ? "" : "font-[600]")}
                style={{
                  color: (!leverage || Big(leverage).lte(1) || !automaticLoopingData) ? "#A1A0A1" : `rgb(${riskData?.color})`
                }}>
                {(!leverage || Big(leverage).lte(1) || !automaticLoopingData) ? "None" : riskData?.name}
              </div>
            </div>
          </div>
          <div className="mt-[13px]">
            <Range
              type="range"
              value={leverageProgress}
              onChange={(e: any) => handleLeverageChange(e.target.value)}
              className="!mt-[unset] w-full"
              debounceWait={0}
              inputClassName="!h-[16px]"
              activeBarClassName="!h-[16px]"
              disabled={marginInSharesLoading || submitting || !maxLeverage || Big(maxLeverage).lte(1)}
            />
          </div>
        </div>
        {/*#endregion*/}

        {
          (leverage && Big(leverage).gt(1)) && (
            <>
              {/*#region Liquidation price*/}
              <div className="w-full mt-[16px]">
                <div className="flex justify-between items-center text-[#A1A0A1]">
                  <div className="flex items-center gap-[2px]">
                    <div>Liquidation price</div>
                    <BelongTips className="">
                      Liquidation Price is the price the Collateral will have to reach to be liquidated
                    </BelongTips>
                  </div>
                  <div className="flex justify-end items-center gap-[2px]">
                    <div>Ratio:</div>
                    <div style={{ color: `rgb(${riskData?.color})` }}>
                      {numberFormatter(automaticLoopingData?.leverageRatio?.value, 2, true, { isShort: true, isShortUppercase: true })}%
                    </div>
                    <BelongTips>
                      The ratio of your {currentMarket?.symbol}'s value to your NECT debt. It's vital to maintain this ratio above the minimum ratio of {currentMarketData?.MCR ?? 150}% to avoid liquidations.
                    </BelongTips>
                  </div>
                </div>
                <div className="w-full bg-white rounded-[12px] border border-[#373A53] p-[12px_12px_10px] mt-[10px]">
                  <div className="w-full flex justify-between items-center gap-[20px]">
                    <div className="text-[20px]">
                      {numberFormatter(automaticLoopingData?.liquidationPrice?.value, 2, true, { isShort: false, isShortUppercase: true, round: Big.roundUp, prefix: "$" })}
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center gap-[20px] mt-[13px]">
                    <div className="flex justify-end items-center gap-[2px] text-[12px] leading-[100%]">
                      <div className="text-[#A1A0A1]">
                        Current:
                      </div>
                      <div className="font-[600]">
                        {currentMarketData?.priceShown}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*#endregion*/}

              {/*#region Total debt*/}
              <div className="w-full mt-[16px]">
                <div className="flex justify-between items-center flex-nowrap text-[#A1A0A1]">
                  <div className="flex items-center gap-[2px]">
                    <div>Total debt</div>
                    <BelongTips className="">
                      <div className="font-[500] text-black">What is this Debt?</div>
                      <div className="mt-[5px]">Debt minted to swap to {currentMarket?.symbol} to amplify the position size</div>
                    </BelongTips>
                  </div>
                  <div className="flex items-center gap-[2px]">
                    <div className="flex items-center gap-[2px]">
                      <div>Exposure:</div>
                    </div>
                    <div className="text-black">
                      {numberFormatter(automaticLoopingData?.route?.amountOutValue, 6, true, { isShort: true, isShortUppercase: true })} {currentMarket?.symbol}
                    </div>
                    <BelongTips className="">
                      The Amount of {currentMarket?.symbol} you will have after the leveraging swap
                    </BelongTips>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-[10px] mt-[12px] border border-[#373A53] p-[12px_12px] rounded-[12px]">
                  <div className="text-black font-[500] text-[20px]">
                    {numberFormatter(automaticLoopingData?.route?.amountOutUsd, 2, true, { isShort: false, isShortUppercase: true, prefix: "$" })}
                  </div>
                  <div className="shrink-0 flex justify-end items-center gap-[3px] border border-[#373A53] rounded-[8px] p-[8px_12px]">
                    <div className="flex items-center shrink-0">
                      {
                        currentMarket?.underlyingTokens?.map((token: any, idx: number) => (
                          <LazyImage
                            key={token.address}
                            src={token.icon}
                            alt={token.symbol}
                            containerClassName={clsx("!w-[20px] !h-[20px] shrink-0 rounded-full overflow-hidden", idx > 0 && "ml-[-8px]")}
                          />
                        ))
                      }
                    </div>
                    <div className="text-[16px] text-black font-[600] shrink-0">
                      {currentMarket?.underlyingTokens?.map((token: any) => token.symbol).join("-")}
                    </div>
                  </div>
                </div>
              </div>
              {/*#endregion*/}
            </>
          )
        }

        {/*#region transaction details & Fee*/}
        <div className="mt-[29px] flex justify-between items-center gap-[20px] text-[12px]">
          {
            isLeverage ? (
              <div className="flex items-center gap-[2px]">
                <div className="text-[#808290]">Fee:</div>
                <div className="">
                  {numberFormatter(calculateDebtAmountData?.fee, 2, true, { isShort: true, isShortUppercase: true })}
                </div>
                <BelongTips className="">
                  <div className="font-[500] text-black">Fee Breakdown</div>
                  <div className="mt-[5px]">
                    <div className="flex justify-between items-center gap-[10px]">
                      <div className="">Net debt:</div>
                      <div className="">{numberFormatter(calculateDebtAmountData?.value, 8, true, { isShort: true, isShortUppercase: true })}</div>
                    </div>
                    <div className="flex justify-between items-center gap-[10px] mt-[5px]">
                      <div className="">Borrowing fee({numberFormatter(Big(currentMarketData?.borrowingRate ?? 0).times(100), 2, true)}%):</div>
                      <div className="">{numberFormatter(calculateDebtAmountData?.borrowingFee, 8, true, { isShort: true, isShortUppercase: true })}</div>
                    </div>
                    <div className="flex justify-between items-center gap-[10px] mt-[5px]">
                      <div className="">Liquidation reserve:</div>
                      <div className="">{numberFormatter(calculateDebtAmountData?.liquidationReserveFee, 8, true, { isShort: true, isShortUppercase: true })}</div>
                    </div>
                    <div className="w-full h-[1px] bg-[#A1A0A1] my-[5px]"></div>
                    <div className="flex justify-between items-center gap-[10px] mt-[5px]">
                      <div className="">Total debt:</div>
                      <div className="">{numberFormatter(calculateDebtAmountData?.totalValue, 8, true, { isShort: true, isShortUppercase: true })}</div>
                    </div>
                  </div>
                </BelongTips>
              </div>
            ) : (
              <div className="flex items-center gap-[2px]">
                <div className="text-[#808290]">Price Impact:</div>
                <div className="">
                  {numberFormatter(Big(outputAmountData?.priceImpact || 0).div(100), 2, true)}%
                </div>
                <BelongTips className="">
                  Price impact from the swapping
                </BelongTips>
              </div>
            )
          }
          <Link
            prefetch
            href="/lending/beraborrow"
            className="block cursor-pointer"
          >
            Transaction details &gt;
          </Link>
        </div>
        {/*#endregion*/}

        <div className="w-full mt-[13px]">
          <button
            type="button"
            className="disabled:!cursor-not-allowed disabled:opacity-50 gap-[5px] w-full bg-[#FFDC50] text-black text-[16px] flex justify-center items-center h-[40px] rounded-[10px] border border-[#000]"
            disabled={!buttonValid.valid || buttonValid.loading}
            onClick={handleSubmit}
          >
            {
              buttonValid.loading && (
                <Loading size={16} />
              )
            }
            <div>{buttonValid.text}</div>
          </button>
        </div>

        <TokenSelector
          display={tokenSelectorVisible}
          tokens={leverageMarkets ?? []}
          selectedTokenAddress={currentInputMarket?.address}
          chainId={DEFAULT_CHAIN_ID}
          account={account}
          onSelect={(token: any) => {
            setCurrentInputMarket(token);
            setTokenSelectorVisible(false);
            const timer = setTimeout(() => {
              clearTimeout(timer);
              setDataLoading(true);
            }, 0);
          }}
          onClose={() => {
            setTokenSelectorVisible(false);
          }}
          showSearch={false}
          isSortByBalance={true}
        />

        <BeraborrowData
          {...networks[DEFAULT_CHAIN_ID + '']}
          {...basic}
          markets={[currentMarket]}
          chainId={chainId}
          prices={prices}
          update={dataLoading}
          account={account}
          provider={provider}
          onLoad={(res: any) => {
            console.log('Beraborrow data res: %o', res);
            setData(res);
            setDataLoading(false);
          }}
        />
      </Card>
      <div className="w-full mt-[16px] flex items-center gap-[2px] pl-[21px] text-[12px] text-[#F8F8F8] font-[500] font-Montserrat leading-[100%]">
        <div className="">View on</div>
        <Link
          className="block underline underline-offset-2"
          href="https://berascan.com/address/0x88c983bf3d4a9adcee14e1b4f1c446c4c5853ea3"
          target="_blank"
          rel="noreferrer nofollow"
        >
          Berscan
        </Link>
        <div className="">&gt;</div>
        <div className="">or</div>
        <Link
          className="block underline underline-offset-2"
          href="/vaults?protocol=Beraborrow"
          prefetch
        >
          Beraborrow
        </Link>
        <div className="">&gt;</div>
      </div>
      <ResultModal
        open={resultModalOpen}
        onClose={() => {
          setResultModalOpen(false);
          afterSuccess();
        }}
        market={currentMarketData}
        inputMarket={currentInputMarket}
        leverage={leverage}
        liquidationPrice={automaticLoopingData?.liquidationPrice?.value}
        txHash={currentLeverageTxHash}
        inputAmount={currentInputAmount}
        debtAmount={automaticLoopingData?.route?.amountOutValue}
      />
      <Position
        ref={vaultRef}
        className="!absolute left-0 bottom-[-100px]"
        leverage={leverage}
        apy={currentMarketData?.vaultApy}
        market={currentMarketData}
        setShareModalOpen={setShareModalOpen}
      />
      <ShareModal
        open={shareModalOpen}
        onClose={() => {
          setShareModalOpen(false);
        }}
        market={currentMarketData}
        leverage={leverage}
        apy={currentMarketData?.vaultApy}
      />
    </div>
  );
};

export default BelongForm;
