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
    <div className="flex flex-col items-center">
      <BgtHead bgtData={data} />
      <BgtMain />
    </div>
  )
})
