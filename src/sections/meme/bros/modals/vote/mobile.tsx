'use client';

import VoteTable from '@/sections/meme/bros/modals/vote/table';
import RoundLabel from '@/sections/meme/bros/components/round-label';
import VoteListMeme from '@/sections/meme/bros/modals/vote/list-meme';
import { useRef, useState } from 'react';
import VoteAction from '@/sections/meme/bros/modals/vote/action';

const VoteMobile = (props: any) => {
  const {} = props;

  const tableRef = useRef<any>();
  const [visible, setVisible] = useState(false);
  const [record, setRecord] = useState<any>();

  return (
    <div
      className="w-full h-dvh overflow-y-auto px-[15px] pt-[150px] pb-[64px]"
      onScroll={(e: any) => {
        const offset = 64;
        if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop - offset <= e.currentTarget.clientHeight) {
          tableRef.current?.nextPage?.();
        }
      }}
    >
      <div
        className="relative border border-black rounded-[20px] bg-[#FFFDEB] shadow-shadow1 px-[7px] pb-[20px]"
      >
        <div className="px-[8px] absolute top-[-53px]">
          <RoundLabel
            title="Round 1"
            subTitle="Dec.18, 2024 - Jan.01, 2025"
            className="w-[100%!important] whitespace-nowrap"
          />
        </div>
        <div className="flex items-center justify-center gap-[12px] text-[20px] font-bold pt-[34px] pb-[16px]">
          <span>Vote for the next round</span>
        </div>
        <div className="px-[13px]">
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
