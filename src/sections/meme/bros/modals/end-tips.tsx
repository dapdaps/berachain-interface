import Basic from "./basic";
import Button from "@/components/button";
import { useRouter } from "next-nprogress-bar";
import { useCallback, memo } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import useData from "../hooks/use-data";
import CardLabel from "../components/card-label";

export default memo(function EndTips({ open, onClose, onOpenModal }: any) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { currentRound, nextRound } = useData();
  const handleVote = useCallback(() => {
    if (isMobile) {
      router.push("/meme/bros/vote");
    } else {
      onOpenModal(6, nextRound);
    }
  }, [isMobile]);

  return (
    <Basic open={open} onClose={onClose}>
      <div className="flex flex-col items-center justify-center">
        <CardLabel
          title={`Round ${currentRound.round} Ended`}
          contentClassName="!bg-[#FF7C3B]"
          shadowClassName="!bg-[#924016]"
        />
        <div className="text-[20px] font-semibold mt-[16px]">
          Super meme bros. Round {currentRound.round} has ended!
        </div>
        <div className="text-[16px] font-semibold mt-[16px] text-center">
          View history to claim and unstake.
        </div>
        <Button
          type="primary"
          className="w-[215px] h-[50px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
          onClick={() => {
            router.push("/meme/bros/history");
          }}
        >
          View History
        </Button>
        {nextRound?.vote_status === "ongoing" && (
          <>
            <div className="text-[16px] font-semibold mt-[26px]">
              Get ready for the next round voting.
            </div>
            <Button
              type="primary"
              className="w-[215px] h-[50px] mt-[16px] text-[18px] font-semibold md:h-[46px]"
              onClick={handleVote}
            >
              Vote
            </Button>
          </>
        )}
      </div>
    </Basic>
  );
});
