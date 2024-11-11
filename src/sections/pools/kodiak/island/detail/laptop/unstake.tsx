import Button from "@/components/button";
import Image from "next/image";

export default function Unstake() {
  return (
    <>
      <div className="rounded-[12px] border border-[#373A53] bg-white p-[14px] mt-[16px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[5px]">
            <div className="flex items-center">
              <Image
                src={"/assets/tokens/bera.svg"}
                alt={"Bear Token"}
                width={26}
                height={26}
                className="rounded-full"
              />
              <Image
                src={"/assets/tokens/bera.svg"}
                alt={"Bear Token"}
                width={26}
                height={26}
                className="ml-[-10px] rounded-full"
              />
            </div>
            <div>
              <div className="text-[16px] font-semibold">BERA-HONEY</div>
            </div>
          </div>
          <div className="text-[16px] font-semibold">2.00497/0.120247</div>
        </div>
        <div className="flex justify-end">
          <div className="text-center rounded-[6px] bg-[#7587FF] w-[50px] leading-[24px] text-white text-[14px] font-semibold">
            x3.00
          </div>
        </div>
        <div className="flex justify-end items-center gap-[10px] mt-[14px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="15"
            viewBox="0 0 13 15"
            fill="none"
          >
            <rect
              x="1"
              y="6"
              width="11"
              height="8"
              rx="2"
              stroke="#7587FF"
              strokeWidth="2"
            />
            <path
              d="M9 6V3.5C9 2.11929 7.88071 1 6.5 1V1C5.11929 1 4 2.11929 4 3.5V6"
              stroke="#7587FF"
              strokeWidth="2"
            />
          </svg>
          <div className="text-[16px] font-semibold">in 30 days</div>
        </div>
      </div>
      <Button disabled type="primary" className="w-full h-[46px] mt-[16px]">
        Unstake
      </Button>
    </>
  );
}
