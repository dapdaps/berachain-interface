import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button/submit-button";
import { usePriceStore } from "@/stores/usePriceStore";
import { useMemo, useState } from "react";
import useUnstake from "../hooks/use-unstake";
import Big from "big.js";
import CurrencySelect from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function UnstakeHistory({
  data,
  userStakeData,
  open,
  onClose,
  onSuccess
}: any) {
  const prices = usePriceStore((store: any) => store.price);
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState<any>();
  const [showSelectToken, setShowSelectToken] = useState(false);
  const { loading: unstaking, onUnstake } = useUnstake({
    token,
    amount,
    onSuccess
  });
  const tokens = useMemo(() => {
    const _tokens = userStakeData?.[data.round].tokens.map((token: any) => ({
      ...token,
      ...token.token
    }));
    if (!token) setToken(_tokens[0]);
    return _tokens;
  }, [userStakeData, data]);

  const errorTips = useMemo(() => {
    if (!token) return "Select a token";
    if (Number(amount || 0) === 0) return "Enter an amount";
    if (Big(amount).gt(token.stakedAmount || 0)) {
      return "Insufficient Balance";
    }
    return "";
  }, [amount, token]);

  return (
    <>
      <Basic open={open} onClose={onClose} className="w-[520px]">
        <div className="flex text-[20px] font-bold pt-[10px] md:pt-0">
          Unstake {token?.symbol}
        </div>
        <div className="mt-[20px]">
          <TokenAmout
            currency={token}
            prices={prices}
            amount={amount}
            defaultBalance={token?.stakedAmount}
            onAmountChange={(val: any) => {
              setAmount(val);
            }}
            onCurrencySelectOpen={() => {
              setShowSelectToken(true);
            }}
          />
        </div>
        <Button
          token={token}
          amount={amount}
          loading={unstaking}
          errorTips={errorTips}
          disabled={!!errorTips}
          onClick={onUnstake}
        >
          Unstake
        </Button>
        <div className="flex items-center gap-[6px] text-[14px] py-[18px]">
          <div className="font-CherryBomb w-[20px] h-[20px] rounded-full bg-[#FFB7BF] text-center shrink-0">
            !
          </div>
          <div className="font-medium">
            The unstaked assets will available to be withdrawn in 2 days.
          </div>
        </div>
      </Basic>
      <CurrencySelect
        display={showSelectToken}
        tokens={tokens}
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
