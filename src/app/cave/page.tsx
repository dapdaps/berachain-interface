'use client';

import BearBackground from '@/components/bear-background';
import useIsMobile from '@/hooks/use-isMobile';
import Cave from '@/sections/cave';
import CaveMobile from '@/sections/cave/mobile';
import { useEffect } from 'react';

export default function Dapps() {
  const isMobile = useIsMobile();

  useEffect(() => {
    const layoutDom = document.getElementById('layout');
    layoutDom?.classList.add('cave-bg');

    return () => {
      layoutDom?.classList.remove('cave-bg');
    };
  }, []);

  return (
    <BearBackground type='cave'>
      {
        isMobile ? <CaveMobile /> : <Cave />
      }
    </BearBackground>
  );
}
