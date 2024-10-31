'use client';

import Modal from '@/components/modal';
import Setting from '../../swap/Header/Setting';
import pools from '@/configs/pools';
import { useMemo } from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  dex: string;
  fee?: number;
  version?: string;
  onClearAll?: VoidFunction;
  open: boolean;
  hasClearAll?: boolean;
  onClose: VoidFunction;
};

export default function BasicModal({
  children,
  title,
  dex,
  fee,
  version,
  hasClearAll,
  onClearAll,
  open,
  onClose
}: Props) {
  const pool = useMemo(() => pools[dex?.toLowerCase()], [dex]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      closeIconClassName='top-[-10px] right-[-10px]'
    >
      <div className='px-[20px] w-[520px] bg-[#FFFDEB] rounded-[20px] border border-black md:w-full md:px-[12px]'>
        <div className='pt-[27px] pb-[10px] flex justify-between md:pt-[16px]'>
          <div className='flex items-center gap-[10px]'>
            <div className='text-[20px] font-bold'>{title}</div>
            {fee && (
              <div className='border border-[#373A53] bg-white px-[4px] py-[2px] rounded-[6px] text-[12px] text-[#3D405A]'>
                {fee / 1e4}%
              </div>
            )}
          </div>
          <div className='flex items-center gap-[10px]'>
            {hasClearAll && (
              <button
                className='text-[#FE6360] text-[14px] underline'
                onClick={onClearAll}
              >
                Clear all
              </button>
            )}
            <Setting />
          </div>
        </div>
        {pool && children}
        {pool && (
          <div className='text-center text-[14px] text-[#979ABE] w-full pb-[20px] md:hidden'>
            Manage exist assets on{' '}
            <a
              href={pool.officalSite}
              className='text-black underline cursor-pointer'
              target='_blank'
            >
              {pool.name}
            </a>
          </div>
        )}
      </div>
    </Modal>
  );
}
