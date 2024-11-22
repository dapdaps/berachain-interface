import RoundLabel from "@/sections/meme/bros/components/round-label";
import VoteTable from "@/sections/meme/bros/modals/vote/table";
import Basic from "@/sections/meme/bros/modals/basic";
import VoteListMeme from "@/sections/meme/bros/modals/vote/list-meme";

const VoteLaptop = ({ open, onClose }: any) => {
  return (
    <Basic open={open} onClose={onClose} className="w-[916px]">
      <div className="flex items-center gap-[12px] text-[20px] font-bold mt-[16px] px-[13px]">
        <span>Vote for the next round</span>
      </div>
      <div className="flex justify-between items-center mt-[10px] pl-[13px] pr-[5px]">
        <RoundLabel
          title="Round 4"
          subTitle="Dec.18, 2024 - Jan.01, 2025"
          className="w-[342px]"
        />
        {/* <VoteListMeme /> */}
      </div>
      <div className="mt-[5px]">
        <VoteTable />
      </div>
    </Basic>
  );
};

export default VoteLaptop;
