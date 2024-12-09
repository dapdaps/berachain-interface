"use client";

import Basic from "../basic";
import Button from "@/components/button";
const VoteAction = (props: any) => {
  const { visible, onClose, record, onVote } = props;

  return (
    <Basic open={visible} onClose={onClose}>
      <div className="bg-[#FFFDEB] px-[22px] pt-[16px] pb-[20px] rounded-tl-[20px] rounded-tr-[20px] h-full overflow-y-auto">
        <div className="flex justify-center items-center gap-[9px]">
          <img src={record?.icon} className="w-[50px] h-[50px]" />
          <span className="font-CherryBomb text-black text-[20px] font-[600]">
            {record?.name}
          </span>
        </div>
        <div className="mt-[22px] flex justify-between gap-[6px]">
          <img
            src="/images/icon-tips.svg"
            className="shrink-0 w-[20px] h-[20px]"
          />
          <div className="text-black text-[14px] font-[500] flex-1">
            Each round can only vote for one MEME token once, after voting can
            not be changed.
          </div>
        </div>
        <Button
          type="primary"
          className="mt-[7px] w-full h-[50px] leading-[48px] font-[700]"
          onClick={() => {
            onVote(record.token_address);
          }}
        >
          Vote
        </Button>
      </div>
    </Basic>
  );
};

export default VoteAction;
