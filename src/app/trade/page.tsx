'use client';

import BearBackground from '@/components/bear-background';
import BridgeView from '@/sections/bridge';
import { useSearchParams } from 'next/navigation';

export default function Bridge() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  return (
    <BearBackground type='trade'>
      <BridgeView showRoute={true} type={type || 'bridge'} />
    </BearBackground>
  );
}
