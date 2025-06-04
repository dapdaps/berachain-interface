import { DEFAULT_CHAIN_ID } from "@/configs";
import SubmitBtn from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import Big from "big.js";

const BerapawStake = (props: any) => {
  const { data, amount, onAmountChange, prices } = props;

  return (
    <div className="">
      <div className="mt-[10px] mb-[10px]">
        Deposit your tokens directly into the vault.
      </div>
      <TokenAmount
        type="out"
        currency={data?.stakingToken}
        amount={amount}
        onAmountChange={(_amount: string) => {
          onAmountChange(_amount);
        }}
        disabled
        prices={prices}
        account
        outputCurrencyReadonly={true}
        isPrice={false}
        balanceClassName="!underline underline-offset-2 cursor-pointer"
        onBalanceClick={(balance: any) => {
          onAmountChange(balance);
        }}
        updater={1}
      />
      <SubmitBtn
        chain={{
          chainId: DEFAULT_CHAIN_ID
        }}
        amount={amount}
        spender={data?.vaultAddress}
        errorTips={null}
        token={data?.stakingToken}
        loading={false}
        onClick={() => {}}
        disabled={!amount || Big(amount).lte(0)}
        onRefresh={() => {}}
        updater={1}
      >
        Stake
      </SubmitBtn>
    </div>
  );
};

export default BerapawStake;
