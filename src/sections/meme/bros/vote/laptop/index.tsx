import Title from "../../components/title";
import Materials from "../../components/materials";
import VoteTable from "@/sections/meme/bros/modals/vote/table";
import RoundLabel from "@/sections/meme/bros/components/round-label";
import VoteListMeme from "@/sections/meme/bros/modals/vote/list-meme";
import { useRef, useState } from "react";
import VoteAction from "@/sections/meme/bros/modals/vote/action";

export default function Laptop() {
  const tableRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<any>();
  return (
    <div className="relative w-full overflow-x-hidden relative">
      <Title />
      <div className="w-[916px] mt-[80px]  mx-auto relative z-[10] pb-[20px] min-h-[100px] bg-[#FFFDEB] border border-black rounded-[20px]">
        <RoundLabel
          title="Round 1"
          subTitle="Dec.18, 2024 - Jan.01, 2025"
          className="!absolute top-[-53px] whitespace-nowrap left-[50%] translate-x-[-50%] w-[342px]"
        />
        <div className="flex pt-[30px] items-center justify-between px-[30px] gap-[12px] text-[20px] font-bold pb-[16px]">
          <span>Vote for the next round</span>
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
        <div className="relative z-[5] w-full h-[240px] bg-[url(/images/meme/ground.png)] bg-contain" />
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
}
