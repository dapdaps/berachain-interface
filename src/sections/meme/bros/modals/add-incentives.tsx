import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button";
import CurrencySelect from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import { useState } from "react";

export default function AddIncentives({ data, open, onClose }: any) {
  const prices = usePriceStore((store: any) => store.price);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  return (
    <>
      <Basic open={open} onClose={onClose} className="w-[520px]">
        <div className="flex text-[20px] font-bold">Add Incentives</div>
        <div className="mt-[20px]">
          <TokenAmout
            currency={data}
            prices={prices}
            type="in"
            amount={amount}
            onUpdateCurrencyBalance={(balance: any) => {
              setBalance(balance);
            }}
            onAmountChange={(val: any) => {
              setAmount(val);
            }}
            onCurrencySelectOpen={() => {}}
          />
        </div>
        <Button
          type="primary"
          className="w-full h-[60px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
        >
          Add
        </Button>
      </Basic>
      <CurrencySelect
        display={false}
        tokens={[]}
        chainId={DEFAULT_CHAIN_ID}
        chainIdNotSupport={true}
        onSelect={(token: any) => {}}
      />
    </>
  );
}
