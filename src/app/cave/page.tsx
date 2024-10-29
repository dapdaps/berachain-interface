'use client';

import BearBackground from '@/components/bear-background/laptop';
import Cave from '@/sections/cave';
import { useEffect } from 'react';

export default function Dapps() {
  useEffect(() => {
    const layoutDom = document.getElementById('layout');
    layoutDom?.classList.add('cave-bg');

    return () => {
      layoutDom?.classList.remove('cave-bg');
    };
  }, []);

  return (
    <BearBackground type='cave'>
      <Cave />
    </BearBackground>
  );
}
