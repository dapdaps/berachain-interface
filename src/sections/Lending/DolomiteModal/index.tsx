import React, { useState } from 'react';
import Modal from '@/components/Modal';
import Tabs from '@/components/tabs';
import Panel from './Panel';

interface LendingModalProps {
  open: boolean;
  onClose: () => void;
}

const LendingModal: React.FC<LendingModalProps> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState<string>('supply');

  const supplyTokens = [
    { symbol: 'BERA', name: 'Berachain token', icon: '', apr: '78.15', balance: '120.23', walletBalance: '0.00' },
    { symbol: 'ETH', name: 'Ethereum', icon: '', apr: '0.00', balance: '0.00', walletBalance: '1.23' },
    { symbol: 'HONEY', name: 'Honey Stablecoin', icon: '', apr: '78.20', balance: '0.00', walletBalance: '0.00' },
    { symbol: 'USDC', name: 'USD coin', icon: '', apr: '78.50', balance: '120.34', walletBalance: '0.00' },
    { symbol: 'WBERA', name: 'Wrapped Bera', icon: '', apr: '78.15', balance: '0.00', walletBalance: '0.00' },
  ];

  const borrowTokens = [
    { symbol: 'BERA', name: 'Berachain token', icon: '', apr: '2.15', balance: '50.00', walletBalance: '0.00' },
    { symbol: 'ETH', name: 'Ethereum', icon: '', apr: '3.50', balance: '0.50', walletBalance: '0.00' },
    { symbol: 'USDC', name: 'USD coin', icon: '', apr: '1.50', balance: '100.00', walletBalance: '0.00' },
  ];

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

  const tabs = [
    { 
      key: 'supply', 
      label: 'Supply', 
      children: (
        <Panel
          totalBalance="240.57"
          totalRate="5.23"
          rateName="Earning APR"
          tokens={supplyTokens}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
        />
      )
    },
    { 
      key: 'borrow', 
      label: 'Borrow', 
      children: (
        <Panel
          totalBalance="150.50"
          totalRate="2.38"
          rateName="Borrow APR"
          tokens={borrowTokens}
          onDeposit={handleBorrow}
          onWithdraw={handleRepay}
        />
      )
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
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