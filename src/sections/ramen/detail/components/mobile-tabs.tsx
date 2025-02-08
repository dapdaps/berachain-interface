import clsx from 'clsx';
import Tabs from '@/components/tabs';
import { useState } from 'react';
import AuctionResultsCard from '@/sections/ramen/detail/auction-results/card';
import PlaceYourBidCard from '@/sections/ramen/detail/place/card';
import ParticipationOverviewCard from '@/sections/ramen/detail/participation-overview/card';
import TokenLaunchDetailsCard from '@/sections/ramen/detail/launch-details/card';

const MobileTabs = (props: any) => {
  const { className, ...restProps } = props;

  const { isLaunched } = restProps;

  const [currentTab, setCurrentTab] = useState<string>('1');

  const TABS = [
    {
      key: '1',
      label: 'Auction Results',
      children: (
        isLaunched ? (
          <AuctionResultsCard {...restProps} />
        ) : (
          <PlaceYourBidCard {...restProps} />
        )
      )
    },
    {
      key: '2',
      label: 'Participation Overview',
      children: <ParticipationOverviewCard {...restProps} />
    },
    {
      key: '3',
      label: 'Token Launch Details',
      children: <TokenLaunchDetailsCard {...restProps} />
    },
  ];

  return (
    <div className={clsx('mt-[16px]', className)}>
      <Tabs
        tabs={TABS}
        currentTab={currentTab}
        onChange={(key) => setCurrentTab(key as string)}
        wrapperClassName="!border-[#373A53] !rounded-[12px] !w-full !ml-0 bg-white !p-[3px] h-[unset]"
        tabClassName="!rounded-[10px] text-[15px] font-[600] leading-[100%] flex justify-center items-center"
        bodyClassName="!border-0"
      />
    </div>
  );
};

export default MobileTabs;
