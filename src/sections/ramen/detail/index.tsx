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
import useTokenBalance from '@/hooks/use-token-balance';
import { useCountdown } from '@/sections/ramen/hooks/use-countdown';
import useIsMobile from '@/hooks/use-isMobile';
import MobileTabs from '@/sections/ramen/detail/components/mobile-tabs';
import AuctionResultsCard from '@/sections/ramen/detail/auction-results/card';
import TokenLaunchDetailsCard from '@/sections/ramen/detail/launch-details/card';
import ParticipationOverviewCard from '@/sections/ramen/detail/participation-overview/card';
import PlaceYourBidCard from '@/sections/ramen/detail/place/card';

const Detail = (props: any) => {
  const { className } = props;

  const spendToken = bera.bera;

  const isMobile = useIsMobile();
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
  const { tokenBalance, update } = useTokenBalance(
    spendToken.address,
    spendToken.decimals
  );
  const [countdown] = useCountdown({
    startTime: detail?.launch_start_date,
    endTime: detail?.launch_end_date
  });

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
        "h-[calc(100dvh_-_310px)] md:h-[calc(100dvh_-_170px)] overflow-x-hidden overflow-y-auto",
        className
      )}
    >
      {loading || !detail ? (
        <div className="flex items-center justify-center h-full">
          <CircleLoading size={40} />
        </div>
      ) : (
        <>
          <Dashboard
            detail={detail}
            isLaunched={isLaunched}
            steps={steps}
            countdown={countdown}
          />
          {
            isMobile ? (
              <MobileTabs
                detail={detail}
                isLaunched={isLaunched}
                auctionInfo={auctionInfo}
                totalSupply={totalSupply}
                tokenBalance={tokenBalance}
                spendToken={spendToken}
                update={update}
                countdown={countdown}
                steps={steps}
                minBidPrice={minBidPrice}
              />
            ) : (
              <div className="mt-[21px] grid grid-cols-2 gap-x-[30px] gap-y-[20px]">
                {isLaunched ? (
                  <AuctionResultsCard
                    detail={detail}
                    isLaunched={isLaunched}
                    auctionInfo={auctionInfo}
                    totalSupply={totalSupply}
                  />
                ) : (
                  <PlaceYourBidCard
                    detail={detail}
                    isLaunched={isLaunched}
                    tokenBalance={tokenBalance}
                    auctionInfo={auctionInfo}
                    totalSupply={totalSupply}
                    spendToken={spendToken}
                    update={update}
                    countdown={countdown}
                  />
                )}
                <ParticipationOverviewCard
                  detail={detail}
                  isLaunched={isLaunched}
                  auctionInfo={auctionInfo}
                  steps={steps}
                />
                <TokenLaunchDetailsCard
                  detail={detail}
                  minBidPrice={minBidPrice}
                  auctionInfo={auctionInfo}
                  totalSupply={totalSupply}
                />
              </div>
            )
          }
        </>
      )}
    </div>
  );
};

export default Detail;
