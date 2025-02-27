"use client";

import PageBack from '@/components/back';
import { useBGT } from "@/hooks/use-bgt";
import BgtHead from '@/sections/bgt/components/bgt-head';
import { memo } from "react";
import BgtMain from './main';

export default memo(function BGTPageView() {
  
  const {
    data,
  } = useBGT();
  return (
    <div className="flex flex-col items-center pt-[75px]">
      <BgtHead bgtData={data} />
      <PageBack className="absolute left-[36px] md:left-[15px] z-[12]" />
      <div className="w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <BgtMain />
      </div>
    </div>
  )
})
