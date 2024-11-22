import Basic from "./basic";
import Button from "@/components/button";
import Image from "next/image";

export default function Incentives({ open, data, onClose, onOpenModal }: any) {
  return (
    <Basic open={open} onClose={onClose} className="w-[916px]">
      <div className="flex text-[20px] font-bold justify-between pr-[40px] md:pr-0">
        <div>Incentives</div>
        <Button
          type="primary"
          className="h-[36px]"
          onClick={() => {
            onOpenModal(9, data);
          }}
        >
          Add Incentives
        </Button>
      </div>
      <div className="mb-[16px] pt-[28px] flex items-center font-medium text-[#3D405A] text-[14px] border-b border-black/20 pb-[10px]">
        <div className="w-[324px] md:w-[180px]">Providers</div>
        <div className="w-[360px] md:grow">Incentive Breakdown</div>
        <div className="md:w-[66px] md:shrink-0">Time</div>
      </div>
      <div className="text-[#3D405A] font-semibold text-[14px] max-h-[50dvh] overflow-y-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item: any) => (
          <div key={item} className=" flex items-center  pb-[26px]">
            <div className="w-[324px] flex items-center gap-[5px] md:w-[180px]">
              <Image
                src="/assets/tokens/bera.svg"
                width={26}
                height={26}
                alt="Reward Token"
                className="rounded-full"
              />
              <div className="md:w-[92px] md:overflow-hidden md:h-[20px] md:text-ellipsis	md:whitespace-nowrap">
                1000,000 sPepe
              </div>
            </div>
            <div className="w-[360px] flex items-center gap-[5px] md:grow">
              <Image
                src="/assets/tokens/bera.svg"
                width={26}
                height={26}
                alt="Reward Token"
                className="rounded-full"
              />
              <div>
                <div>1000,000 sPepe</div>
                <div className="text-[12px] font-medium">$10,000.35</div>
              </div>
            </div>
            <div className="md:w-[66px] md:shrink-0">2023-1-2 10:45:45</div>
          </div>
        ))}
      </div>
    </Basic>
  );
}
