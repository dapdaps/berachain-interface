import clsx from 'clsx';
import Dashboard from '@/sections/ramen/detail/components/dashboard';
import Card from '@/sections/ramen/detail/components/card';
import { numberFormatter } from '@/utils/number-formatter';
import AuctionResults from '@/sections/ramen/detail/auction-results';
import ParticipationOverview from '@/sections/ramen/detail/participation-overview';
import TokenLaunchDetails from '@/sections/ramen/detail/launch-details';

const Detail = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('max-h-[calc(100dvh_-_310px)] overflow-x-hidden overflow-y-auto', className)}>
      <Dashboard />
      <div className="mt-[21px] grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
        <Card
          title="Auction Results"
          prefix={(
            <div className="mb-[37px] flex items-center gap-[10px] font-Montserrat font-[500] text-black text-[14px] leading-[90%]">
              <div className="text-[18px] font-[600]">
                {numberFormatter(1265, 2, true)}
              </div>
              <div className="">
                bids submitted
              </div>
              <div className="ml-auto">
                Auction Ended
              </div>
            </div>
          )}
        >
          <AuctionResults />
        </Card>
        <Card
          title="Participation Overview"
        >
          <ParticipationOverview />
        </Card>
        <Card
          title="Token Launch Details"
          className="col-span-2"
        >
          <TokenLaunchDetails />
        </Card>
      </div>
    </div>
  );
};

export default Detail;
