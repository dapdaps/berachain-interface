import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal';
import Tabs from '@/components/tabs';
import DepositPanel from './DepositPanel';
import SupplyBorrowPanel from './SupplyBorrowPanel';
import DappIcon from '@/components/dapp-icon';
import useBend from './hooks/useBend';
interface LendingModalProps {
  onClose?: () => void;
}

const LendingModal: React.FC<LendingModalProps> = () => {
  const [currentTab, setCurrentTab] = useState<string>('deposit');
  const { markets, init }= useBend()

  useEffect(() => {
    init()
  }, []);
  
  if (!markets) {
    return null;
  } 
  
  
  const tabs = [
    { 
      key: 'deposit', 
      label: 'Deposit', 
      children: (
        <DepositPanel markets={markets} />
      )
    },
    { 
      key: 'supplyBorrowHoney', 
      label: 'Supply & Borrow HONEY', 
      children: (
        <SupplyBorrowPanel />
      )
    },
  ];

  return (
    <div className="mt-[40px]">
      <div className="relative w-[970px] mx-auto">
      <DappIcon
        src="/images/dapps/bend.svg"
        alt=""
        name="Bend"
        type="Lending"
        style={{
          zIndex: 10,
          top: -70,
        }}
      />
      <div className="rounded-[20px] w-[970px] h-[490px]">
        <div className="absolute top-0 left-0 right-0">
          <Tabs
            currentTab={currentTab}
            tabs={tabs}
            onChange={(key) => setCurrentTab(key as string)}
            className="h-full"
          />
        </div>
      </div>
      </div>
    </div>
  );
};

export default LendingModal;