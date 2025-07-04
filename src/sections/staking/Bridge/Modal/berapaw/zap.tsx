import Card from "@/components/card";
import InputNumber from "@/components/input-number";
import LazyImage from "@/components/layz-image";
import Loading from "@/components/loading";
import Popover, { PopoverPlacement } from "@/components/popover";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useTokenBalance from "@/hooks/use-token-balance";
import { getTokenLogo } from "@/sections/dashboard/utils";
import ExchangeIcon from "@/sections/swap/Content/ExchangeIcon";
import SubmitBtn from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import { usePriceStore } from "@/stores/usePriceStore";
import { numberFormatter } from "@/utils/number-formatter";
import { formatLongText } from "@/utils/utils";
import { useDebounceFn } from "ahooks";
import Big from "big.js";
import clsx from "clsx";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const BerapawZap = (props: any, ref: any) => {
  const {
    className,
    isSimple,
    data,
    inputCurrency,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    outputCurrencyAmount,
    loading,
    onOpenTokenSelector,
    onSwap,
    onRefresh,
    zapData,
    tokenData,
    currentZapStepText,
  } = props;

  const prices = usePriceStore((store: any) => store.price);

  const [spender] = useMemo(() => {
    const { approve = {} } = zapData ?? {};
    const { spender } = approve;
    return [spender];
  }, [zapData]);

  const [_inputCurrencyAmount, _setInputCurrencyAmount] = useState(inputCurrencyAmount);
  const [inputCurrencyUpdater, setInputCurrencyUpdater] = useState(1);
  const [inputCurrencyBalance, setInputCurrencyBalance] = useState<any>("0");
  const [outputCurrencyUpdater, setOutputCurrencyUpdater] = useState(1);

  const buttonText = useMemo(() => {
    if (!_inputCurrencyAmount || Big(_inputCurrencyAmount || 0).lte(0)) {
      return "Enter an Amount";
    }
    if (!inputCurrencyBalance || Big(inputCurrencyBalance || 0).lt(Big(_inputCurrencyAmount || 0))) {
      return "Insufficient Balance";
    }
    return null;
  }, [_inputCurrencyAmount, inputCurrencyBalance]);

  const { run: onAmountChange } = useDebounceFn(setInputCurrencyAmount, { wait: 1000 });

  useEffect(() => {
    _setInputCurrencyAmount(inputCurrencyAmount);
  }, [inputCurrencyAmount]);

  const refs = {
    updateBalance: () => {
      setInputCurrencyUpdater((prev) => prev + 1);
      setOutputCurrencyUpdater((prev) => prev + 1);
    }
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={clsx("mt-[10px]", className)}>
      {
        isSimple ? (
          <div className="relative">
            <SimpleTokenInput
              value={_inputCurrencyAmount}
              disabled={false}
              onChange={(_amount: string) => {
                _setInputCurrencyAmount(_amount);
                onAmountChange(_amount);
              }}
              token={inputCurrency}
              tokenBalanceUpdater={inputCurrencyUpdater}
              onTokenSelectOpen={onOpenTokenSelector}
              loadTokenBalance={(_inputTokenBalance: string) => {
                setInputCurrencyBalance(_inputTokenBalance);
              }}
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[42px] h-[42px] shrink-0 bg-[#FFFDEB] rounded-[12px] p-[4px]">
              <div className="w-full h-full bg-[#BC9549] bg-[url('/images/vaults/v2/zap/icon-arrow-handle-down.svg')] bg-center bg-no-repeat bg-[length:11px_auto] rounded-[8px]"></div>
            </div>
            <SimpleTokenInput
              className="mt-[12px]"
              value={outputCurrencyAmount}
              disabled={true}
              token={{
                ...data?.stakingToken,
                icon: tokenData?.logosUri?.[0] || getTokenLogo(data?.stakingToken?.address === "native" ? "BERA" : data?.stakingToken?.address)
              }}
              tokenBalanceUpdater={outputCurrencyUpdater}
              isPrice={false}
            />
          </div>
        ) : (
          <>
            <TokenAmount
              type="in"
              currency={inputCurrency}
              amount={_inputCurrencyAmount}
              prices={prices}
              isPrice={false}
              account
              onCurrencySelectOpen={onOpenTokenSelector}
              onAmountChange={(_amount: string) => {
                _setInputCurrencyAmount(_amount);
                onAmountChange(_amount);
              }}
              updater={inputCurrencyUpdater}
              onUpdateCurrencyBalance={(_balance: string) => {
                setInputCurrencyBalance(_balance);
              }}
            />
            <ExchangeIcon />
            <TokenAmount
              type="out"
              currency={{
                ...data?.stakingToken,
                icon: tokenData?.logosUri?.[0] || getTokenLogo(data?.stakingToken?.address === "native" ? "BERA" : data?.stakingToken?.address)
              }}
              amount={outputCurrencyAmount}
              isPrice={false}
              disabled
              prices={prices}
              account
              outputCurrencyReadonly={true}
              inputDisabled={true}
              updater={outputCurrencyUpdater}
            />
          </>
        )
      }
      <SubmitBtn
        chain={{
          chainId: DEFAULT_CHAIN_ID
        }}
        amount={_inputCurrencyAmount}
        spender={spender}
        errorTips={buttonText}
        token={inputCurrency}
        loading={loading}
        onClick={onSwap}
        disabled={!_inputCurrencyAmount || Big(_inputCurrencyAmount || 0).lte(0)}
        onRefresh={onRefresh}
        updater={1}
        loadingText={currentZapStepText}
        isApproveMax={zapData?.name === "Haiku"}
      >
        Swap and Deposit
      </SubmitBtn>
      {
        zapData?.name && (
          <div className="flex items-center justify-center gap-[4px] mt-[10px] text-[14px]">
            <div className="text-[12px] text-[#3D405A]">Provider: </div>
            <img src={zapData?.logo} className="ml-[6px] w-[20px] h-[20px] object-center object-contain rounded-full shrink-0" />
            <div className="text-[14px] font-[700]">{zapData?.name}</div>
          </div>
        )
      }
    </div>
  );
};

export default forwardRef(BerapawZap);

export const ZapSlippage = (props: any) => {
  const {
    slippage,
    setSlippage,
    slippageList,
    className,
  } = props;

  const popoverRef = useRef<any>(null);

  return (
    <Popover
      ref={popoverRef}
      contentClassName="!z-[101]"
      triggerContainerClassName="h-[22px] shrink-0"
      content={(
        <Card className="!rounded-[6px] !p-[10px_15px]">
          <div className="font-[500]">Max. Slippage:</div>
          <div className="flex gap-[8px] items-center mt-[10px]">
            {
              slippageList.map((item: any) => (
                <button
                  type="button"
                  className={clsx(
                    "w-[48px] h-[22px] flex-shrink-0 rounded-[6px] border border-[#373A53] text-black text-center font-Montserrat text-[14px] font-normal hover:bg-[#FFDC50] transition-all duration-150",
                    slippage === item.value && "bg-[#FFDC50]"
                  )}
                  onClick={() => {
                    setSlippage(item.value);
                    popoverRef.current?.onClose();
                  }}
                >
                  {item.label}
                </button>
              ))
            }
          </div>
        </Card>
      )}
      placement={PopoverPlacement.BottomRight}
    >
      <button
        type="button"
        className={clsx("w-[22px] h-[22px] shrink-0 bg-[url('/images/icon-setting.svg')] bg-center bg-no-repeat bg-contain", className)}
      />
    </Popover>
  );
}

export const SimpleTokenInput = forwardRef((props: any, ref: any) => {
  const {
    value,
    disabled,
    onChange,
    token,
    className,
    tokenBalanceUpdater,
    isPrice = true,
    onTokenSelectOpen,
    loadTokenBalance,
  } = props;

  const prices = usePriceStore((store: any) => store.price);

  const { tokenBalance, isLoading: loadingTokenBalance, update: updateTokenBalance } = useTokenBalance(
    token?.isNative ? "native" : token?.address,
    token?.decimals,
    token?.chainId
  );

  const tokenValue = useMemo(() => {
    if (isPrice && prices) {
      const currentPrice = prices?.[token?.address] || prices?.[token?.symbol];
      if (!currentPrice) return null;
      return Big(value || 0).times(currentPrice || 0);
    }
    return null;
  }, [prices, token, isPrice, value]);

  useEffect(() => {
    updateTokenBalance();
  }, [tokenBalanceUpdater]);

  useEffect(() => {
    loadTokenBalance?.(tokenBalance);
  }, [tokenBalance]);

  const refs = {
    updateTokenBalance,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={clsx("w-full p-[16px_12px_10px_20px] rounded-[12px] border border-[#373A53] bg-white text-[#3D405A] font-montserrat text-[12px] font-medium leading-normal", className)}>
      <div className="w-full flex justify-between items-center gap-[10px] h-[26px]">
        <div className="w-0 h-full flex-1 overflow-hidden">
          <InputNumber
            placeholder="0"
            className={clsx("w-full h-full text-black font-montserrat text-[26px] font-bold leading-[100%]", disabled ? "cursor-default" : "")}
            value={value}
            onNumberChange={onChange}
            disabled={disabled}
          />
        </div>
        <div
          className={clsx("shrink-0 flex justify-end items-center gap-[8px]", disabled ? "cursor-default" : "cursor-pointer")}
          onClick={() => {
            if (disabled) return;
            onTokenSelectOpen?.();
          }}
        >
          <div className="flex items-center">
            {
              token.underlyingTokens ? token.underlyingTokens.map((_token: any, _idx: number) => (
                <LazyImage
                  key={_token.address}
                  fallbackSrc="/assets/tokens/default_icon.png"
                  src={_token.icon}
                  alt=""
                  containerClassName={clsx("!w-[26px] !h-[26px] object-center object-contain rounded-full shrink-0 overflow-hidden", _idx > 0 && "ml-[-10px]")}
                />
              )) : (
                <LazyImage
                  fallbackSrc="/assets/tokens/default_icon.png"
                  src={token.icon}
                  alt=""
                  containerClassName="!w-[26px] !h-[26px] object-center object-contain rounded-full shrink-0 overflow-hidden"
                />
              )
            }
          </div>
          <div className={clsx("text-black font-montserrat text-[16px] font-[600] leading-[90%] whitespace-nowrap overflow-hidden", disabled ? "max-w-[130px]" : "max-w-[120px]")}>
            {
              token.underlyingTokens
                ? formatLongText(token.underlyingTokens.map((_token: any, _idx: number) => _token.symbol).join("-"), 6, 4)
                : formatLongText(token.symbol, 6, 4)
            }
          </div>
          {
            !disabled && (
              <img src="/images/vaults/v2/zap/icon-arrow-down.svg" alt="" className="w-[12px] h-[7px] object-center object-contain shrink-0" />
            )
          }
        </div>
      </div>
      <div className="mt-[5px] w-full flex justify-between items-center gap-[10px] whitespace-nowrap overflow-hidden">
        {
          isPrice ? (
            <div className="">
              {tokenValue ? numberFormatter(tokenValue, 2, true, { isShort: true, round: 0, prefix: "$", isZeroPrecision: true }) : "-"}
            </div>
          ) : (
            <div></div>
          )
        }
        <div className="flex items-center gap-[4px]">
          <span>balance:</span>
          <span
            onClick={() => {
              if (disabled || loadingTokenBalance) return;
              onChange?.(tokenBalance);
            }}
            className={clsx("underline underline-offset-2", disabled ? "opacity-50 cursor-default" : "cursor-pointer")}
          >
            {
              loadingTokenBalance ? (
                <div className="translate-y-[2px]"><Loading size={14} /></div>
              ) :
                numberFormatter(tokenBalance, 4, true, { isShort: true, round: 0 })
            }
          </span>
        </div>
      </div>
    </div>
  );
});
