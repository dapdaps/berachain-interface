'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import SwapView from '@/sections/swap';
import dapps from '@/configs/swap';
import clsx from 'clsx';
import { DEFAULT_SWAP_DAPP } from '@/configs';
import { useState } from 'react';

export default function SwapPage() {
  const params = useParams();
  const dapp = dapps[params.dapp as string] || dapps[DEFAULT_SWAP_DAPP];
  const [tab, setTab] = useState('Swap');
  return (
    <BearBackground type='dapp'>
      <div className='pt-[36px] flex flex-col items-center'>
        <div className='mb-[17px] flex items-center h-[56px] rounded-[12px] border border-[#373A53] bg-white p-[5px] w-[400px]'>
          {['Swap', 'Liquidity'].map((item, index) => (
            <div
              className={clsx([
                'flex items-center justify-center border border-transparent rounded-[10px] flex-1 cursor-pointer',
                item === tab ? 'h-full  !border-black bg-[#FFDC50]' : ''
              ])}
              key={item}
              onClick={() => {
                setTab(item);
              }}
            >
              <span className='text-black font-Montserrat text-[18px] font-semibold leading-[90%]'>
                {item}
              </span>
            </div>
          ))}
        </div>
        {tab === 'Swap' && <SwapView dapp={dapp} />}
      </div>
    </BearBackground>
  );
}
