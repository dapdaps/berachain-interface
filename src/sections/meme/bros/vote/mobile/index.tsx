"use client";

import VoteTable from "@/sections/meme/bros/modals/vote/table";
import RoundLabel from "@/sections/meme/bros/components/round-label";
import VoteListMeme from "@/sections/meme/bros/modals/vote/list-meme";
import { useRef, useState } from "react";
import VoteAction from "@/sections/meme/bros/modals/vote/action";
import PageBack from "@/components/back";
import Materials from "../../components/materials";
import Title from "../../components/title";

const VoteMobile = (props: any) => {
  const {} = props;

  const tableRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<any>();

  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      {true ? (
        <Title />
      ) : (
        <div className="text-[24px] font-CherryBomb text-center">
          Vote for the 4th round
        </div>
      )}
      <div className="absolute left-[18px] top-[20px]">
        <PageBack />
      </div>

      <div className="relative z-[10] border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 mt-[60px] pt-[50px] pb-[20px] mx-[14px]">
        <RoundLabel
          title="Round 1"
          subTitle="Dec.18, 2024 - Jan.01, 2025"
          className="!absolute top-[-34px] left-[13px] w-[calc(100%-26px)] whitespace-nowrap"
        />
        <div className="px-[12px]">
          <VoteListMeme />
        </div>
        <VoteTable
          ref={tableRef}
          onRow={(_record: any) => {
            setRecord(_record);
            setVisible(true);
          }}
        />
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[200px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
      <VoteAction
        record={record}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default VoteMobile;
