'use client';

import DappIcon from '@/components/dapp-icon';
import SwitchNetwork from '@/components/switch-network';
import chains from '@/configs/chains';
import { DEFAULT_CHAIN_ID } from '@/configs';
import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import lendings from '@/configs/lending';
import Link from 'next/link';
import LazyImage from '@/components/layz-image';
import { motion } from 'framer-motion';

const Dolomite = dynamic(() => import('@/sections/Lending/Dolomite'));
const Bend = dynamic(() => import('@/sections/Lending/Bend'));
const Beraborrow = dynamic(() => import('@/sections/Lending/Beraborrow'));

const LendingView = (props: Props) => {
  const { dapp } = props;

  if (!dapp) return null;

  const { type, config } = dapp || {};

  const otherLendings = useMemo(() => {
    return Object.values(lendings).filter((lend) => lend.basic?.path !== config?.basic?.path);
  }, [config, lendings]);

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
        <div className="absolute left-[-62px] top-[100px] z-[1] flex flex-col gap-[14px]">
          {
            otherLendings?.map((lend: any, idx: number) => (
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: -20 }}
              >
                <Link
                  key={idx}
                  prefetch={true}
                  href={lend.basic?.path}
                  replace={true}
                  className="flex items-center w-[178px] h-[71px] shrink-0 rounded-[20px] border border-black bg-[#9ACA3B] shadow-[inset_0px_10px_0px_0px_#B2E946] p-[14px]"
                >
                  <LazyImage
                    width={43}
                    height={43}
                    src={lend.basic?.icon}
                    containerClassName="shrink-0"
                  />
                </Link>
              </motion.div>
            ))
          }
        </div>
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