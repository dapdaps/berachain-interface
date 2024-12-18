import React, { useEffect, useState } from 'react';
import Tabs from '@/components/tabs';
import DepositPanel from './DepositPanel';
import SupplyBorrowPanel from './SupplyBorrowPanel';
import useBend from './hooks/useBend';

import useAccount from '@/hooks/use-account';

interface LendingModalProps {
  dapp?: any;
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
          className="whitespace-nowrap font-[700] text-[13px] md:max-w-[110px]"
          style={{ transform: currentTab === 'supplyBorrowHoney' ? 'translateX(-15px)' : 'translateX(-24px)' }}
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
    <div className="rounded-[20px] lg:w-[970px] md:w-full h-[490px]">
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
  );
};

export default LendingModal;