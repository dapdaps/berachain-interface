import Drawer from '@/components/drawer';
import SwitchTabs from '@/components/switch-tabs';
import { useState } from 'react';

const BGTMobileView = (props: Props) => {
  const { visible, onClose } = props;

  const [tab, setTab] = useState('market');

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
    >
      <div className="h-full">
        <div className="pt-[50px] px-[12px]">
          <SwitchTabs
            tabs={[
              { label: 'BGT Market', value: 'market' },
              { label: 'Your Vaults', value: 'vaults' }
            ]}
            onChange={(val) => {
              setTab(val);
            }}
            current={tab}
            className="md:h-[52px] rounded-[12px] bg-[#DFDCC4] border-0"
            cursorClassName="rounded-[10px]"
          />
        </div>
        <div className="">
          <div className="flex justify-between items-start gap-[63px]">
            <div className="">
              <label htmlFor="">Active Reward Vaults</label>
              <div className="text-black text-[22px] font-[600]">16</div>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default BGTMobileView;

interface Props {
  visible: boolean;
  onClose(): void;
}
