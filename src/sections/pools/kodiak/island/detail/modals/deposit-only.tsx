import Basic from "./basic";
import Steps from "./steps";
import Image from "next/image";
import Button from "@/components/button";

export default function DepositOnly({}: any) {
  return (
    <Basic title="Deposit Liquidity to Island">
      <Steps num={3} className="mt-[20px]" />
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            HONEY deposited
          </div>
          <div className="flex items-center gap-[9px]">
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="font-semibold text-[16px]">iBGT</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            HONEY deposited
          </div>
          <div className="flex items-center gap-[9px]">
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="font-semibold text-[16px]">iBGT</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">Rates</div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            1 HONEY = 0.06665 BERA
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Est. received
          </div>
          <div className="font-semibold text-[16px]">iBGT</div>
        </div>
      </div>
      <Button type="primary" className="w-full h-[46px] mt-[16px]">
        Confirm Supply
      </Button>
    </Basic>
  );
}
