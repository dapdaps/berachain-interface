import Card from '@/sections/ramen/detail/components/card';
import ParticipationOverview from '@/sections/ramen/detail/participation-overview/index';

const ParticipationOverviewCard = (props: any) => {
  const { detail, isLaunched, auctionInfo, steps } = props;

  return (
    <Card title="Participation Overview">
      <ParticipationOverview
        detail={detail}
        steps={steps}
        isLaunched={isLaunched}
        auctionInfo={auctionInfo}
      />
    </Card>
  );
};

export default ParticipationOverviewCard;
