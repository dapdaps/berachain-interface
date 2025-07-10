import InputNumber from "@/components/input-number";
import LazyImage from "@/components/layz-image";
import Range from "@/components/range";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import beraborrowConfig from "@/configs/lending/beraborrow";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import useCustomAccount from "@/hooks/use-account";
import { numberFormatter, numberRemoveEndZero } from "@/utils/number-formatter";
import Skeleton from "react-loading-skeleton";
import { ActionText, BORROWER_OPERATIONS_ABI, getPreviewDeposit, LEVERAGE_ROUTER_ABI, useBeraborrow } from "@/sections/Lending/hooks/use-beraborrow";
import Big from "big.js";
import Health, { getStatus } from "@/sections/Lending/Beraborrow/health";
import { useRequest } from "ahooks";
import { getHint } from "@/sections/Lending/handlers/beraborrow";
import axios from "axios";
import { _normalizeDenCreation, Den, SCALING_FACTOR, SCALING_FACTOR_BP, UserDenStatus } from "@/sections/Lending/datas/beraborrow/den";
import { Contract, utils } from "ethers";
import useToast from "@/hooks/use-toast";
import useAddAction from "@/hooks/use-add-action";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import Card from "@/components/card";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import Loading from "@/components/loading";
import { useSwitchChain } from 'wagmi';
import useApprove from "@/hooks/use-approve";

const BeraborrowData = dynamic(() => import('@/sections/Lending/datas/beraborrow'));

const DEFAULT_SLIPPAGE_TOLERANCE = BigInt(10000000000000000);
const MAXIMUM_BORROWING_MINT_RATE = BigInt(50000000000000000);

const BelongForm = (props: any) => {
  const { } = props;

  const { basic, networks }: any = beraborrowConfig;
  let {
    markets = [],
    riskyRatio,
    liquidationReserve,
    borrowingFee,
    minimumDebt,
    multiCollateralHintHelpers,
    leverageRouter,
    borrowerOperations,
  } = networks?.[DEFAULT_CHAIN_ID + ''] || {};
  markets = markets.filter((m: any) => m.isLeverage);

  const { account, provider, chainId } = useCustomAccount();
  const prices = usePriceStore((store) => store.price);
  const toast = useToast();
  const { addAction } = useAddAction("belong");
  const modal = useConnectModal();
  const { switchChain } = useSwitchChain();

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [leverage, setLeverage] = useState("1.5");
  const [leverageProgress, setLeverageProgress] = useState(0);
  const [currentMarket, setCurrentMarket] = useState<any>(markets[5]);
  const [data, setData] = useState<any>();
  const [marginInSharesData, setMarginInSharesData] = useState<any>();
  const [maxLeverage, setMaxLeverage] = useState<any>("1");

  const [currentMarketData] = useMemo(() => {
    if (!data || !data.markets || !data.markets.length) {
      return [];
    }
    return [
      { ...data, ...data.markets[0] }
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

  const { runAsync: getMarginInShares, cancel: cancelGetMarginInShares, loading: marginInSharesLoading } = useRequest(async () => {
    if (!currentMarketData) {
      return;
    }
    const priceBig = BigInt(Big(currentMarketData.price).times(SCALING_FACTOR.toString()).toFixed(0));
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

    // Calculate maximum leverage
    let maxLeverageRes: any = "1";
    try {
      const calculateMaxLeverageParams = [
        addedCollateral,
        addedDebt,
        addedCollateralShares,
        priceBig,
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
      if (Big(maxLeverageRes).lt(1.5)) {
        setLeverage("1");
      }
    } catch (err: any) {
      console.log('Failed to calculate maximum leverage: %o', err);
    }

    return {
      priceBig,
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

  const { runAsync: calculateDebtAmount, data: calculateDebtAmountData, loading: calculateDebtAmountLoading } = useRequest(async () => {
    if (!marginInSharesData || !currentMarketData || !currentMarketData.borrowToken) {
      return { big: BigInt(0), value: "0", fee: "0" };
    }

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
      liquidationReserveBig,
    } = marginInSharesData;
    const isActive = currentMarketData.denStatus === UserDenStatus.active;

    // Calculate leveraged debt
    const leveragedDebt = addedCollateralDen.calculateLeveragedDebt(
      addedCollateral,
      leverageBP,
      priceBig,
      debtPriceBig,
    );
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
      fee: Big((borrowingFeeBig + (isActive ? BigInt(0) : liquidationReserveBig)).toString()).div(SCALING_FACTOR.toString()).toString(),
    };
  }, {
    refreshDeps: [
      marginInSharesData,
      currentMarketData,
      account,
      chainId,
      provider,
    ],
    debounceWait: 1000,
  });

  const { runAsync: automaticLooping, data: automaticLoopingData, loading: automaticLoopingLoading } = useRequest(async () => {
    if (!marginInSharesData || !calculateDebtAmountData || calculateDebtAmountData.big === BigInt(0) || !currentMarketData || !currentMarketData.borrowToken) {
      return;
    }

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
      amountBig,
    } = marginInSharesData;
    const { big: debtBig, value: debtValue, totalBig: totalDebtBig, totalValue: totalDebtValue } = calculateDebtAmountData;

    // Get swap
    let dexCalldataResp: any;
    const DexCallURL = new URL("https://api.beraborrow.com/v1/enso/leverage-swap");
    DexCallURL.searchParams.set("user", account);
    DexCallURL.searchParams.set("dmAddr", currentMarketData.denManager);
    DexCallURL.searchParams.set("marginInShares", amountBig.toString());
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

    const currentPrice = prices[currentMarketData.address] || prices[currentMarketData.symbol] || 0;
    const _amountOutValue = Big(amountOut).div(10 ** currentMarketData.decimals).plus(Big(addedCollateral.toString()).div(SCALING_FACTOR.toString()));
    const route = {
      ...dexCalldataResp.data.data,
      amountOutValue: numberRemoveEndZero(_amountOutValue.toFixed(currentMarketData.decimals)),
      amountOutUsd: Big(_amountOutValue).times(currentPrice).toFixed(2),
    };

    // Get liquidation price
    const dexCollOutput = BigInt(amountOut);
    const dexCollOutputInShares = dexCollOutput + addedCollateral;
    const params: any = { borrowNECT: debtBig, depositCollateral: dexCollOutputInShares };
    const newDen = new Den(dexCollOutput, debtBig);
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
    const leverageRatio = newRatioDen.collateralRatio(priceBig);

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
      prices,
    ],
    debounceWait: 1000,
  });

  const handleLeverageChange = (value: any) => {
    if (Big(maxLeverage || 1).lte(1)) {
      return;
    }
    setLeverageProgress(value);
    const leverage = Big(maxLeverage).minus(1).times(Big(value || 0).div(100)).plus(1).toFixed(1);
    setLeverage(leverage);
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

  const { runAsync: handleDeposit, loading: handleDepositLoading } = useRequest(async () => {
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

    if (!automaticLoopingData || !currentMarketData || !currentMarketData.den || !marginInSharesData) {
      return;
    }

    const { route, hints }: any = automaticLoopingData;
    if (!route || !hints) {
      return;
    }

    if (!approved) {
      setApprove();
      return;
    }

    if (!collateralApproved && Big(amount || 0).gt(0)) {
      onCollateralApprove();
      return;
    }

    const signer = provider.getSigner(account);
    let toastId = toast.loading({ title: "Leveraging..." });

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

      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Leverage successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
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
    const result: any = { valid: true, text: "Delegate, Approve and Leverage", loading: false };

    if (!account) {
      result.text = `Connect Wallet`;
      return result;
    }

    if (DEFAULT_CHAIN_ID !== chainId) {
      result.text = `Switch Network`;
      return result;
    }

    if (handleDepositLoading || marginInSharesLoading || calculateDebtAmountLoading || automaticLoopingLoading || checkApproving || approving || collateralChecking || collateralApproving) {
      result.loading = true;
    }

    if (!currentMarketData?.den) {
      result.valid = false;
      result.text = `Loading...`;
      return result;
    }

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

    if (Big(amount || 0).gt(currentMarketData.walletBalance || 0)) {
      result.valid = false;
      result.text = `Insufficient ${currentMarketData.symbol} Balance`;
      return result;
    }

    if (!approved) {
      result.text = `Approve Delegate`;
      return result;
    }

    result.text = "Approve and Leverage";

    if (!collateralApproved && Big(amount || 0).gt(0)) {
      result.text = `Approve ${currentMarketData.symbol}`;
      return result;
    }

    result.text = "Leverage";

    return result;
  }, [
    account,
    amount,
    chainId,
    currentMarketData,
    marginInSharesData,
    automaticLoopingData,
    calculateDebtAmountData,
    handleDepositLoading,
    marginInSharesLoading,
    calculateDebtAmountLoading,
    automaticLoopingLoading,
    approved,
    checkApproving,
    approving,
    collateralApproved,
    collateralApproving,
    collateralChecking,
  ]);

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
    <div className="w-[500px] mx-auto mt-[20px]">
      <div className="w-full">
        <div className="">
          Deposit collateral
        </div>
        <div className="flex justify-between items-center gap-[10px]">
          <div className="shrink-0 flex items-center gap-[4px]">
            <LazyImage
              src={currentMarket?.icon}
              fallbackSrc="/assets/tokens/default_icon.png"
              alt=""
              containerClassName="!w-[20px] !h-[20px] shrink-0 rounded-full overflow-hidden"
            />
            <div className="">
              {currentMarket?.symbol}
            </div>
            <img src="/images/belong/icon-arrow.svg" alt="" className="w-[12px] h-[12px] shrink-0" />
          </div>
          <InputNumber
            className="flex-1 bg-[#3D405A]"
            value={amount}
            onNumberChange={(value) => handleAmount(value)}
          />
        </div>
        <div className="flex items-center gap-[2px]">
          Balance: {
            dataLoading
              ? <Skeleton width={60} height={16} borderRadius={2} />
              : (
                <span
                  className="underline underline-offset-2 cursor-pointer"
                  onClick={() => {
                    handleAmount(currentMarketData?.walletBalance || "0");
                  }}
                >
                  {numberFormatter(currentMarketData?.walletBalance, 4, true, { isShort: true, isShortUppercase: true })}
                </span>
              )
          } {currentMarket?.symbol}
        </div>
        <div className="flex items-center gap-[2px]">
          <div className="">25%</div>
          <div className="">50%</div>
          <div className="">75%</div>
          <div className="uppercase">max</div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="">
            Liquidation price
          </div>
          <div className="">
            Ratio: {numberFormatter(automaticLoopingData?.leverageRatio?.value, 2, true, { isShort: true, isShortUppercase: true })}%
          </div>
        </div>
        <div className="flex justify-between items-center gap-[40px]">
          <div className="">
            <Range
              type="range"
              value={leverageProgress}
              onChange={(e: any) => handleLeverageChange(e.target.value)}
              className="!mt-[unset] range-green"
              color="#16a34a"
              debounceWait={0}
            />
            <div className="flex items-center gap-[2px]">
              <div className="">
                Leverage:
              </div>
              <div className="">
                {leverage}x
              </div>
            </div>
          </div>
          <div className="">
            <div className="">
              {numberFormatter(automaticLoopingData?.liquidationPrice?.value, 2, true, { isShort: true, isShortUppercase: true, round: 0, prefix: "$" })}
            </div>
            <div className="flex items-center gap-[2px]">
              <div className="">
                Current:
              </div>
              <div className="">
                {currentMarketData?.priceShown}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between items-center">
          <div className="">
            Total debt
          </div>
          <div className="flex items-center gap-[2px]">
            <div className="">
              Exposure:
            </div>
            <div className="">
              {numberFormatter(automaticLoopingData?.route?.amountOutValue, 2, true, { isShort: true, isShortUppercase: true })} {currentMarket?.symbol}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-[10px]">
          <input
            type="text"
            value={numberFormatter(automaticLoopingData?.route?.amountOutUsd, 2, true, { isShort: true, isShortUppercase: true, prefix: "$" })}
            className="flex-1 bg-[#3D405A]"
            disabled
          />
          <div className="shrink-0">
            {currentMarket?.symbol}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-end items-center gap-[10px]">
        <div className="flex items-center gap-[2px]">
          <div className="">
            Liquidation risk:
          </div>
          <Health risk={getStatus(currentMarketData, automaticLoopingData?.leverageRatio?.value || "0")} />
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-[10px]">
        <div className="flex items-center gap-[2px]">
          <div className="">Total Debt:</div>
          <div className="">{numberFormatter(calculateDebtAmountData?.value, 8, true, { isShort: true, isShortUppercase: true })}</div>
        </div>
        <div className="flex items-center gap-[2px]">
          <div className="">Fee:</div>
          <div className="">{numberFormatter(calculateDebtAmountData?.fee, 2, true, { isShort: true, isShortUppercase: true })}</div>
        </div>
      </div>
      <div className="w-full">
        <button
          type="button"
          className="disabled:!cursor-not-allowed disabled:opacity-50 gap-[5px] w-full bg-green-600 text-black flex justify-center items-center h-[40px] rounded-[2px]"
          disabled={!buttonValid.valid}
          onClick={handleDeposit}
        >
          {
            buttonValid.loading && (
              <Loading size={16} />
            )
          }
          <div>{buttonValid.text}</div>
        </button>
      </div>

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
    </div>
  );
};

export default BelongForm;
