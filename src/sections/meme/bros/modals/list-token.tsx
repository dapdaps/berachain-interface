import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button";
import CurrencySelect from "@/sections/swap/TokenSelector";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function ListToken({ open, onClose }: any) {
  return (
    <>
      <Basic open={open} onClose={onClose} className="w-[520px]">
        <div className="flex items-center gap-[12px] text-[20px] font-bold">
          <span>List A Meme Token</span>
        </div>
        <div className="text-[14px] font-semibold pb-[14px] pt-[10px]">
          Token Address
        </div>
        <div className="rounded-[12px] border border-[#373A53] bg-white flex items-center px-[14px] h-[50px]">
          <input
            className="grow"
            value={"0x7e50388e742bd0d44063b964c149c83da6ba7f1c"}
          />
          {/* <button className="text-[#568EFF] underline text-[14px] font-semibold">
            Paste
          </button> */}
          <button className="w-[21px] h-[21px] rounded-full bg-[#DFDCC4] flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M6.44404 4.99997L9.7799 1.66415C10.0307 1.41332 10.0735 1.0494 9.87557 0.851571L9.14823 0.12424C8.95031 -0.0736761 8.58689 -0.0302598 8.33564 0.220406L5.00011 3.55614L1.66433 0.220489C1.41349 -0.030593 1.04957 -0.0736762 0.851652 0.12449L0.124312 0.851904C-0.073523 1.04949 -0.0306893 1.4134 0.22048 1.66423L3.55634 4.99997L0.22048 8.33596C-0.0302726 8.58663 -0.0736897 8.95029 0.124312 9.14821L0.851652 9.87562C1.04957 10.0735 1.41349 10.0306 1.66433 9.77987L5.00027 6.44388L8.33572 9.77937C8.58697 10.0307 8.95039 10.0735 9.14831 9.87562L9.87565 9.14821C10.0735 8.95029 10.0307 8.58663 9.77998 8.33563L6.44404 4.99997Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
        <div className="mt-[10px]">
          <div className="text-[14px] font-semibold pb-[14px]">
            Add Incentives
          </div>
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
        <Button
          type="primary"
          className="w-full h-[60px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
        >
          List a meme
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
