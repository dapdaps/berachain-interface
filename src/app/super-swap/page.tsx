'use client';

import BearBackground from '@/components/bear-background';
import BridgeView from '@/sections/bridge';

export default function SuperSwap() {
  return (
    <BearBackground type='bridge'>
      <BridgeView type='super-swap' defaultFromChain={80094} defaultToChain={80094} defaultFromToken='BERA' defaultToToken='HONEY' />
    </BearBackground>
  );
}
