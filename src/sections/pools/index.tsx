import { useState } from 'react';
import DappIcon from '@/components/dapp-icon';
import Tabs from '@/components/tabs';
import PoolsC from './pools';
import YoursC from './yours';

export default function Pools({ dapp }: any) {
  const [currentTab, setCurrentTab] = useState('liquidity');
  return (
    <div className='relative w-[990px] pt-[30px]'>
      <Tabs
        currentTab={currentTab}
        tabs={[
          {
            key: 'liquidity',
            label: <div className='text-[18px] font-bold'>Liquidity</div>,
            children: <PoolsC dex={dapp.name} />
          },
          {
            key: 'yours',
            label: <div className='text-[18px] font-bold'>Yours</div>,
            children: <YoursC dex={dapp.name} />
          }
        ]}
        onChange={(tabKey: any) => {
          setCurrentTab(tabKey);
        }}
      />
      <DappIcon
        src={dapp.icon}
        alt={dapp.name}
        name={dapp.name}
        type='swap'
        style={{ top: -76 }}
      />
    </div>
  );
}
