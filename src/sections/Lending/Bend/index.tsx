import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal';
import Tabs from '@/components/tabs';
import DepositPanel from './DepositPanel';
import SupplyBorrowPanel from './SupplyBorrowPanel';
import DappIcon from '@/components/dapp-icon';
import useBend from './hooks/useBend';

import { DEFAULT_CHAIN_ID } from '@/configs';
import SwitchNetwork from '@/components/switch-network';
import chains from '@/configs/chains';
import useAccount from '@/hooks/use-account';

interface LendingModalProps {
  onClose?: () => void;
}

const LendingModal: React.FC<LendingModalProps> = () => {
  const [currentTab, setCurrentTab] = useState<string>('deposit');
  const { markets, init }= useBend()

  const { chainId, provider } = useAccount();

  useEffect(() => {
    init()
  }, [chainId, provider]);
  
  if (!markets) {
    return null;
  } 

  const tabs = [
    { 
      key: 'deposit', 
      label: (<span className="whitespace-nowrap font-[700] text-[13px]">Deposit</span>),
      children: (
        <DepositPanel markets={markets} />
      )
    },
    { 
      key: 'supplyBorrowHoney', 
      label: (
        <span
          className="whitespace-nowrap font-[700] text-[13px] overflow-hidden"
          style={{ transform: currentTab === 'supplyBorrowHoney' ? 'translateX(-15px)' : '' }}
        >
          Supply & Borrow HONEY
        </span>
      ),
      children: (
        <SupplyBorrowPanel />
      )
    },
  ];

  return (
    <div className="mt-[40px]">
      <div className="relative w-[970px] md:w-full mx-auto">
        <DappIcon
          src="/images/dapps/bend.svg"
          alt=""
          name="Bend"
          type="Lending"
          className="z-10 top-[-70px] md:left-[50%] md:translate-x-[-50%] md:top-[-40px]"
        />
        <div className="rounded-[20px] w-[970px] md:w-full h-[490px]">
          <div className="absolute top-0 left-0 right-0">
            <Tabs
              isCard
              currentTab={currentTab}
              tabs={tabs}
              onChange={(key) => setCurrentTab(key as string)}
              className="h-full"
            />
          </div>
        </div>
      </div>
      <SwitchNetwork targetChain={chains[DEFAULT_CHAIN_ID]} />
    </div>
  );
};

export default LendingModal;