import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button";
import CurrencySelect from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function AddIncentives() {
  return (
    <>
      <Basic open={true} onClose={() => {}} className="w-[520px]">
        <div className="flex text-[20px] font-bold">Add Incentives</div>
        <div className="mt-[20px]">
          <TokenAmout
            currency={{}}
            prices={{}}
            type="in"
            amount=""
            updater={1}
            onAmountChange={() => {}}
            onUpdateCurrencyBalance={() => {}}
            onCurrencySelectOpen={() => {}}
          />
        </div>
        <Button type="primary" className="w-full h-[60px] mt-[16px]">
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
