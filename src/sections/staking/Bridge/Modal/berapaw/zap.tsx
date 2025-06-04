import { DEFAULT_CHAIN_ID } from "@/configs";
import ExchangeIcon from "@/sections/swap/Content/ExchangeIcon";
import SubmitBtn from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import Big from "big.js";

const BerapawZap = (props: any) => {
  const {
    data,
    inputCurrency,
    inputCurrencyAmount,
    setInputCurrencyAmount,
    prices,
    outputCurrencyAmount,
    setOutputCurrencyAmount,
    loading,
  } = props;

  return (
    <div className="mt-[10px]">
      <TokenAmount
        type="in"
        currency={inputCurrency}
        amount={inputCurrencyAmount}
        prices={prices}
        isPrice={false}
        account
        onCurrencySelectOpen={() => {
          
        }}
        onAmountChange={(_amount: string) => {
          setInputCurrencyAmount(_amount);
        }}
        onBalanceClick={(balance: any) => {
          setInputCurrencyAmount(balance);
        }}
        updater={1}
      />
      <ExchangeIcon />
      <TokenAmount
        type="out"
        currency={data?.stakingToken}
        amount={outputCurrencyAmount}
        isPrice={false}
        disabled
        prices={prices}
        account
        outputCurrencyReadonly={true}
        onAmountChange={(_amount: string) => {
          setOutputCurrencyAmount(_amount);
        }}
        onBalanceClick={(balance: any) => {
          setOutputCurrencyAmount(balance);
        }}
        balanceClassName="!underline underline-offset-2 cursor-pointer"
        updater={2}
      />
      <SubmitBtn
        chain={{
          chainId: DEFAULT_CHAIN_ID
        }}
        amount={inputCurrencyAmount}
        spender={data?.vaultAddress}
        errorTips={null}
        token={data?.stakingToken}
        loading={false}
        onClick={() => { }}
        disabled={!inputCurrencyAmount || Big(inputCurrencyAmount).lte(0)}
        onRefresh={() => { }}
        updater={1}
      >
        Swap & Stake
      </SubmitBtn>
    </div>
  );
};

export default BerapawZap;
