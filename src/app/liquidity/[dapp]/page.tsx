'use client';

import BearBackground from '@/components/bear-background';
import { useParams } from 'next/navigation';
import LiquidityView from '@/sections/liquidity';
import dapps from '@/configs/liquidity';
import { DEFAULT_LIQUIDITY_DAPP } from '@/configs';
import PageBack from '@/components/back';

export default function LiquidityPage() {
  const params = useParams();
  console.log('======22222222=======')
  return (
    <BearBackground type='dapp'>
      <PageBack className="absolute left-[36px] top-[31px]" />
      <LiquidityView
        dapp={dapps[params.dapp as string] || dapps[DEFAULT_LIQUIDITY_DAPP]}
      />
    </BearBackground>
  );
}
