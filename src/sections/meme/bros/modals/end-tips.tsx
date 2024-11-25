import Basic from "./basic";
import Button from "@/components/button";
import RoundLabel from "../components/round-label";

export default function EndTips({ open, onClose }: any) {
  return (
    <Basic open={open} onClose={onClose}>
      <div className="flex flex-col items-center justify-center">
        <RoundLabel
          title="Round 1 Ended"
          contentClassName="!bg-[#FF7C3B]"
          shadowClassName="!bg-[#924016]"
        />
        <div className="text-[20px] font-semibold mt-[16px]">
          Super meme bros. Round 1 has ended!
        </div>
        <div className="text-[16px] font-semibold mt-[16px] text-center">
          You staked <span className="font-bold">12.23M</span> sPepe, earned
          <span className="font-bold">$23.5</span> valued rewards. View history
          to claim and unstake.
        </div>
        <Button
          type="primary"
          className="w-[215px] h-[50px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
        >
          View History
        </Button>
        <div className="text-[16px] font-semibold mt-[26px]">
          Super meme bros. Round 2 starts now.
        </div>
        <Button
          type="primary"
          className="w-[215px] h-[50px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
        >
          I see
        </Button>
      </div>
    </Basic>
  );
}
