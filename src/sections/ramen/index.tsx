'use client';

import DappIcon from '@/components/dapp-icon';
import React, { useState } from 'react';
import Tabs from '@/components/tabs';
import Content from '@/sections/ramen/content';

export default function RamenList() {
  const [currentTab, setCurrentTab] = useState<string>('current');

  return (
    <div className="mt-[40px]">
      <div className="relative w-[970px] md:w-full mx-auto">
        <DappIcon
          src="/images/dapps/red-ramen-logo.svg"
          alt=""
          name="Ramen"
          type="launchpad"
          className="z-10 top-[-70px] md:left-[50%] md:translate-x-[-50%] md:top-[-40px]"
        />
        <Tabs
          isCard
          currentTab={currentTab}
          tabs={[
            {
              key: 'current',
              label: 'Launches',
              children: (
                <Content />
              )
            },
          ]}
          onChange={(key) => setCurrentTab(key as string)}
          className="h-full md:pt-[20px]"
        />
      </div>
    </div>
  );
}
