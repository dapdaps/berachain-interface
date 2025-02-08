import AuctionHead from '@/sections/ramen/detail/components/auction-head';
import Card from '@/sections/ramen/detail/components/card';
import PlaceYourBid from '@/sections/ramen/detail/place/index';
import { numberFormatter } from '@/utils/number-formatter';
import RegisterPanel from '@/sections/ramen/detail/register-panel';

const PlaceYourBidCard = (props: any) => {
  const {
    detail,
    isLaunched,
    auctionInfo,
    totalSupply,
    tokenBalance,
    spendToken,
    countdown,
    update,
    gachaInfo,
    ticketPrice,
    queryGachaBalance,
  } = props;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="">
            {detail.isFixed ? 'Register for Launch' : 'Place Your Bid'}
          </div>
          <div className="flex items-center justify-end gap-[5px] text-black font-[500] text-[12px]">
            <div className="text-[#8D8D8D]"><span className="md:hidden">Wallet </span>Balance:</div>
            {
              detail.isFixed ? (
                <div className="">
                  {numberFormatter(gachaInfo?.balance || 0, 0, true)} Gocha
                </div>
              ) : (
                <div className="">
                  {numberFormatter(tokenBalance, 4, true)}{' '}
                  {spendToken.symbol}
                </div>
              )
            }
          </div>
        </div>
      }
      prefix={<AuctionHead detail={detail} isLaunched={isLaunched} countdown={countdown} />}
    >
      {
        detail.isFixed ? (
          <RegisterPanel
            gachaInfo={gachaInfo}
            ticketPrice={ticketPrice}
            detail={detail}
            onSuccess={() => {
              queryGachaBalance();
            }}
          />
        ) : (
          <PlaceYourBid
            auctionInfo={auctionInfo}
            totalSupply={totalSupply}
            spendToken={spendToken}
            update={update}
          />
        )
      }
    </Card>
  );
};

export default PlaceYourBidCard;
