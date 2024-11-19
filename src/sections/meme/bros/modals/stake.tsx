import Basic from "./basic";
import Image from "next/image";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button";

const ArrowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
  >
    <path
      d="M10.3536 4.35355C10.5488 4.15829 10.5488 3.84171 10.3536 3.64645L7.17157 0.464466C6.97631 0.269204 6.65973 0.269204 6.46447 0.464466C6.2692 0.659728 6.2692 0.976311 6.46447 1.17157L9.29289 4L6.46447 6.82843C6.2692 7.02369 6.2692 7.34027 6.46447 7.53553C6.65973 7.7308 6.97631 7.7308 7.17157 7.53553L10.3536 4.35355ZM0 4.5H10V3.5H0V4.5Z"
      fill="black"
    />
  </svg>
);

export default function StakeModal() {
  return (
    <Basic open={true} onClose={() => {}} className="w-[520px]">
      <div className="flex gap-[18px]">
        <Image
          src="/assets/tokens/bera.svg"
          width={60}
          height={60}
          alt="Reward Token"
          className="border border-[3px] border-black rounded-full"
        />
        <div>
          <div className="text-[20px] font-bold">sPepe</div>
          <button className="text-[14px] underline">Get sPepe</button>
        </div>
      </div>
      <div className="mt-[20px]">
        <TokenAmout
          type="in"
          currency={{}}
          prices={{}}
          amount=""
          outputCurrencyReadonly={true}
          updater={1}
          onUpdateCurrencyBalance={() => {}}
        />
      </div>
      <div className="flex flex-col gap-[12px] mt-[20px] rounded-[12px] border border-[#373A53] p-[12px] text-[14px] font-medium">
        <div className="flex justify-between items-center">
          <div>Your Dapped</div>
          <div className="flex items-center gap-[8px]">
            <Image
              src="/assets/tokens/bera.svg"
              width={16}
              height={16}
              alt="Reward Token"
              className="rounded-full"
            />
            <span className="line-through">0</span>
            {ArrowIcon}
            <span>50,000</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Gauge Weight</div>
          <div className="flex items-center gap-[8px]">
            <span className="line-through">0%</span>
            {ArrowIcon}
            <span>50,000%</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Staking APR</div>
          <div className="flex items-center gap-[8px]">
            <span className="line-through">-</span>
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full h-[60px] mt-[16px] text-[18px] font-semibold"
      >
        👊 Dap sPepe up!
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
