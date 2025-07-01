import Card from "@/components/card";
import Popover, { PopoverPlacement } from "@/components/popover";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { getTokenLogo } from "@/sections/dashboard/utils";
import ExchangeIcon from "@/sections/swap/Content/ExchangeIcon";
import SubmitBtn from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import { useDebounceFn } from "ahooks";
import Big from "big.js";
import clsx from "clsx";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

const BerapawZap = (props: any, ref: any) => {
  const {
    data,
    inputCurrency,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    prices,
    outputCurrencyAmount,
    loading,
    onOpenTokenSelector,
    onSwap,
    onRefresh,
    zapData,
    tokenData,
    currentZapStepText,
  } = props;

  const [spender] = useMemo(() => {
    const { approve = {} } = zapData ?? {};
    const { spender } = approve;
    return [spender];
  }, [zapData]);

  const [_inputCurrencyAmount, _setInputCurrencyAmount] = useState(inputCurrencyAmount);
  const [inputCurrencyUpdater, setInputCurrencyUpdater] = useState(1);
  const [outputCurrencyUpdater, setOutputCurrencyUpdater] = useState(1);

  const buttonText = useMemo(() => {
    if (!_inputCurrencyAmount || Big(_inputCurrencyAmount || 0).lte(0)) {
      return "Enter an Amount";
    }
    return null;
  }, [_inputCurrencyAmount]);

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
    <div className="mt-[10px]">
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
        Swap & Stake
      </SubmitBtn>
      {
        zapData?.name && (
          <div className="flex items-center justify-center gap-[4px] mt-[10px] text-[14px]">
            <div>Powered by</div>
            <img src={zapData?.logo} className="w-[16px] h-[16px] object-center object-contain rounded-full shrink-0" />
            <div>{zapData?.name}</div>
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
