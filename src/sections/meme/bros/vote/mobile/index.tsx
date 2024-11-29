"use client";

import VoteTable from "@/sections/meme/bros/modals/vote/table";
import RoundLabel from "@/sections/meme/bros/components/card-label";
import { useRef, useState } from "react";
import VoteAction from "@/sections/meme/bros/modals/vote/action";
import PageBack from "@/components/back";
import Materials from "../../components/materials";
import Title from "../../components/title";
import useVote from "../../hooks/use-vote";
import useVoteData from "../../hooks/use-vote-data";
import numberOrder from "@/utils/number-order";

const VoteMobile = ({ onOpenModal, round }: any) => {
  const tableRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<any>();
  const { loading, voteAddress, onQuery } = useVoteData(round?.round);
  const { loading: voting, onVote } = useVote(round?.round, () => {
    onQuery();
  });

  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      {round.round === 1 ? (
        <Title onOpenModal={onOpenModal} />
      ) : (
        <div className="text-[24px] font-CherryBomb text-center">
          Vote for the {numberOrder(round.round)} round
        </div>
      )}
      <div className="absolute left-[18px] top-[20px]">
        <PageBack />
      </div>

      <div className="relative z-[10] border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 mt-[60px] pt-[50px] pb-[20px] mx-[14px]">
        <RoundLabel
          round={round}
          titleClassName="!pl-[16px]"
          subTitleClassName="!pl-[16px]"
          className="!absolute top-[-34px] left-[13px] w-[calc(100%-26px)] whitespace-nowrap"
        />
        <VoteTable
          ref={tableRef}
          userLoading={loading}
          voteAddress={voteAddress}
          voting={voting}
          onRow={(_record: any) => {
            setRecord(_record);
            setVisible(true);
          }}
          round={round}
        />
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[200px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
      <VoteAction
        record={record}
        visible={visible}
        onVote={onVote}
        onClose={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default VoteMobile;
