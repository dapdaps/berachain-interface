import Image from "next/image";

export default function RewardsPanel() {
  return (
    <div className="w-[236px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 px-[14px] py-[16px]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-[5px]">
          <Image
            src="/assets/tokens/bera.svg"
            width={20}
            height={20}
            alt="Reward Token"
          />
          <span className="text-[14px] font-semibold">sPepe</span>
        </div>
        <div>
          <div className="text-[14px] font-semibold">123,454.765</div>
          <div className="text-[14px] font-medium">$1.23K</div>
        </div>
      </div>
      <div className="flex justify-between items-start mt-[10px]">
        <div className="flex items-center gap-[5px]">
          <Image
            src="/assets/tokens/bera.svg"
            width={20}
            height={20}
            alt="Reward Token"
          />
          <span className="text-[14px] font-semibold">sPepe</span>
        </div>
        <div>
          <div className="text-[14px] font-semibold">123,454.765</div>
          <div className="text-[14px] font-medium">$1.23K</div>
        </div>
      </div>
    </div>
  );
}
