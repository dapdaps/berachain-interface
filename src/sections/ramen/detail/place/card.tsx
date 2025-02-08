import AuctionHead from '@/sections/ramen/detail/components/auction-head';
import Card from '@/sections/ramen/detail/components/card';
import PlaceYourBid from '@/sections/ramen/detail/place/index';
import { numberFormatter } from '@/utils/number-formatter';

const PlaceYourBidCard = (props: any) => {
  const { detail, isLaunched, auctionInfo, totalSupply, tokenBalance, spendToken, countdown, update } = props;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="">Place Your Bid</div>
          <div className="flex items-center justify-end gap-[5px] text-black font-[500] text-[12px]">
            <div className="text-[#8D8D8D]">Wallet Balance:</div>
            <div className="">
              {numberFormatter(tokenBalance, 4, true)}{" "}
              {spendToken.symbol}
            </div>
          </div>
        </div>
      }
      prefix={<AuctionHead detail={detail} isLaunched={isLaunched} countdown={countdown} />}
    >
      <PlaceYourBid
        auctionInfo={auctionInfo}
        totalSupply={totalSupply}
        spendToken={spendToken}
        onSuccess={() => {
          update();
        }}
        countdown={countdown}
      />
    </Card>
  );
};

export default PlaceYourBidCard;
