import RoundLabel from "@/sections/meme/bros/components/round-label";
import VoteTable from "@/sections/meme/bros/modals/vote/table";
import Basic from "@/sections/meme/bros/modals/basic";
import VoteListMeme from "@/sections/meme/bros/modals/vote/list-meme";
import { useMemo, useRef } from "react";
import { format } from "date-fns";
import useVote from "../../hooks/use-vote";
import useVoteData from "../../hooks/use-vote-data";

const VoteLaptop = ({ open, data, onClose }: any) => {
  const tableRef = useRef<any>();
  const { loading, voteAddress, onQuery } = useVoteData(data?.round);
  const { loading: voting, onVote } = useVote(data?.round, () => {
    onQuery();
  });
  const [title, subTitle] = useMemo(() => {
    const _st = `${format(data.start_time * 1000, "MMM.dd, yyyy")} - ${format(
      data.end_time * 1000,
      "MMM.dd, yyyy"
    )}`;
    return [`Round ${data.round}`, _st];
  }, [data]);
  return (
    <Basic open={open} onClose={onClose} className="w-[916px]">
      <div className="flex items-center gap-[12px] text-[20px] font-bold mt-[16px] px-[13px]">
        <span>Vote for the next round</span>
      </div>
      <div className="flex items-center mt-[10px] pl-[13px] pr-[5px] gap-[24px]">
        <RoundLabel
          title={title}
          subTitle={subTitle}
          className="!absolute top-[-53px] whitespace-nowrap left-[50%] translate-x-[-50%] w-[342px]"
        />
        <span className="text-[16px] font-semibold">Voting has ended.</span>
        {/* <VoteListMeme /> */}
      </div>
      <div className="mt-[5px]">
        <VoteTable
          ref={tableRef}
          userLoading={loading}
          voteAddress={voteAddress}
          voting={voting}
          onVote={onVote}
        />
      </div>
    </Basic>
  );
};

export default VoteLaptop;
