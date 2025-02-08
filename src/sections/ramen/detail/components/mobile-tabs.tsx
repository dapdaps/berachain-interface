import clsx from 'clsx';
import Tabs from '@/components/tabs';
import { useState } from 'react';

const MobileTabs = (props: any) => {
  const { className, children } = props;

  const [currentTab, setCurrentTab] = useState<string>('1');

  return (
    <div className={clsx('mt-[16px]', className)}>
      <Tabs
        tabs={TABS}
        currentTab={currentTab}
        onChange={(key) => setCurrentTab(key as string)}
        wrapperClassName="!border-[#373A53] !rounded-[12px] !w-full ml-0 bg-white !p-[3px] h-[unset]"
        tabClassName="!rounded-[10px] text-[15px] font-[600] leading-[100%] flex justify-center items-center"
      />
    </div>
  );
};

export default MobileTabs;

const TABS = [
  { key: '1', label: 'Auction Results', children: <></> },
  { key: '2', label: 'Participation Overview', children: <></> },
  { key: '3', label: 'Token Launch Details', children: <></> },
];
