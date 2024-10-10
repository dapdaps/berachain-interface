'use client';

import dynamic from 'next/dynamic';
import { FontClass } from '@/utils/classes';
import clsx from 'clsx';
import { memo } from 'react';
import Tab from '../components/tab';
import { MarketplaceContext, useMarketplaceContext } from '@/sections/marketplace/context';

const Lending = dynamic(() => import('@/sections/marketplace/components/dapps/lending'));

export default memo(function List() {
  const context = useMarketplaceContext({ chainId: 80084 });

  return (
    <MarketplaceContext.Provider value={context}>
      <div>
        <div className='w-[1200px] m-auto'>
          <div className={clsx(FontClass, 'text-[60px] text-center')}>
            Marketplace
          </div>
          <div className='mt-[50px]'>
            <Tab />
          </div>
        </div>
        <Lending />
      </div>
    </MarketplaceContext.Provider>
  );
});
