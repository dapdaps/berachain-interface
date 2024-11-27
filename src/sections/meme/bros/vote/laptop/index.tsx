import Title from "../../components/title";
import Materials from "../../components/materials";
import VoteTable from "@/sections/meme/bros/modals/vote/table";
import RoundLabel from "@/sections/meme/bros/components/round-label";
import { useMemo, useRef } from "react";
import useVote from "../../hooks/use-vote";
import useVoteData from "../../hooks/use-vote-data";
import useData from "../../hooks/use-data";
import { format } from "date-fns";
import numberOrder from "@/utils/number-order";

export default function Laptop({ onOpenModal }: any) {
  const tableRef = useRef<any>();
  const { currentRound } = useData();
  const { loading, voteAddress, onQuery } = useVoteData(currentRound?.round);
  const { loading: voting, onVote } = useVote(currentRound?.round, () => {
    onQuery();
  });

  const [title, subTitle] = useMemo(() => {
    const _st = `${format(
      currentRound.start_time * 1000,
      "MMM.dd, yyyy"
    )} - ${format(currentRound.end_time * 1000, "MMM.dd, yyyy")}`;
    return [`Round ${currentRound.round}`, _st];
  }, [currentRound]);

  return (
    <div className="relative w-full overflow-x-hidden relative">
      <Title onOpenModal={onOpenModal} />
      <div className="w-[916px] mt-[80px]  mx-auto relative z-[10] pb-[20px] min-h-[100px] bg-[#FFFDEB] border border-black rounded-[20px]">
        <RoundLabel
          title={title}
          subTitle={subTitle}
          className="!absolute top-[-53px] whitespace-nowrap left-[50%] translate-x-[-50%] w-[342px]"
        />
        <div className="flex pt-[30px] items-center px-[30px] gap-[12px] text-[20px] font-bold pb-[4px]">
          <span>Vote for the {numberOrder(currentRound.round)} round</span>

          {/* <VoteListMeme /> */}
        </div>
        <div className="px-[30px] font-semibold text-[14px] text-[#3D405A] pb-[4px]">
          Hold at least 0.1 $BGT to vote—no fees, just proof you’re real. One
          vote only—make it count!
        </div>
        <VoteTable
          ref={tableRef}
          userLoading={loading}
          voteAddress={voteAddress}
          voting={voting}
          onVote={onVote}
        />
      </div>

      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[240px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
    </div>
  );
}
