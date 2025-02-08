import clsx from "clsx";
import Dashboard from "@/sections/ramen/detail/components/dashboard";
import Card from "@/sections/ramen/detail/components/card";
import { numberFormatter } from "@/utils/number-formatter";
import AuctionResults from "@/sections/ramen/detail/auction-results";
import ParticipationOverview from "@/sections/ramen/detail/participation-overview";
import TokenLaunchDetails from "@/sections/ramen/detail/launch-details";
import PlaceYourBid from "@/sections/ramen/detail/place";
import useDetail from "../hooks/use-detail";
import CircleLoading from "@/components/circle-loading";
import { DIS_STEPS } from "../config";
import { useMemo } from "react";
import dayjs from "dayjs";
import AuctionHead from "@/sections/ramen/detail/components/auction-head";
import RegisterPanel from "./register-panel";
import { bera } from "@/configs/tokens/bera";

const Detail = (props: any) => {
  const { className } = props;

  const spendToken = bera.bera;

  const {
    loading,
    detail,
    auctionInfo,
    gachaInfo,
    ticketPrice,
    pricePerToken,
    minBidPrice,
    queryGachaBalance
  } = useDetail();

  const isLaunched = useMemo(
    () =>
      detail?.claimTime
        ? Date.now() >= new Date(detail.claimTime).getTime()
        : true,
    [detail]
  );
  const totalSupply = useMemo(
    () =>
      !auctionInfo?.baseToken
        ? 0
        : auctionInfo.baseToken.totalSupply /
          10 ** auctionInfo.baseToken.decimals,
    [auctionInfo]
  );
  const steps = useMemo(() => {
    if (!detail) return [];
    if (detail?.isFixed) {
      return [];
    }
    return DIS_STEPS.map((step: any, i: number) => {
      const date = dayjs(
        i === 0 ? detail.launch_start_date : detail.claimTime
      ).format("DD/MM/YYYY, HH:mm A");
      return {
        ...step,
        date
      };
    });
  }, [detail]);

  return (
    <div
      className={clsx(
        "h-[calc(100dvh_-_310px)] overflow-x-hidden overflow-y-auto",
        className
      )}
    >
      {loading || !detail ? (
        <div className="flex items-center justify-center h-full">
          <CircleLoading size={40} />
        </div>
      ) : (
        <>
          <Dashboard detail={detail} isLaunched={isLaunched} steps={steps} />
          <div className="mt-[21px] grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
            {isLaunched ? (
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
            ) : detail.isFixed ? (
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
                isLaunched={isLaunched}
                detail={detail}
              />
            )}
            <Card title="Participation Overview">
              <ParticipationOverview
                detail={detail}
                steps={steps}
                isLaunched={isLaunched}
                auctionInfo={auctionInfo}
              />
            </Card>
            <Card title="Token Launch Details" className="col-span-2">
              <TokenLaunchDetails
                detail={detail}
                minBidPrice={minBidPrice}
                auctionInfo={auctionInfo}
                totalSupply={totalSupply}
              />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
