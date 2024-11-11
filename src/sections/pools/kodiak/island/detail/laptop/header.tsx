import Image from "next/image";
import Back from "./back";
import { balanceShortFormated } from "@/utils/balance";

export default function Header({ onBack = () => {} }: any) {
  return (
    <div className="rounded-[10px] bg-[#FFDC50] p-[16px] flex gap-[22px] items-start">
      <Back onClick={onBack} />
      <div>
        <div className="flex items-center gap-[24px]">
          <div className="flex items-center">
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={40}
              height={40}
              className="ml-[-10px] rounded-full"
            />
          </div>
          <div>
            <div className="text-[20px] font-semibold">BERA-HONEY</div>
            <div className="text-[12px] font-normal">0.3%</div>
          </div>
        </div>
        <div className="flex gap-[60px] mt-[8px]">
          <div>
            <div className="text-[14px] font-medium">TVL</div>
            <div className="text-[18px] font-semibold">$9.17M</div>
          </div>
          <div>
            <div className="text-[14px] font-medium">Island APR</div>
            <div className="text-[18px] font-semibold">$9.17M</div>
          </div>
          <div>
            <div className="text-[14px] font-medium">Volume (All Time)</div>
            <div className="text-[18px] font-semibold">$9.17M</div>
          </div>
        </div>
      </div>
    </div>
  );
}
