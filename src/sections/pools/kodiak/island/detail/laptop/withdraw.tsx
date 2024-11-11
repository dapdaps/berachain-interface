import Image from "next/image";
import Range from "@/components/range";
import Button from "@/components/button";
import clsx from "clsx";
import { useState } from "react";

export default function Withdraw() {
  const [percent, setPercent] = useState(0);

  return (
    <>
      <div className="rounded-[12px] bg-white border-[#373A53] border p-[12px] mt-[16px]">
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
        <div className="mt-[16px] flex items-center gap-[6px] text-[14px]">
          {[25, 50, 75, 100].map((item) => (
            <button
              className={clsx(
                "w-[42px] h-[22px] border border-[#373A53] rounded-[6px]",
                item === percent && "bg-[#FFDC50]"
              )}
              key={item}
              onClick={() => {
                setPercent(item);
              }}
            >
              {item === 100 ? "Max" : item + "%"}
            </button>
          ))}
        </div>
        <Range />
      </div>
      <div className="rounded-[12px] border border-[#373A53] p-[14px] mt-[14px]">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium">Pooled HONEY</div>
          <div className="flex items-center justify-end gap-[5px]">
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={26}
              height={26}
              className="ml-[-10px] rounded-full"
            />
            <div className="text-[16px] font-semibold">Pooled HONEY</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[14px]">
          <div className="text-[14px] font-medium">Pooled HONEY</div>
          <div className="flex items-center justify-end gap-[5px]">
            <Image
              src={"/assets/tokens/bera.svg"}
              alt={"Bear Token"}
              width={26}
              height={26}
              className="ml-[-10px] rounded-full"
            />
            <div className="text-[16px] font-semibold">Pooled HONEY</div>
          </div>
        </div>
      </div>
      <Button type="primary" className="w-full h-[46px] mt-[16px]">
        Withdraw
      </Button>
    </>
  );
}
