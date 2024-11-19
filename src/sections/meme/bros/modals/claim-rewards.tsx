import Basic from "./basic";
import Image from "next/image";
import Button from "@/components/button";

export default function ClaimRewards() {
  return (
    <Basic open={true} onClose={() => {}} className="w-[520px]">
      <div className="text-[20px] font-bold">Claim Rewards</div>
      <div className="mt-[19px] flex items-center text-[16px] font-semibold gap-[10px]">
        <div className="flex items-center shrink-0 gap-[10px]">
          <Image
            src="/assets/tokens/bera.svg"
            width={26}
            height={26}
            alt="Reward Token"
            className="rounded-full"
          />
          <div>BERA</div>
        </div>
        <div className="grow border-b border-dashed border-[#160705]/10" />
        <div className="shrink-0">0.01</div>
      </div>
      <Button
        type="primary"
        className="w-full h-[60px] mt-[16px] text-[18px] font-semibold"
      >
        Claim
      </Button>
    </Basic>
  );
}
