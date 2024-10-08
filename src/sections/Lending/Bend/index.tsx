import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal';
import Tabs from '@/components/tabs';
import DepositPanel from './DepositPanel';
import SupplyBorrowPanel from './SupplyBorrowPanel';
import bendConfig from '@/configs/lending/dapps/bend'
import { useAccount, useBalance } from 'wagmi';
import useAaveConfigStore from '@/stores/useAaveConfigStore';
import DappIcon from '@/components/dapp-icon';
import useBend from './useBend';
interface LendingModalProps {
  onClose?: () => void;
}

const LendingModal: React.FC<LendingModalProps> = () => {
  const [currentTab, setCurrentTab] = useState<string>('deposit');
  const { markets, userAccountData }= useBend()

  const handleDeposit = (symbol: string) => {
    console.log(`Depositing ${symbol}`);
    // Implement deposit logic
  };

  const handleWithdraw = (symbol: string) => {
    console.log(`Withdrawing ${symbol}`);
    // Implement withdraw logic
  };

  const handleBorrow = (symbol: string) => {
    console.log(`Borrowing ${symbol}`);
    // Implement borrow logic
  };

  const handleRepay = (symbol: string) => {
    console.log(`Repaying ${symbol}`);
    // Implement repay logic
  };

  if (!markets) {
    return null;
  } 

  const tabs = [
    { 
      key: 'deposit', 
      label: 'Deposit', 
      children: (
        <DepositPanel markets={markets} userAccountData={userAccountData} />
      )
    },
    { 
      key: 'supplyBorrowHoney', 
      label: 'Supply & Borrow HONEY', 
      children: (
        <SupplyBorrowPanel markets={markets} />
      )
    },
  ];

  return (
    <Modal open={true}>
      <DappIcon
        src="/images/dapps/dolomite.svg"
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
    </Modal>
  );
};

export default LendingModal;