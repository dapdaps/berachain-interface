import Image from "next/image";

const SimpleTotal = () => {
  return (
    <div className="flex items-center justify-between text-[16px]">
      <div className="font-semibold">My Deposits</div>
      <div className="font-bold">$96.82</div>
    </div>
  );
};

const Total = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-[16px]">My Deposits</div>
        <div className="font-bold text-[16px] mt-[8px]">$96.82</div>
        <div className="font-medium text-[12px] mt-[4px]">0.46 KODIAK-1</div>
      </div>
      <div>
        <div className="font-semibold text-[16px]">Available</div>
        <div className="font-bold text-[16px] mt-[8px]">$96.82</div>
        <div className="font-medium text-[12px] mt-[4px]">0.46 KODIAK-1</div>
      </div>
      <div>
        <div className="font-semibold text-[16px]">Locked</div>
        <div className="font-bold text-[16px] mt-[8px]">$96.82</div>
        <div className="font-medium text-[12px] mt-[3px]">0.46 KODIAK-1</div>
      </div>
    </div>
  );
};

export default function Mydeposit() {
  return (
    <div className="rounded-[10px] bg-black/5 px-[16px] py-[20px] w-[440px]">
      {/* <SimpleTotal /> */}
      <Total />
      <div className="flex items-center justify-between mt-[18px]">
        <div className="flex items-center gap-[9px]">
          <Image
            src={"/assets/tokens/bera.svg"}
            alt={"Bear Token"}
            width={26}
            height={26}
            className="rounded-full"
          />
          <div className="font-semibold text-[14px]">iBGT</div>
        </div>
        <div className="font-semibold text-[14px]">iBGT</div>
      </div>
      <div className="flex items-center justify-between mt-[10px]">
        <div className="flex items-center gap-[9px]">
          <Image
            src={"/assets/tokens/bera.svg"}
            alt={"Bear Token"}
            width={26}
            height={26}
            className="rounded-full"
          />
          <div className="font-semibold text-[14px]">iBGT</div>
        </div>
        <div className="font-semibold text-[14px]">iBGT</div>
      </div>
    </div>
  );
}
