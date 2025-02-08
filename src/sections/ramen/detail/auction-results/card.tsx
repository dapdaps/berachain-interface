import AuctionHead from '@/sections/ramen/detail/components/auction-head';
import AuctionResults from '@/sections/ramen/detail/auction-results/index';
import Card from '@/sections/ramen/detail/components/card';

const AuctionResultsCard = (props: any) => {
  const { detail, isLaunched, auctionInfo, totalSupply } = props;

  return (
    <Card
      title="Auction Results"
      prefix={<AuctionHead detail={detail} isLaunched={isLaunched} />}
    >
      <AuctionResults
        detail={detail}
        auctionInfo={auctionInfo}
        totalSupply={totalSupply}
      />
    </Card>
  );
};

export default AuctionResultsCard;
