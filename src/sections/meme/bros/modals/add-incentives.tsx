import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button/submit-button";
import CurrencySelect from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import { useState, useMemo } from "react";
import useData from "../hooks/use-data";
import useAddIncentives from "../hooks/use-add-incentives";
import Big from "big.js";

export default function AddIncentives({
  rewardTokens,
  data,
  open,
  onClose,
  onSuccess
}: any) {
  const prices = usePriceStore((store: any) => store.price);
  const [amount, setAmount] = useState("");
  const [showSelectToken, setShowSelectToken] = useState(false);
  const [token, setToken] = useState<any>(rewardTokens?.[0]);
  const [balance, setBalance] = useState("");
  const { currentRound } = useData();
  const { loading, onAdd } = useAddIncentives({
    token,
    amount,
    data,
    rewardAddress: currentRound.reward_address,
    onSuccess
  });

  const errorTips = useMemo(() => {
    if (Number(amount || 0) === 0) return "Enter an amount";
    if (Big(amount).gt(balance || 0)) {
      return "Insufficient Balance";
    }
    return "";
  }, [amount, balance]);

  return (
    <>
      <Basic open={open} onClose={onClose} className="w-[520px]">
        <div className="flex text-[20px] font-bold">Add Incentives</div>
        <div className="mt-[20px]">
          <TokenAmout
            currency={token}
            prices={prices}
            type="in"
            amount={amount}
            onUpdateCurrencyBalance={(balance: any) => {
              setBalance(balance);
            }}
            onAmountChange={(val: any) => {
              setAmount(val);
            }}
            onCurrencySelectOpen={() => {
              setShowSelectToken(true);
            }}
          />
        </div>
        <Button
          spender={currentRound.reward_address}
          token={token}
          amount={amount}
          loading={loading}
          errorTips={errorTips}
          disabled={!!errorTips}
          onClick={onAdd}
        >
          Add
        </Button>
      </Basic>
      <CurrencySelect
        display={showSelectToken}
        tokens={rewardTokens}
        chainId={DEFAULT_CHAIN_ID}
        onSelect={(token: any) => {
          setToken(token);
          setShowSelectToken(false);
        }}
        onClose={() => {
          setShowSelectToken(false);
        }}
      />
    </>
  );
}
