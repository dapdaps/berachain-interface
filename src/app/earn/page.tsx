'use client';

import BearBackground from '@/components/bear-background/';
import useIsMobile from '@/hooks/use-isMobile';
import EarnViews from '@/sections/earn';
import EarnLapTop from '@/sections/earn/laptop';

export default function Dapps() {

  const isMobile = useIsMobile();

  if (!isMobile) {
    return <EarnLapTop />
  }

  return (
    <BearBackground type='dapps'>
       <EarnViews />
    </BearBackground>
  );
}
