import clsx from "clsx";
import StepVertical from "@/sections/ramen/detail/components/step/vertical";
import { useMemo } from "react";
import { numberFormatter } from "@/utils/number-formatter";

const ParticipationOverview = (props: any) => {
  const { className, detail, auctionInfo, steps, isLaunched } = props;

  const mergedSteps = useMemo(() => {
    if (!steps.length) return [];
    return steps.map((step: any, i: number) => {
      let value = "";
      let status: any = "";
      if (i === 0) {
        value = auctionInfo?.userBids.length
          ? "Bid Submitted"
          : "No Bid Submitted";
        status = `Spend Amount: -`;
      }
      if (i === 1) {
        value = isLaunched ? "Bids Decrypted" : "Coming Soon";
        status = "";
      }
      if (i === 2) {
        value = isLaunched ? "No Allocation Won" : "Coming Soon";
        status = (
          <div className="flex flex-col items-end gap-[4px] text-[#3D405A] text-[12px] font-Montserrat font-[500] leading-[100%]">
            <div className="">Final Token Price: -</div>
            <div className="">Total Cost: -</div>
          </div>
        );
      }
      return { ...step, value, status };
    });
  }, [steps, isLaunched, auctionInfo]);

  return (
    <div className={clsx("mt-[22px]", className)}>
      <StepVertical className="" list={mergedSteps} />
      <div className="border border-[rgba(0,_0,_0,_0.10)] rounded-[10px] p-[19px_15px_12px] flex flex-col items-stretch gap-[15px] mt-[23px]">
        <div className="text-[14px] text-black font-[600] leading-[90%] font-Montserrat flex justify-between items-center">
          <div className="">Claimable from Auction</div>
          <div className="text-[1.14em]">0 BOWL</div>
        </div>
        <button
          type="button"
          className="w-full h-[46px] flex justify-center items-center rounded-[10px] border border-black bg-[#FFDC50]"
        >
          No Claimable Token
        </button>
      </div>
    </div>
  );
};

export default ParticipationOverview;
