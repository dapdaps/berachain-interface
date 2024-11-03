'use client';

import BearBackground from '@/components/bear-background/';
import useIsMobile from '@/hooks/use-isMobile';
import EarnViews from '@/sections/earn';

export default function Dapps() {

  const isMobile = useIsMobile();

  if (!isMobile) {
    return null
  }

  return (
    <BearBackground type='dapps'>
      <EarnViews />
    </BearBackground>
  );
}
