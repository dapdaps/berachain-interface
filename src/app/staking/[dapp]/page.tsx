'use client';

import { useParams } from 'next/navigation';
import StakingView from '@/sections/staking';
import dapps from '@/configs/staking';
import { DEFAULT_LIQUIDITY_DAPP } from '@/configs';
import { useEffect } from 'react';
import useClickTracking from '@/hooks/use-click-tracking';

export default function LiquidityPage() {
  const params = useParams();
  const { handleReport } = useClickTracking();

  useEffect(() => {
    switch (params.dapp) {
      case 'infrared':
        handleReport('1012-001');
        break;
      case 'berps':
        // handleReport(isMobile ? '1017-001' : '1012-001');
        break;
      default:
        break;
    }
  }, []);

  return (
    <StakingView
      dapp={dapps[params.dapp as string] || dapps[DEFAULT_LIQUIDITY_DAPP]}
    />
  );
}
