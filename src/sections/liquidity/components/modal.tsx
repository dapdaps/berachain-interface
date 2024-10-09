'use client';

import Modal from '@/components/modal';
import Setting from '../../swap/Header/Setting';
import pools from '@/configs/pools';
import { useMemo } from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  dex: string;
};

export default function BasicModal({ children, title, dex }: Props) {
  const pool = useMemo(() => pools[dex?.toLowerCase()], [dex]);
  return (
    <Modal
      open={true}
      onClose={() => {}}
      closeIconClassName='top-[-10px] right-[-10px]'
    >
      <div className='px-[20px] w-[520px] bg-[#FFFDEB] rounded-[20px] border border-black'>
        <div className='pt-[27px] pb-[10px] flex justify-between'>
          <div className='text-[20px] font-bold'>{title}</div>
          <Setting />
        </div>
        {pool && children}
        {pool && (
          <div className='text-center text-[14px] text-[#979ABE] w-full pb-[20px]'>
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
