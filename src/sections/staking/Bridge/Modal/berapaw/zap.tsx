import { DEFAULT_CHAIN_ID } from "@/configs";
import ExchangeIcon from "@/sections/swap/Content/ExchangeIcon";
import SubmitBtn from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import Big from "big.js";
import clsx from "clsx";
import { useMemo } from "react";

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
    slippage,
    setSlippage,
    slippageList,
    onSwap,
    onRefresh,
    zapData,
    tokenData,
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
      >
        Swap & Stake
      </SubmitBtn>
      <div className="mt-[20px] flex items-center justify-end gap-[4px]">
        <div className="">Max. Slippage:</div>
        <div className="flex gap-[8px] items-center">
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
                }}
              >
                {item.label}
              </button>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default BerapawZap;
