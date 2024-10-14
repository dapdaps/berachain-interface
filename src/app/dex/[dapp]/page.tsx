'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import SwitchTabs from '@/components/switch-tabs';
import SwapView from '@/sections/swap';
import PoolsView from '@/sections/pools';
import dapps from '@/configs/swap';
import { DEFAULT_SWAP_DAPP } from '@/configs';
import PageBack from '@/components/back';

export default function SwapPage() {
  const params = useParams();
  const dapp = dapps[params.dapp as string] || dapps[DEFAULT_SWAP_DAPP];
  const [tab, setTab] = useState('swap');
  return (
    <BearBackground type='dapp'>
      <div className='pt-[30px] flex flex-col items-center'>
        <PageBack className="absolute left-[36px] top-[31px]" />
        <SwitchTabs
          tabs={[
            { label: 'Swap', value: 'swap' },
            { label: 'Liquidity', value: 'liquidity' }
          ]}
          current={tab}
          onChange={setTab}
          className='w-[400px]'
        />
        {tab === 'swap' && <SwapView dapp={dapp} />}
        {tab === 'liquidity' && <PoolsView dapp={dapp} />}
      </div>
    </BearBackground>
  );
}
