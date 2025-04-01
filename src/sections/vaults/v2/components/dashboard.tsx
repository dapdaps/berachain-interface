import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { numberFormatter } from '@/utils/number-formatter';
import Skeleton from 'react-loading-skeleton';
import { motion } from "framer-motion";
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import RewardIcon, { RewardIconContent } from '@/sections/vaults/v2/components/reward-icon';
import useIsMobile from '@/hooks/use-isMobile';
import { useEffect, useRef } from 'react';

const Dashboard = (props: any) => {
  const { className } = props;

  const {
    totalUserStakeUsd,
    totalUserVaultsCount,
    totalUserRewardTokens,
    listLoading,
    listVaultsStaked,
    toggleListVaultsStaked,
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  const visibleRewardTokenLength = isMobile ? 3 : 5;

  const { containerRef } = useVaultsV2Context();
  const popoverRef = useRef<any>();

  useEffect(() => {
    const handleScroll = () => {
      popoverRef.current?.onClose();
    };

    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={clsx("text-[20px] text-black leading-[90%] font-[600] font-Montserrat bg-[#FFDC50] rounded-[10px] p-[20px_24px_23px_31px] md:p-[16px_19px_17px_9px] flex justify-between items-start", className)}>
      <div className="flex items-start gap-[100px] md:gap-[30px]">
        <Item
          label="You Invested"
          value={numberFormatter(totalUserStakeUsd, 2, true, { prefix: "$" })}
        />
        <Item
          label="Your Rewards"
          value={(
            <div className="flex items-center">
              {
                listLoading ? (
                  <>
                    <Skeleton height={26} width={26} borderRadius={13} />
                    <Skeleton height={26} width={26} borderRadius={13} className="ml-[-6px]" />
                    <Skeleton height={26} width={26} borderRadius={13} className="ml-[-6px]" />
                  </>
                ) : (totalUserRewardTokens.length > 0 ? (
                  <>
                    {
                      totalUserRewardTokens.slice(0, visibleRewardTokenLength).map((reward, idx) => (
                        <RewardIcon
                          key={idx}
                          reward={reward}
                          className={idx > 0 ? "ml-[-6px]" : ""}
                        />
                      ))
                    }
                    {
                      totalUserRewardTokens.length > visibleRewardTokenLength && (
                        <Popover
                          ref={popoverRef}
                          trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
                          placement={PopoverPlacement.Bottom}
                          content={(
                            <Card className="!rounded-[10px] !p-[10px] w-[200px] flex flex-col items-stretch gap-[10px_5px] max-h-[150px] overflow-y-auto">
                              {
                                totalUserRewardTokens.slice(visibleRewardTokenLength).map((reward, idx) => (
                                  <RewardIconContent
                                    key={idx}
                                    reward={reward}
                                    className=""
                                  />
                                ))
                              }
                            </Card>
                          )}
                        >
                          <motion.div
                            className="relative bg-[url('/images/vaults/v2/more-icon.svg')] bg-no-repeat bg-center bg-cover w-[26px] h-[26px] rounded-full overflow-hidden cursor-pointer ml-[-6px] border border-black bg-[#D1CEB4]"
                            variants={{
                              focus: {
                                scale: 1.1,
                                zIndex: 1,
                              },
                            }}
                            whileHover="focus"
                            whileTap="focus"
                          />
                        </Popover>
                      )
                    }
                  </>
                ) : "-")
              }
            </div>
          )}
        />
      </div>
      <Item
        label="Your Vaults"
        value={(
          <div className="flex items-center gap-[10px] cursor-pointer pl-[5px]">
            <div className="">
              {numberFormatter(totalUserVaultsCount, 0, true)}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="13"
              viewBox="0 0 15 13"
              fill="none"
              className="translate-y-[1px]"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3.91468 11.3952V6.28773C3.91468 6.13099 3.86291 5.97864 3.76741 5.85435L0.148583 1.14468C-0.210877 0.676866 0.122637 0 0.712605 0H11.3401C11.93 0 12.2636 0.676866 11.9041 1.14468L8.28528 5.85435C8.18978 5.97864 8.138 6.13099 8.138 6.28773V12.2877C8.138 12.8341 7.54744 13.1764 7.07325 12.9049L4.27252 12.0124C4.05121 11.8857 3.91468 11.6502 3.91468 11.3952ZM10.1984 5.68991C9.7566 5.68991 9.39843 6.04808 9.39843 6.48991C9.39843 6.93174 9.7566 7.28991 10.1984 7.28991H13.9069C14.3488 7.28991 14.7069 6.93174 14.7069 6.48991C14.7069 6.04808 14.3488 5.68991 13.9069 5.68991H10.1984ZM9.39843 9.2713C9.39843 8.82947 9.7566 8.4713 10.1984 8.4713H13.9069C14.3488 8.4713 14.7069 8.82947 14.7069 9.2713C14.7069 9.71312 14.3488 10.0713 13.9069 10.0713H10.1984C9.7566 10.0713 9.39843 9.71312 9.39843 9.2713ZM10.1984 11.2527C9.7566 11.2527 9.39843 11.6109 9.39843 12.0527C9.39843 12.4945 9.7566 12.8527 10.1984 12.8527H13.9069C14.3488 12.8527 14.7069 12.4945 14.7069 12.0527C14.7069 11.6109 14.3488 11.2527 13.9069 11.2527H10.1984Z"
                fill={listVaultsStaked ? "#000" : "#999"}
              />
            </svg>
          </div>
        )}
        valueClassName="underline cursor-pointer"
        className="lg:items-end"
        onClick={() => {
          toggleListVaultsStaked();
        }}
      />
    </div>
  );
};

export default Dashboard;

const Item = (props: any) => {
  const { className, label, value, valueClassName, onClick } = props;

  return (
    <div className={clsx("flex flex-col gap-[12px]", className)}>
      <div className="text-[#3D405A] text-[14px] font-[500] whitespace-nowrap">
        {label}
      </div>
      <div className={clsx("", valueClassName)} onClick={onClick}>
        {value}
      </div>
    </div>
  );
};
