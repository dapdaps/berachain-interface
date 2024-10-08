'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import PageBack from '@/components/back';
import dynamic from 'next/dynamic';
import useTokenPrice from '@/hooks/use-token-price';
import { useEffect } from 'react';

const Dolomite = dynamic((() => import('@/sections/Lending/Dolomite')));
const Bend = dynamic((() => import('@/sections/Lending/Bend')));

export default function LendingDAppPage() {
  const { dapp } = useParams();
  const { initializePrice } = useTokenPrice();

  useEffect(() => {
    initializePrice();
  }, []);
  return (
    <BearBackground type='dapp'>
      <div className="p-[25px_35px]">
        <PageBack />
        <div className="">
          {
            dapp === 'dolomite' && (
              <Dolomite />
            )
          }
          {
            dapp === 'bend' && (
              <Bend />
            )
          }
        </div>
      </div>
    </BearBackground>
  );
}
