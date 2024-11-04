'use client';

import BearBackground from '@/components/bear-background';
import BridgeView from '@/sections/bridge';

export default function Bridge() {
  return (
    <BearBackground type='bridge' showGrassland>
      <BridgeView />
    </BearBackground>
  );
}
