import Card from "@/components/card";
import Popover, { PopoverPlacement } from "@/components/popover";
import { DEFAULT_CHAIN_ID } from "@/configs";
import ExchangeIcon from "@/sections/swap/Content/ExchangeIcon";
import SubmitBtn from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import Big from "big.js";
import clsx from "clsx";
import { useMemo, useRef } from "react";

const BerapawZap = (props: any) => {
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

  return (
    <div className="mt-[10px]">
      <TokenAmount
        type="in"
        currency={inputCurrency}
        amount={inputCurrencyAmount}
        prices={prices}
        isPrice={false}
        account
        onCurrencySelectOpen={onOpenTokenSelector}
        onAmountChange={(_amount: string) => {
          setInputCurrencyAmount(_amount);
        }}
        updater={1}
      />
      <ExchangeIcon />
      <TokenAmount
        type="out"
        currency={{
          ...data?.stakingToken,
          icon: tokenData?.logosUri?.[0]
        }}
        amount={outputCurrencyAmount}
        isPrice={false}
        disabled
        prices={prices}
        account
        outputCurrencyReadonly={true}
        inputDisabled={true}
        updater={2}
      />
      <SubmitBtn
        chain={{
          chainId: DEFAULT_CHAIN_ID
        }}
        amount={inputCurrencyAmount}
        spender={spender}
        errorTips={null}
        token={inputCurrency}
        loading={loading}
        onClick={onSwap}
        disabled={!inputCurrencyAmount || Big(inputCurrencyAmount).lte(0)}
        onRefresh={onRefresh}
        updater={1}
        loadingText={currentZapStepText}
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

export default BerapawZap;

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
