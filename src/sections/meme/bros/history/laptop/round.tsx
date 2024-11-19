import Image from "next/image";
import Button from "@/components/button";
import RoundLabel from "../../components/round-label";

export default function Round() {
  return (
    <div className="relative w-full rounded-[18px] mt-[50px] bg-[#FFE5B8] shadow-shadow1 border border-black p-[5px]">
      <RoundLabel
        title="Round 2"
        subTitle="NoV.20-dec.3, 2024"
        className="!absolute top-[-34px] left-[24px]"
      />
      <div className="border-b border-black/20 pt-[50px] pl-[20px] pb-[20px] flex items-center">
        <div className="flex items-center w-1/4">
          {[1, 2, 3, 4].map((item, i) => (
            <Image
              key={item}
              src="/assets/tokens/bera.svg"
              width={40}
              height={40}
              alt="Reward Token"
              className={i !== 0 ? "ml-[-15px]" : ""}
            />
          ))}
        </div>
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">Total Dapped</div>
          <div className="font-semibold	mt-[2px]">1</div>
        </div>
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">Total Rewards</div>
          <div className="font-semibold	mt-[2px] flex items-center gap-[10px]">
            <span>1</span>
            <button className="font-medium underline ml-[12px]">
              Incentives
            </button>
          </div>
        </div>
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">Total Dappers</div>
          <div className="font-semibold	mt-[2px]">1</div>
        </div>
      </div>
      <div className="pt-[12px] pl-[20px] pb-[20px] flex items-center">
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">You Voted for</div>
          <div className="font-semibold	mt-[2px]">1</div>
        </div>
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">Incentive Added</div>
          <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
            <Image
              src="/assets/tokens/bera.svg"
              width={16}
              height={16}
              alt="Incentive Token"
              className="rounded-full"
            />
            <span>1</span>
          </div>
        </div>
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">You Dapped</div>
          <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
            <span>1</span>
            <Image
              src="/assets/tokens/bera.svg"
              width={16}
              height={16}
              alt="Incentive Token"
              className="rounded-full"
            />
            <Button className="h-[28px] ml-[12px]" type="primary">
              Unstake!
            </Button>
          </div>
        </div>
        <div className="w-1/4">
          <div className="text-[#3D405A] font-medium">Your Rewards</div>
          <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
            <span>1</span>
            <Image
              src="/assets/tokens/bera.svg"
              width={16}
              height={16}
              alt="Incentive Token"
              className="rounded-full"
            />
            <Image
              src="/assets/tokens/bera.svg"
              width={16}
              height={16}
              alt="Incentive Token"
              className="rounded-full ml-[-8px]"
            />
            <Button disabled className="h-[28px] ml-[12px]" type="primary">
              Claimed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
