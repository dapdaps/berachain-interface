import Card from '@/sections/ramen/detail/components/card';
import TokenLaunchDetails from '@/sections/ramen/detail/launch-details/index';

const TokenLaunchDetailsCard = (props: any) => {
  const { detail, minBidPrice, auctionInfo, totalSupply } = props;

  return (
    <Card title="Token Launch Details" className="col-span-2">
      <TokenLaunchDetails
        detail={detail}
        minBidPrice={minBidPrice}
        auctionInfo={auctionInfo}
        totalSupply={totalSupply}
      />
    </Card>
  );
};

export default TokenLaunchDetailsCard;
