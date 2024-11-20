'use client';

import Drawer from '@/components/drawer';
import LazyImage from '@/components/layz-image';
import Button from '@/components/button';
import VoteConfirm from '@/sections/meme/bros/modals/vote/confirm';
import { useState } from 'react';

const VoteAction = (props: any) => {
  const { visible, onClose, record } = props;

  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleVote = () => {
    setConfirmVisible(true);
  };

  return (
    <>
      <Drawer
        visible={visible}
        onClose={onClose}
        size="60dvh"
      >
        <div className="bg-[#FFFDEB] px-[22px] pt-[16px] pb-[20px] rounded-tl-[20px] rounded-tr-[2px] h-full overflow-y-auto">
          <div className="flex justify-center items-center gap-[9px]">
            <LazyImage src={record?.icon} width={50} height={50} />
            <span className="font-CherryBomb text-black text-[20px] font-[600]">
            {record?.name}
          </span>
          </div>
          <div className="mt-[22px] flex justify-between gap-[6px]">
            <LazyImage src="/images/icon-tips.svg" width={20} height={20} className="shrink-0" />
            <div className="text-black text-[14px] font-[500] flex-1">
              Tokens you add as incentives will be distributed as rewards to users participating in the meme and cannot be withdrawn.
            </div>
          </div>
          <Button
            type="primary"
            className="mt-[16px] w-full h-[50px] leading-[48px] font-[700]"
          >
            Add Incentives
          </Button>
          <div className="mt-[22px] flex justify-between gap-[6px]">
            <LazyImage src="/images/icon-tips.svg" width={20} height={20} className="shrink-0" />
            <div className="text-black text-[14px] font-[500] flex-1">
              Each round can only vote for one MEME token once, after voting can not be changed.
            </div>
          </div>
          <Button
            type="primary"
            className="mt-[7px] w-full h-[50px] leading-[48px] font-[700]"
            onClick={handleVote}
          >
            Vote
          </Button>
        </div>
      </Drawer>
      <VoteConfirm
        visible={confirmVisible}
        onClose={() => {
          setConfirmVisible(false);
        }}
      />
    </>
  );
};

export default VoteAction;
