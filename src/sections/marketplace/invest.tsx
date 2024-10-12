'use client';

import dynamic from 'next/dynamic';
import List from './list';
import Tab from './components/tab';
import InvestList from './components/lnvest';
import {
  MarketplaceContext,
  useMarketplaceContext
} from '@/sections/marketplace/context';

const Staking = dynamic(
  () => import('@/sections/marketplace/components/dapps/staking')
);
const Lending = dynamic(
  () => import('@/sections/marketplace/components/dapps/lending')
);
const Vaults = dynamic(
  () => import('@/sections/marketplace/components/dapps/vaults')
);

export default function Invest() {
  const context = useMarketplaceContext({ chainId: 80084 });
  return (
    <MarketplaceContext.Provider value={context}>
      <List>
        <Tab index={2}>
          <InvestList />
        </Tab>
      </List>
      <Lending />
      <Staking />
      <Vaults />
    </MarketplaceContext.Provider>
  );
}
