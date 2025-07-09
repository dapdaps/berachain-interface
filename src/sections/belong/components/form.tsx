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
import { ActionText, getPreviewDeposit, LEVERAGE_ROUTER_ABI, useBeraborrow } from "@/sections/Lending/hooks/use-beraborrow";
import Big from "big.js";
import Health, { getStatus } from "@/sections/Lending/Beraborrow/health";
import { useRequest } from "ahooks";
import { getHint } from "@/sections/Lending/handlers/beraborrow";
import axios from "axios";
import { _normalizeDenCreation, Den, SCALING_FACTOR, SCALING_FACTOR_BP, UserDenStatus } from "@/sections/Lending/datas/beraborrow/den";
import { Contract, utils } from "ethers";

const BeraborrowData = dynamic(() => import('@/sections/Lending/datas/beraborrow'));

const DEFAULT_SLIPPAGE_TOLERANCE = BigInt(5000000000000000);
const MAXIMUM_BORROWING_MINT_RATE = BigInt(0);

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
  } = networks?.[DEFAULT_CHAIN_ID + ''] || {};
  markets = markets.filter((m: any) => m.isLeverage);

  const { account, provider, chainId } = useCustomAccount();
  const prices = usePriceStore((store) => store.price);

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [totalDebt, setTotalDebt] = useState("");
  const [leverage, setLeverage] = useState("1.5");
  const [leverageProgress, setLeverageProgress] = useState(0);
  const [currentMarket, setCurrentMarket] = useState<any>(markets[5]);
  const [data, setData] = useState<any>();

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
    buttonValid,
    inputLoading,
    toastLoadingMsg,
    txData,
    getTxData,
    reloadList,
    addAction,
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
  // console.log('beraborrowData: %o', beraborrowData);
  // console.log('currentMarketData: %o', currentMarketData);

  const { runAsync: getMarginInShares, data: marginInSharesData, loading: marginInSharesLoading } = useRequest(async () => {
    if (!currentMarketData) {
      return;
    }
    const priceBig = BigInt(Big(currentMarketData.price).times(SCALING_FACTOR.toString()).toFixed(0));
    const debtPriceBig = BigInt(Big(currentMarketData.borrowToken.realPrice).times(SCALING_FACTOR.toString()).toFixed(0));
    const MCRBig = BigInt(Big(currentMarketData.MCR).div(100).times(SCALING_FACTOR.toString()).toFixed(0));
    const leverageBP = BigInt(Big(leverage).minus(1).times(SCALING_FACTOR_BP.toString()).toFixed(0));
    const liquidationReserveBig = BigInt(Big(liquidationReserve).times(SCALING_FACTOR.toString()).toFixed(0));

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
      amount: Big(addedCollateral.toString()).div(SCALING_FACTOR.toString()).toString(),
      market: currentMarketData,
      provider,
    });
    addedPreviewDeposit = BigInt(Big(addedPreviewDeposit || 0).times(SCALING_FACTOR.toString()).toFixed(0));
    console.log('Get accumulated PreviewDeposit: %o', addedPreviewDeposit);
    // Convert CollateralShares
    const collateralSharesDen = addedCollateralDen.convertCollateralToCollateralShares(addedPreviewDeposit);
    // Get the accumulated CollateralShares
    const addedCollateralShares = collateralSharesDen.getCollateralShares();
    console.log('Get accumulated CollateralShares: %o', addedCollateralShares);

    // Calculate maximum leverage
    let maxLeverageRes: any = 1;
    try {
      const calculateMaxLeverageParams = [
        addedCollateral,
        addedDebt,
        addedCollateralShares,
        priceBig,
        MCRBig,
      ];
      const res = await new Contract(leverageRouter, LEVERAGE_ROUTER_ABI, provider).calculateMaxLeverage(...calculateMaxLeverageParams);
      maxLeverageRes = res?.toString() || 1;
    } catch (err: any) {
      console.log('Failed to calculate maximum leverage: %o', err);
    }
    console.log('Maximum leverage: %o', maxLeverageRes);

    return {
      priceBig,
      debtPriceBig,
      MCRBig,
      leverageBP,
      addedCollateral,
      addedDebt,
      addedPreviewDeposit,
      addedCollateralDen,
      marginInShares: addedCollateralShares,
      liquidationReserveBig,
      maxLeverageRes,
    };
  }, {
    refreshDeps: [
      amount,
      currentMarketData,
      leverage,
      provider,
      account,
    ],
    debounceWait: 1000,
  });

  const { runAsync: calculateDebtAmount, loading: calculateDebtAmountLoading, data: calculateDebtAmountData } = useRequest(async () => {
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

    // Calculate leveraged debt
    const leveragedDebt = addedCollateralDen.calculateLeveragedDebt(
      addedCollateral,
      leverageBP,
      priceBig,
      debtPriceBig,
    );
    const borrowingFeeBig = BigInt(Big(leveragedDebt.toString()).times(borrowingFee).toFixed(0));
    const totalDebt = leveragedDebt + borrowingFeeBig + liquidationReserveBig;
    console.log('Leveraged debt: %o', totalDebt.toString());
    console.log('borrowingFeeBig 0.5%: %o', borrowingFeeBig.toString());
    console.log('liquidationReserve: %o', liquidationReserveBig.toString());
    const totalDebtValue = Big(totalDebt.toString()).div(SCALING_FACTOR.toString()).toString();
    console.log('Total Leveraged debt: %o', totalDebtValue);
    handleBorrowAmount(totalDebtValue);
    return {
      big: totalDebt,
      value: totalDebtValue,
      fee: Big((borrowingFeeBig + liquidationReserveBig).toString()).div(SCALING_FACTOR.toString()).toString(),
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

  const { runAsync: automaticLooping, loading: automaticLoopingLoading, data: automaticLoopingData } = useRequest(async () => {
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
    } = marginInSharesData;
    const { big: totalDebtBig, value: totalDebtValue } = calculateDebtAmountData;

    // Get swap
    let dexCalldataResp: any;
    const DexCallURL = new URL("https://api.beraborrow.com/v1/enso/leverage-swap");
    DexCallURL.searchParams.set("user", account);
    DexCallURL.searchParams.set("dmAddr", currentMarketData.denManager);
    DexCallURL.searchParams.set("marginInShares", addedCollateral);
    DexCallURL.searchParams.set("leverage", Big(leverage || 0).times(SCALING_FACTOR_BP.toString()).toFixed(0));
    DexCallURL.searchParams.set("debtAmount", totalDebtBig);
    DexCallURL.searchParams.set("slippage", Big(DEFAULT_SLIPPAGE_TOLERANCE.toString()).div(10 ** 16).toString());
    try {
      dexCalldataResp = await axios.get(DexCallURL.toString());
    } catch (err: any) {
      console.log('automaticLooping failed: %o', err);
    }

    if (dexCalldataResp?.status !== 200 || !dexCalldataResp?.data?.data?.amountOut) {
      return;
    }

    const currentPrice = prices[currentMarketData.address] || prices[currentMarketData.symbol] || 0;
    const amountOutUsdValue = Big(dexCalldataResp.data.data.amountOut).div(10 ** currentMarketData.decimals).plus(Big(addedCollateral.toString()).div(SCALING_FACTOR.toString()));
    const route = {
      ...dexCalldataResp.data.data,
      amountOutValue: numberRemoveEndZero(amountOutUsdValue.toFixed(currentMarketData.decimals)),
      amountOutUsd: Big(amountOutUsdValue).times(currentPrice).toFixed(2),
    };
    console.log('dexCalldata: %o', route);

    // Get liquidation price
    const dexCollOutput = BigInt(dexCalldataResp.data.data.amountOut);
    const dexCollOutputInShares = (dexCollOutput * marginInShares) / SCALING_FACTOR;
    const params: any = { borrowNECT: totalDebtBig, depositCollateral: dexCollOutputInShares + marginInShares };
    const newDen = new Den(dexCollOutput + addedCollateral, totalDebtBig);
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
    console.log('hints: %o', hints);

    // Get ratio
    const leverageRatio = newDen.collateralRatio(priceBig);

    return {
      route,
      hints,
      liquidationPrice,
      leverageRatio: {
        big: leverageRatio,
        value: Big(leverageRatio.toString()).div(SCALING_FACTOR.toString()).times(100).toString(),
      },
      params,
      den: newDen,
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
    if (!marginInSharesData) {
      return;
    }
    const { maxLeverageRes } = marginInSharesData;
    if (!maxLeverageRes || Big(maxLeverageRes).eq(0)) return;
    setLeverageProgress(value);
    const leverage = Big(maxLeverageRes).div(SCALING_FACTOR_BP.toString()).minus(1).times(Big(value || 0).div(100)).plus(1).toFixed(1);
    setLeverage(leverage);
  };

  const { runAsync: handleDeposit, loading: handleDepositLoading } = useRequest(async () => {
    if (!automaticLoopingData || !currentMarketData || !currentMarketData.den) {
      return;
    }
    const { route, hints } = automaticLoopingData;
    if (!route || !hints) {
      return;
    }
    const isActive = currentMarketData.denStatus === UserDenStatus.active;
    const normalizedParams = _normalizeDenCreation(automaticLoopingData.params);
    const maxBorrowingRate = automaticLoopingData.leverageRatio.big + DEFAULT_SLIPPAGE_TOLERANCE;
    const debtAmount = normalizedParams.borrowNECT;
    const newDen = Den.create(normalizedParams, BigInt(Big(liquidationReserve).times(SCALING_FACTOR.toString()).toFixed(0)), automaticLoopingData.leverageRatio.big);
    const swapRouter = route.tx.to;
    const dexCalldata = route.tx.data;
    const dexCollOutput = BigInt(route.amountOut);
    const dexCollOutputMin = dexCollOutput - (dexCollOutput * DEFAULT_SLIPPAGE_TOLERANCE) / SCALING_FACTOR;
  }, { manual: true });

  useEffect(() => {
    if (!marginInSharesData?.maxLeverageRes) {
      return;
    }
    const { maxLeverageRes } = marginInSharesData;
    if (!maxLeverageRes || Big(maxLeverageRes).eq(0)) return;
    const leverageProgress = Big(leverage).minus(1).times(SCALING_FACTOR_BP.toString()).div(Big(maxLeverageRes).minus(1)).times(100).toNumber();
    setLeverageProgress(leverageProgress);
  }, [marginInSharesData?.maxLeverageRes]);

  useEffect(() => {
    setDataLoading(isChainSupported);
  }, [isChainSupported, account, currentMarket]);

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
          className="w-full bg-green-600 text-black uppercase flex justify-center items-center h-[40px] rounded-[2px]"
        >
          deposit
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
