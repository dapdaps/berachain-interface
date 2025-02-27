'use client';
import { formatThousandsSeparator, formatValueDecimal } from '@/utils/balance';
import Big from 'big.js';
import clsx from 'clsx';
import { memo } from 'react';
import CircleLoading from '@/components/circle-loading';
import { useIBGT } from '@/hooks/use-ibgt';
import Popover, { PopoverPlacement } from '@/components/popover';
import { useRouter } from 'next/navigation';
import IbgtHead from '@/sections/bgt/components/ibgt-head';
import Vaults from './vaults';
import PageBack from '@/components/back';
import IbgtMain from './main'

export default memo(function IBGTPageView() {
  const {
    data,
  } = useIBGT();
  return (
    <div className='flex flex-col items-center pt-[78px] pb-[30px]'>
      <IbgtHead ibgtData={data} />
      <PageBack className="absolute left-[36px] md:left-[15px] z-[12]" />
      <div className='relative z-10 w-[1200px]'>
        <div className='absolute left-[50%] top-[-96px] -translate-x-1/2 w-[1139px] h-[293px]  rounded-[1139px] bg-[radial-gradient(50%_50%_at_50%_50%,#FFDC50_0%,rgba(255,220,80,0.00)_100%)]' />
        <div className='relative p-[30px] bg-[#FFFDEB] rounded-[20px] border border-black shadow-[10px_10px_0_0_rgba(0,0,0,0.25)]'>
          <IbgtMain />
        </div>
      </div>
    </div>
  );
});
