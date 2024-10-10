'use client';
import DappIcon from '@/components/dapp-icon';
import Content from './Content';

export default function Liquidity({ dapp }: any) {
  return (
    <div className='relative w-[970px] mx-[auto] pt-[110px]'>
      <Content dapp={dapp} />
      <DappIcon src={dapp?.icon} alt={dapp?.name} name={dapp?.name} type='liquidity' />
    </div>
  );
}
