import Modal from '@/components/Modal';
import Tabs from '@/components/tabs';
import React, { useState } from 'react';


interface LendingModalProps {
  open: boolean;
  onClose: () => void;
}

const LendingModal: React.FC<LendingModalProps> = ({ open, onClose }) => {
  const [currentTab, setCurrentTab] = useState<string>('balances');

  const tabs = [
    { key: 'balances', label: 'Balances', children: <div className='h-[490px]'>Balances Content</div> },
    { key: 'borrow', label: 'Borrow', children: <div className='h-[490px]'>Borrow Content</div> },
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