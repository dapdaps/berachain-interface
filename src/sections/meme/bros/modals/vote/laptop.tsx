import RoundLabel from "@/sections/meme/bros/components/round-label";
import VoteTable from "@/sections/meme/bros/modals/vote/table";
import Basic from "@/sections/meme/bros/modals/basic";
import VoteListMeme from "@/sections/meme/bros/modals/vote/list-meme";
import { useRef } from "react";
import useVote from "../../hooks/use-vote";
import useVoteData from "../../hooks/use-vote-data";

const VoteLaptop = ({ open, data, onClose }: any) => {
  const tableRef = useRef<any>();
  const { loading, voteAddress, onQuery } = useVoteData(data?.round);
  const { loading: voting, onVote } = useVote(data?.round, () => {
    onQuery();
  });

  return (
    <Basic open={open} onClose={onClose} className="w-[916px]">
      <div className="text-[20px] font-bold md:mt-[16px] px-[13px]">
        <div>Vote for the next round</div>
        <div className="text-[14px] font-semibold text-[#3D405A] mt-[6px]">
          Hold at least 0.1 $BGT to vote—no fees, just proof you’re real. One
          vote only—make it count!
        </div>
      </div>
      <div className="flex items-center mt-[10px] pl-[13px] pr-[5px] gap-[24px]">
        <RoundLabel
          round={data}
          className="md:!absolute md:top-[-53px] whitespace-nowrap md:left-[50%] md:translate-x-[-50%] w-[342px]"
        />
        {data.status === "ended" && (
          <span className="text-[16px] font-semibold">Voting has ended.</span>
        )}
        {/* <VoteListMeme /> */}
      </div>
      <div className="mt-[5px]">
        <VoteTable
          ref={tableRef}
          userLoading={loading}
          voteAddress={voteAddress}
          voting={voting}
          onVote={onVote}
          round={data}
        />
      </div>
    </Basic>
  );
};

export default VoteLaptop;
