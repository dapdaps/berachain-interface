import Basic from "./basic";
import Steps from "./steps";
import Image from "next/image";
import Button from "@/components/button";
import Range from "@/components/range";
import Loading from "./loading";

export default function WithStaking({}: any) {
  return (
    <Basic title="Deposit Liquidity to Island">
      <Steps num={6} className="mt-[20px]" />
      <div className="flex items-center justify-between mt-[16px]">
        <div className="text-[14px] font-medium	text-[#3D405A]">
          Select lock-up period
        </div>
        <div className="font-semibold text-[16px]">30 days</div>
      </div>
      <Range />
      <div className="text-[14px] font-medium	text-[#3D405A] mt-[16px]">
        Estimated award by the end of the lock-up period
      </div>
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="text-[14px] font-medium">iBGT</div>
          </div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            <span className="text-[16px] font-semibold mr-[7px]">0.046</span>
            <span>HONEY deposited</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Stake amount
          </div>
          <div className="text-[14px] font-medium	text-[#3D405A]"></div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Multiplier
          </div>
          <div className="text-[14px] font-medium	text-[#3D405A]"></div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">APR</div>
          <div className="text-[14px] font-medium	text-[#3D405A]"></div>
        </div>
      </div>
      <Button type="primary" className="w-full h-[46px] mt-[16px]">
        Confirm
      </Button>
    </Basic>
  );
}
