import InputNumber from "@/components/input-number";
import LazyImage from "@/components/layz-image";
import Range from "@/components/range";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import beraborrowConfig from "@/configs/lending/beraborrow";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import useCustomAccount from "@/hooks/use-account";
import { numberFormatter } from "@/utils/number-formatter";
import Skeleton from "react-loading-skeleton";
import { ActionText, useBeraborrow } from "@/sections/Lending/hooks/use-beraborrow";
import Big from "big.js";
import Health from "@/sections/Lending/Beraborrow/health";
import { useRequest } from "ahooks";
import { getHint } from "@/sections/Lending/handlers/beraborrow";
import axios from "axios";

const BeraborrowData = dynamic(() => import('@/sections/Lending/datas/beraborrow'));

const DEFAULT_SLIPPAGE_TOLERANCE = "0.5";
const MAXIMUM_BORROWING_MINT_RATE = "0";

const BelongForm = (props: any) => {
  const { } = props;

  const { basic, networks }: any = beraborrowConfig;
  const { markets = [], riskyRatio, liquidationReserve, borrowingFee, minimumDebt, multiCollateralHintHelpers } = networks?.[DEFAULT_CHAIN_ID + ''] || {};

  const { account, provider, chainId } = useCustomAccount();
  const prices = usePriceStore((store) => store.price);

  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [totalDebt, setTotalDebt] = useState("");
  const [leverage, setLeverage] = useState(0);
  const [currentMarket, setCurrentMarket] = useState<any>(markets[0]);
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
    onSuccess: () => {},
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
  console.log('beraborrowData: %o', beraborrowData);
  console.log('currentMarketData: %o', currentMarketData);

  const newValue = useMemo(() => {
    return (currentMarketData && (amount && Big(amount).gt(0)) || (borrowAmount && Big(borrowAmount).gt(0))) ? {
      balanceUsdShown: numberFormatter(Big(totalAmount).times(currentMarketData.price || 1), 2, true, { prefix: '$' }),
      balanceShown: numberFormatter(totalAmount, 2, true),
      borrowedShown: numberFormatter(totalBorrowAmount, 2, true),
      liquidationPriceShown: numberFormatter(liquidationPriceNew, 2, true, { prefix: '$', round: Big.roundDown }),
      liquidationPrice: liquidationPriceNew,
    } : {};
  }, [currentMarketData, amount, borrowAmount, totalAmount, totalBorrowAmount, liquidationPriceNew]);

  const { runAsync: automaticLooping, loading: automaticLoopingLoading, data: automaticLoopingData } = useRequest(async () => {
    if (!borrowLimit || Big(borrowLimit).lte(0) || !currentMarketData || !currentMarketData.borrowToken) {
      return;
    }

    const maxBorrowingRate = Big(ratio || 0).plus(DEFAULT_SLIPPAGE_TOLERANCE);
    const debtAmount = borrowLimit;
    const hints = await getHint({
      market: currentMarketData,
      account,
      chainId,
      provider,
      multiCollateralHintHelpers,
      totalAmount,
      totalBorrowAmount,
    });
    let dexCalldataResp: any;
    const DexCallURL = new URL("https://api.beraborrow.com/v1/enso/leverage-swap");
    DexCallURL.searchParams.set("user", account);
    DexCallURL.searchParams.set("dmAddr", currentMarketData.denManager);
    DexCallURL.searchParams.set("marginInShares", debtAmount);
    DexCallURL.searchParams.set("leverage", "1");
    DexCallURL.searchParams.set("debtAmount", debtAmount);
    DexCallURL.searchParams.set("slippage", DEFAULT_SLIPPAGE_TOLERANCE);
    try {
      dexCalldataResp = await axios.get(DexCallURL.toString());
    } catch (err: any) {
      console.log('automaticLooping failed: %o', err);
    }
    console.log('dexCalldataResp: %o', dexCalldataResp);
    console.log('hints: %o', hints);
  }, {
     refreshDeps: [
      ratio,
      borrowLimit,
      currentMarketData,
      account,
      chainId,
      provider,
      totalAmount,
      totalBorrowAmount,
     ],
      debounceWait: 1000,
    });

  const { runAsync: setBorrowAmount } = useRequest(async () => {
    handleBorrowAmount(borrowLimit);
  }, { refreshDeps: [borrowLimit], debounceWait: 1000 });

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
            Ratio: {ratio || 0}%
          </div>
        </div>
        <div className="flex justify-between items-center gap-[40px]">
          <div className="">
            <Range
              type="range"
              value={leverage}
              onChange={(e: any) => setLeverage(e.target.value)}
              className="!mt-[unset] range-green"
              color="#16a34a"
            />
            <div className="flex items-center gap-[2px]">
              <div className="">
                Leverage:
              </div>
              <div className="">
                2.5x
              </div>
            </div>
          </div>
          <div className="">
            <div className="">{newValue?.liquidationPriceShown || "$0.00"}</div>
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
              1,234.56 iBERA-wgBERA
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-[10px]">
          <input
            type="text"
            value={totalDebt}
            className="flex-1 bg-[#3D405A]"
          />
          <div className="shrink-0">
            iBERA-wgBERA
          </div>
        </div>
      </div>
      <div className="w-full flex justify-between items-center gap-[10px]">
        <div className="flex items-center gap-[2px]">
          <div className="">
            Fee:
          </div>
          <div className="">
            1.25%
          </div>
        </div>
        <div className="flex items-center gap-[2px]">
          <div className="">
            Liquidation risk:
          </div>
          <Health risk={ratioRisk} />
        </div>
      </div>
      <div className="w-full">
        <div className="">
          Transaction details &gt;
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
