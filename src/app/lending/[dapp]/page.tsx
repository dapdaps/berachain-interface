'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import PageBack from '@/components/back';
import dynamic from 'next/dynamic';
import useTokenPrice from '@/hooks/use-token-price';
import { useEffect } from 'react';
import useClickTracking from '@/hooks/use-click-tracking';
import useIsMobile from '@/hooks/use-isMobile';

const Dolomite = dynamic(() => import('@/sections/Lending/Dolomite'));
const Bend = dynamic(() => import('@/sections/Lending/Bend'));

export default function LendingDAppPage() {
  const { dapp } = useParams();
  const { initializePrice } = useTokenPrice();
  const { handleReport } = useClickTracking();
  const isMobile = useIsMobile();

  useEffect(() => {
    switch (dapp) {
      case 'dolomite':
        handleReport('1012-002');
        break;
      case 'bend':
        handleReport('1012-003');
        break;
      default:
        break;
    }

    initializePrice();
  }, []);

  return (
    <BearBackground type='dapp'>
      <div className='p-[25px_35px]'>
        {
          !isMobile && (
            <PageBack />
          )
        }
        <div className=''>
          {dapp === 'dolomite' && <Dolomite />}
          {dapp === 'bend' && <Bend />}
        </div>
      </div>
    </BearBackground>
  );
}
