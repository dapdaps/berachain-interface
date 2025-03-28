import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { numberFormatter } from '@/utils/number-formatter';
import Skeleton from 'react-loading-skeleton';
import { motion } from "framer-motion";
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import RewardIcon, { RewardIconContent } from '@/sections/vaults/v2/components/reward-icon';
import useIsMobile from '@/hooks/use-isMobile';

const Dashboard = (props: any) => {
  const { className } = props;

  const {
    totalUserStakeUsd,
    totalUserVaultsCount,
    totalUserRewardTokens,
    listLoading,
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  const visibleRewardTokenLength = isMobile ? 3 : 5;

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
        value={numberFormatter(totalUserVaultsCount, 0, true)}
        // valueClassName="underline cursor-pointer"
        className="lg:items-end"
        onClick={() => {
          // toggleListOrder(ORDER_KEYS.YOURS, ORDER_DIRECTION.DESC);
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
