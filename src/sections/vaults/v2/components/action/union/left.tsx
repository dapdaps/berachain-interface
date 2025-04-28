import clsx from "clsx";
import ActionUnionPotions from "@/sections/vaults/v2/components/action/union/position";
import LazyImage from "@/components/layz-image";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Card from "@/components/card";
import useIsMobile from "@/hooks/use-isMobile";
import { RewardIconContent } from "@/sections/vaults/v2/components/reward-icon";
import DoubleTokenIcons from "@/components/token-icon/double";
import IBGTPoints from '@/sections/vaults/v2/components/ibgt-points';

const ActionUnionLeft = (props: any) => {
  const { className } = props;

  const {
    setCurrentProtocol,
    currentRecord,
    currentProtocol,
    toggleClaimVisible
  } = useVaultsV2Context();
  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        "w-full bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[21px_22px_20px_13px]",
        className
      )}
    >
      <ActionUnionPotions />
      <div className="w-full pt-[19px]">
        <div className="text-[18px] font-Montserrat font-bold leading-[90%] text-black pl-[17px] pr-[2px]">
          Rewards
        </div>
        <div className="flex flex-col items-stretch gap-[4px] mt-[21px]">
          {currentRecord?.list?.map((protocol: any, index: number) => {
            const protocolSelected =
              protocol.backendId === currentProtocol?.backendId;
            const isUserReward = protocol.user_reward?.length > 0;
            const isIBGT = protocol?.reward_tokens?.length === 1 && protocol?.reward_tokens?.some((t: any) => t.symbol === "iBGT");

            return (
              <div
                key={index}
                className={clsx(
                  "flex items-center gap-[10px] justify-between py-[8px] pl-[17px] pr-[10px] rounded-[6px] transition duration-300 hover:bg-[rgba(0,0,0,0.06)]",
                  protocolSelected && "bg-[rgba(0,0,0,0.06)]"
                )}
              >
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center">
                    {protocol?.reward_tokens?.map((token: any, idx: number) => {
                      const currentRewardToken = protocol.user_reward?.find(
                        (_it: any) =>
                          _it.address.toLowerCase() ===
                          token.address.toLowerCase()
                      );
                      return (
                        <Popover
                          key={idx}
                          triggerContainerClassName="inline-block"
                          content={
                            <Card className="!rounded-[10px] !p-[10px] w-[200px] flex flex-col items-stretch gap-[10px_5px] max-h-[150px] overflow-y-auto">
                              <RewardIconContent
                                reward={{
                                  ...token,
                                  amount: currentRewardToken?.amount
                                }}
                                className=""
                              />
                            </Card>
                          }
                          trigger={PopoverTrigger.Hover}
                          placement={PopoverPlacement.BottomLeft}
                          contentClassName="!z-[101]"
                        >
                          <div key={idx} className="relative">
                            {typeof token.icon === "string" ? (
                              <LazyImage
                                src={token.icon}
                                containerClassName={clsx(
                                  "!w-[34px] !h-[34px] rounded-[50%] overflow-hidden shrink-0",
                                  idx > 0 && "ml-[-10px]"
                                )}
                                fallbackSrc="/assets/tokens/default_icon.png"
                              />
                            ) : (
                              <DoubleTokenIcons
                                size={34}
                                icon0={token.icon[0]}
                                icon1={token.icon[1]}
                                className={clsx(
                                  "!w-[34px] !h-[34px] rounded-[50%] overflow-hidden shrink-0",
                                  idx > 0 && "ml-[-10px]"
                                )}
                              />
                            )}
                            <LazyImage
                              key={index}
                              src={protocol.protocolIcon}
                              containerClassName={clsx(
                                "!w-[18px] !h-[18px] rounded-[4px] border border-[#FFFDEB] overflow-hidden shrink-0 !absolute bottom-[0px] right-[-5px]"
                              )}
                              fallbackSrc="/assets/tokens/default_icon.png"
                            />
                          </div>
                        </Popover>
                      );
                    })}
                  </div>
                  <div className="text-black font-Montserrat text-[16px] font-[600] leading-[100%] flex flex-col gap-[4px]">
                    <div className="">
                      {protocol?.reward_tokens
                        ?.map((token: any, index: number) => token.symbol)
                        .join("-")}
                    </div>
                    <div className="text-black font-Montserrat text-[12px] font-[500] leading-[100%]">
                      {/^(Hub|Bex)$/i.test(protocol?.protocol || "")
                        ? "Bex"
                        : protocol?.protocol}
                    </div>
                  </div>
                  {
                    isIBGT && (
                      <div className="">
                        <IBGTPoints
                          className="!text-[12px]"
                          contentClassName="!z-[110]"
                        />
                      </div>
                    )
                  }
                  {/* {protocol.reward_tokens.map((reward: any, index: number) => (
                    <div key={index} className="flex items-center gap-[4px]">
                      <LazyImage
                          src={reward.icon}
                          title={reward.symbol}
                          alt=""
                          width={isMobile ? 18 : 26}
                          height={isMobile ? 18 : 26}
                          containerClassName={clsx("shrink-0 rounded-full overflow-hidden", (!isUserReward && index > 0) && "ml-[-10px]")}
                          fallbackSrc="/assets/tokens/default_icon.png"
                        />
                      {protocol.user_reward.map((_reward: any, idx: number) => {
                        if (
                          !_reward.amount ||
                          _reward.address.toLowerCase() !==
                            reward.address.toLowerCase()
                        )
                          return null;
                        return (
                          <div
                            key={idx}
                            className="text-[#6CA200] font-[500] text-[16px] flex items-center gap-[4px]"
                          >
                            <div className="">
                              +
                              {numberFormatter(_reward.amount, 2, true, {
                                // prefix: "$",
                                isShort: true
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))} */}
                  {!["BeraBorrow"].includes(currentProtocol.protocol) && (
                    <Popover
                      triggerContainerClassName="inline-block"
                      contentClassName="!z-[101]"
                      content={
                        <Card className="!rounded-[10px] !bg-white !p-[7px_12px] !text-[14px] font-[500]">
                          Claim rewards
                        </Card>
                      }
                      trigger={PopoverTrigger.Hover}
                      placement={PopoverPlacement.Top}
                      closeDelayDuration={0}
                    >
                      <button
                        type="button"
                        className="shrink-0 w-[53px] h-[25px] rounded-[6px] bg-[#FFDC50] border border-black text-[14px] font-[500] flex justify-center items-center mt-[5px]"
                        onClick={() => {
                          setCurrentProtocol(protocol);
                          toggleClaimVisible(true, protocol.user_reward);
                        }}
                        style={{
                          display:
                            protocol.user_reward?.length > 0 ? "flex" : "none"
                        }}
                      >
                        Claim
                      </button>
                    </Popover>
                  )}
                </div>
                <button
                  type="button"
                  disabled={false}
                  className="flex justify-center items-center p-[4px] w-[24px] h-[24px] flex-shrink-0 rounded-full bg-white border border-black/30 disabled:!cursor-not-allowed disabled:opacity-30"
                  onClick={() => setCurrentProtocol(protocol)}
                >
                  {protocolSelected && (
                    <div className="w-full h-full rounded-full bg-[#FFDC50] border border-black/30"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActionUnionLeft;
