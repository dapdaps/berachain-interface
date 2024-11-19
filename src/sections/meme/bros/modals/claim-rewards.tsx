import Modal from "@/components/modal";
import Image from "next/image";
import Button from "@/components/button";

export default function ClaimRewards() {
  return (
    <Modal open={true} onClose={() => {}}>
      <div className="p-[20px] w-[520px] bg-[#FFFDEB] rounded-[20px] border border-black md:w-full md:px-[12px] md:rounded-b-none">
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
        <Button type="primary" className="w-full h-[60px] mt-[16px]">
          Claim
        </Button>
      </div>
    </Modal>
  );
}
