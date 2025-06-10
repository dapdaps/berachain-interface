import { DEFAULT_CHAIN_ID } from "@/configs";
import SubmitBtn, { BaseButton } from "@/sections/swap/SubmitBtn";
import TokenAmount from "@/sections/swap/TokenAmount";
import Big from "big.js";

const BerapawStake = (props: any) => {
  const { data, amount, onAmountChange, prices, onApprove, approving, onStake, staking, tokenData } = props;

  return (
    <div className="">
      <div className="mt-[10px] mb-[10px]">
        Deposit your tokens directly into the vault.
      </div>
      <TokenAmount
        type="out"
        currency={{
          ...data?.stakingToken,
          icon: tokenData?.logosUri?.[0]
        }}
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
        updater={1}
      />
      {
        data?.approved ? (
          <SubmitBtn
            chain={{
              chainId: DEFAULT_CHAIN_ID
            }}
            amount={amount}
            spender={data?.vaultAddress}
            errorTips={null}
            token={data?.stakingToken}
            loading={staking}
            onClick={() => {
              onStake(data, amount, data?.stakingToken?.symbol === "LBGT" ? "deposit" : "stake");
            }}
            disabled={!amount || Big(amount).lte(0) || staking}
            onRefresh={() => { }}
            updater={1}
          >
            Stake
          </SubmitBtn>
        ) : (
          <BaseButton
            onClick={() => onApprove(data)}
            loading={approving}
            disabled={approving}
          >
            Set Operator & Start Earning
          </BaseButton>
        )
      }
    </div>
  );
};

export default BerapawStake;
