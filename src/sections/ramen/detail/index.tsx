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

const Detail = (props: any) => {
  const { className } = props;
  const { loading, detail, auctionInfo, price, pricePerToken, minBidPrice } =
    useDetail();
  const isLaunched = useMemo(
    () =>
      detail?.claimTime
        ? Date.now() >= new Date(detail.claimTime).getTime()
        : true,
    [detail]
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
                prefix={
                  <div className="mb-[37px] flex items-center gap-[10px] font-Montserrat font-[500] text-black text-[14px] leading-[90%]">
                    <div className="text-[18px] font-[600]">
                      {numberFormatter(detail.bidSubmitted, 2, true)}
                    </div>
                    <div className="">bids submitted</div>
                    <div className="ml-auto">Auction Ended</div>
                  </div>
                }
              >
                <AuctionResults />
              </Card>
            ) : (
              <PlaceYourBid />
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
              <TokenLaunchDetails detail={detail} minBidPrice={minBidPrice} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Detail;
