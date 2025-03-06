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
    <div className='flex flex-col items-center'>
      <IbgtHead ibgtData={data} />
      <IbgtMain />
    </div>
  );
});
