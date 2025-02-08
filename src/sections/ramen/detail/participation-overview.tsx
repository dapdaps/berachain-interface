import clsx from "clsx";
import StepVertical from "@/sections/ramen/detail/components/step/vertical";
import { useMemo } from "react";
import useCustomAccount from "@/hooks/use-account";
import AuctionButton from "./auction-button";
import useClaim from "../hooks/use-claim";

const ParticipationOverview = (props: any) => {
  const { className, detail, auctionInfo, steps, isLaunched } = props;
  const { account } = useCustomAccount();
  const { loading, onClaim } = useClaim();
  const mergedSteps = useMemo(() => {
    if (!steps.length) return [];
    return steps.map((step: any, i: number) => {
      let value = "";
      let status: any = "";
      if (i === 0) {
        value = !account
          ? "Wallet is not Connected"
          : auctionInfo?.userBids.length
          ? "Bid Submitted"
          : "No Bid Submitted";
        status = !account ? "Wallet is not Connected" : `Spend Amount: -`;
      }
      if (i === 1) {
        value = isLaunched ? "Bids Decrypted" : "Coming Soon";
        status = !account ? "Wallet is not Connected" : "";
      }
      if (i === 2) {
        value = isLaunched ? "No Allocation Won" : "Coming Soon";
        status = !account ? (
          "Wallet is not Connected"
        ) : (
          <div className="flex flex-col items-end gap-[4px] text-[#3D405A] text-[12px] font-Montserrat font-[500] leading-[100%]">
            <div className="">Final Token Price: -</div>
            <div className="">Total Cost: -</div>
          </div>
        );
      }
      return { ...step, value, status };
    });
  }, [steps, isLaunched, auctionInfo, account]);

  return (
    <div className={clsx("mt-[22px]", className)}>
      <StepVertical className="" list={mergedSteps} />
      {isLaunched && (
        <div className="border border-[rgba(0,_0,_0,_0.10)] rounded-[10px] p-[19px_15px_12px] flex flex-col items-stretch gap-[15px] mt-[23px]">
          <div className="text-[14px] text-black font-[600] leading-[90%] font-Montserrat flex justify-between items-center">
            <div className="">Claimable from Auction</div>
            <div className="text-[1.14em]">0 {detail.token_symbol}</div>
          </div>
          <AuctionButton
            loading={loading}
            errorTips=""
            disabled={true}
            onClick={() => {
              onClaim();
            }}
            text="Claim"
          />
        </div>
      )}
    </div>
  );
};

export default ParticipationOverview;
