import clsx from "clsx";
import Image from "next/image";
import Button from "@/components/button";

export default function Earn() {
  return (
    <div
      className={clsx(
        "rounded-[10px] w-[440px] min-h-[86px] bg-black/5 relative px-[16px] mt-[20px] py-[18px]",
        "backdrop-blur-sm"
      )}
    >
      {/* <div className="absolute h-[86px] w-full flex justify-center items-center text-[14px] font-medium">
        <div className="w-[190px] text-center">
          Deposit and stake liquidity to earn extra rewards
        </div>
      </div> */}
      <div>
        <div className="text-[16px] font-semibold">Earned</div>
        <div className="flex items-start justify-between mt-[10px]">
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
          <div className="text-right">
            <div className="font-semibold text-[14px]">iBGT</div>
            <div className="font-medium text-[12px]">0.46 KODIAK-1</div>
          </div>
        </div>
        <div className="flex justify-end mt-[12px]">
          <Button
            className="w-[96px] h-[36px] flex justify-center items-center"
            type="primary"
            loading={false}
            isOnlyLoading
          >
            Claim
          </Button>
        </div>
      </div>
    </div>
  );
}
