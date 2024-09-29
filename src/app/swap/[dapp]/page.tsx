'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import SwapView from '@/sections/swap';
import dapps from '@/configs/swap';
import { DEFAULT_SWAP_DAPP } from '@/configs';

export default function SwapPage() {
  const params = useParams();

  return (
    <BearBackground type='dapp'>
      <SwapView
        dapp={dapps[params.dapp as string] || dapps[DEFAULT_SWAP_DAPP]}
      />
    </BearBackground>
  );
}
