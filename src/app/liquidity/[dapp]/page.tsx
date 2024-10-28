'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import LiquidityView from '@/sections/liquidity';
import dapps from '@/configs/liquidity';
import { DEFAULT_LIQUIDITY_DAPP } from '@/configs';
import PageBack from '@/components/back';
import { useEffect } from 'react';
import useClickTracking from '@/hooks/use-click-tracking';

export default function LiquidityPage() {
  const params = useParams();
  const { handleReport } = useClickTracking();

  useEffect(() => {
    switch (params.dapp) {
      case 'infrared':
        handleReport('1003-001');
        break;
      default:
        break;
    }
  }, []);

  return (
    <BearBackground type='dapp'>
      <PageBack className="absolute left-[36px] top-[31px]" />
      <LiquidityView
        dapp={dapps[params.dapp as string] || dapps[DEFAULT_LIQUIDITY_DAPP]}
      />
    </BearBackground>
  );
}
