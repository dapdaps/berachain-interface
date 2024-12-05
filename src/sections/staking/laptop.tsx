'use client';

import BearBackground from '@/components/bear-background';
import DappIcon from '@/components/dapp-icon';
import Content from './Content';
import PageBack from '@/components/back';

export default function Liquidity({ dapp }: any) {
  return (
    <BearBackground type='dapp'>
      <PageBack className='absolute left-[36px] top-[31px]' />
      <div className='relative z-10 w-[970px] mx-[auto] pt-[110px]'>
        <Content dapp={dapp} />
        <DappIcon
          src={dapp?.icon}
          alt={dapp?.name}
          name={dapp?.name}
          type={dapp?.type || 'Staking'}
          className="z-10 top-[10px]"
        />
      </div>
    </BearBackground>
  );
}
