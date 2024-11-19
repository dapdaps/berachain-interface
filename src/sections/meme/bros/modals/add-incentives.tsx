import Modal from "@/components/modal";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button";
import CurrencySelect from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function Unstake() {
  return (
    <>
      <Modal open={true} onClose={() => {}}>
        <div className="p-[20px] w-[520px] bg-[#FFFDEB] rounded-[20px] border border-black md:w-full md:px-[12px] md:rounded-b-none">
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
        </div>
      </Modal>
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
