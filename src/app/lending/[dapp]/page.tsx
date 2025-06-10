'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import PageBack from '@/components/back';
import dynamic from 'next/dynamic';
import useTokenPrice from '@/hooks/use-token-price';
import { useEffect } from 'react';
import useClickTracking from '@/hooks/use-click-tracking';
import useIsMobile from '@/hooks/use-isMobile';
import DAppConfig from '@/configs/dapp';
import { DEFAULT_LENDING_DAPP } from '@/configs';

const LendingView = dynamic(() => import('@/sections/Lending'));

export default function LendingDAppPage() {
  const { dapp } = useParams();
  const { initializePrice } = useTokenPrice();
  const { handleReport } = useClickTracking();
  const isMobile = useIsMobile();
  const dApp = DAppConfig[dapp as string] || DAppConfig[DEFAULT_LENDING_DAPP];

  useEffect(() => {
    switch (dapp) {
      case 'dolomite':
        handleReport(isMobile ? '1017-002' : '1012-002');
        break;
      case 'bend':
        handleReport(isMobile ? '1017-003' : '1012-003');
        break;
      default:
        break;
    }

    initializePrice();
  }, [isMobile]);

  return (
    <BearBackground type='dapp'>
      <div className='p-[25px_35px] md:p-[20px_0]'>
        <PageBack className="md:absolute md:left-[12px] md:top-[17px]" />
        <div className=''>
          <LendingView dapp={dApp} />
        </div>
      </div>
    </BearBackground>
  );
}
