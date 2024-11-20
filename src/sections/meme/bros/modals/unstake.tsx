import Basic from "./basic";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button";

export default function Unstake({ open, onClose }: any) {
  return (
    <Basic open={open} onClose={onClose} className="w-[520px]">
      <div className="flex text-[20px] font-bold pt-[25px] md:pt-0">
        Unstake sPepe
      </div>
      <div className="mt-[20px]">
        <TokenAmout
          currency={{}}
          prices={{}}
          amount=""
          outputCurrencyReadonly={true}
          updater={1}
          onUpdateCurrencyBalance={() => {}}
        />
      </div>
      <Button
        type="primary"
        className="w-full h-[60px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
      >
        Unstake
      </Button>
      <div className="flex items-center gap-[6px] text-[14px] py-[18px]">
        <div className="font-CherryBomb w-[20px] h-[20px] rounded-full bg-[#FFB7BF] text-center">
          !
        </div>
        <div className="font-medium">
          The unstaked assets will available to be withdrawn in 10 days.
        </div>
      </div>
    </Basic>
  );
}
