'use client';

import SwapView from '@/sections/swap';
import { useParams } from 'next/navigation';
import dapps from '@/configs/swap';
import { DEFAULT_SWAP_DAPP } from '@/configs';
import useClickTracking from '@/hooks/use-click-tracking';
import { useEffect } from 'react';

export default function SwapPage() {
  const urlParams = useParams();
  const { handleReport } = useClickTracking();

  const dapp = dapps[urlParams.dapp as string] || dapps[DEFAULT_SWAP_DAPP];

  useEffect(() => {
    switch (urlParams.dapp) {
      case 'kodiak':
        handleReport('1012-004');
        break;
      case 'bex':
        handleReport('1012-005');
        break;
      case 'ooga-booga':
        handleReport('1012-006');
        break;
      default:
        break;
    }
  }, []);

  return <SwapView dapp={dapp} />;
}
