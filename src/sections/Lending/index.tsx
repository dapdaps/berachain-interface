'use client';

import DappIcon from '@/components/dapp-icon';
import SwitchNetwork from '@/components/switch-network';
import chains from '@/configs/chains';
import { DEFAULT_CHAIN_ID } from '@/configs';
import React from 'react';
import dynamic from 'next/dynamic';

const Dolomite = dynamic(() => import('@/sections/Lending/Dolomite'));
const Bend = dynamic(() => import('@/sections/Lending/Bend'));
const Beraborrow = dynamic(() => import('@/sections/Lending/Beraborrow'));

const LendingView = (props: Props) => {
  const { dapp } = props;

  if (!dapp) return null;

  const { type, config } = dapp || {};

  return (
    <div className="mt-[40px]">
      <div className="relative w-[970px] md:w-full mx-auto">
        <DappIcon
          src={config?.basic?.icon}
          alt=""
          name={config?.basic?.name}
          type={type}
          className="z-10 top-[-70px] md:left-[50%] md:translate-x-[-50%] md:top-[-40px]"
        />
        {config?.basic?.name === 'Dolomite' && <Dolomite {...props} />}
        {config?.basic?.name === 'Bend' && <Bend {...props} />}
        {config?.basic?.name === 'Beraborrow' && <Beraborrow {...props} />}
      </div>
      <SwitchNetwork targetChain={chains[DEFAULT_CHAIN_ID]} />
    </div>
  );
}

export default LendingView;

interface Props {
  dapp?: any;
}