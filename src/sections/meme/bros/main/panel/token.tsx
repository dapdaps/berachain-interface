import Image from "next/image";
import Button from "@/components/button";
import RankMark from "../../rank-mark";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import clsx from "clsx";
import { balanceShortFormated, balanceFormated } from "@/utils/balance";
import Loading from "@/components/loading";
import TokensPopover from "../../components/tokens-popover";
import useData from "../../hooks/use-data";
import { useMemo } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import Big from "big.js";

export default function Token({
  token,
  onClick,
  userInfo,
  balance,
  balancesLoading,
  cachedTokens = {},
  claimData
}: any) {
  const { currentRound } = useData();
  const isMobile = useIsMobile();
  const [userReward, userRewards] = useMemo(() => {
    if (Big(token?.total_dapped_usd || 0).eq(0)) return ["", []];

    const p = Big(userInfo?.stakedAmountUSD || 0).div(token?.total_dapped_usd);
    const ur = p.mul(token.total_reward_usd).toString();

    const urs = token.reward_tokens.map((item: any) => {
      return {
        ...item,
        amount: p.mul(item.amount).toString(),
        usd: p.mul(item.usd).toString(),
        ...cachedTokens[item.address]
      };
    });

    return [ur, urs];
  }, [userInfo, token]);

  const claimable = !!(currentRound.claim_reward_time < Date.now() / 1000);

  return (
    <div
      className={clsx(
        "mt-[18px] rounded-[18px] bg-[#FFE5B8] border border-black shadow-shadow1 p-[16px]"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[15px]">
          <div className="relative shrink-0 w-[42px] h-[42px] rounded-full  border-[3px] border-black">
            <Image
              src={token.token.logo}
              width={42}
              height={42}
              className="rounded-full"
              alt={token.token.symbol}
            />

            {token.rank && (
              <RankMark
                rank={token.rank}
                className="left-[-2px] top-[4px]"
                iconClassName="!w-[29px] !h-[29px]"
              />
            )}
          </div>
          <div>
            <div className="text-[20px] font-CherryBomb">
              {token.token.symbol}
            </div>
            <div
              className="text-[14px] underline font-medium cursor-pointer"
              onClick={() => {
                onClick(8, token);
              }}
            >
              Get
            </div>
          </div>
        </div>
        <div className="rounded-[16px] flex items-center gap-[3px] p-[8px]">
          <span>APR</span>
          <span className="text-[14px] font-bold">
            {token.apy ? token.apy + "%" : "-"}
          </span>
        </div>
      </div>
      <div className="mt-[20px] flex text-[14px] md:flex-col">
        <div className="grow flex flex-wrap">
          <div className="w-1/3 md:w-1/2">
            <div className="text-[#3D405A] font-medium">Total Dapped</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>
                ${balanceShortFormated(token.total_dapped_usd || 0, 2)}
              </span>
              {!isMobile && (
                <Image
                  src={token.token.logo}
                  width={16}
                  height={16}
                  className="rounded-full"
                  alt={token.token.symbol}
                />
              )}
            </div>
          </div>
          <div className="w-1/3 md:w-1/2">
            <div className="text-[#3D405A] font-medium">Total Rewards</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>
                ${balanceShortFormated(token.total_reward_usd || 0, 2)}
              </span>
              {!isMobile && (
                <Popover
                  content={
                    <TokensPopover
                      tokens={token.reward_tokens.map((token: any) => ({
                        ...token,
                        ...cachedTokens[token.address]
                      }))}
                    />
                  }
                  placement={PopoverPlacement.TopLeft}
                >
                  <div className="flex items-center gap-[3px] cursor-pointer">
                    {token.reward_tokens.map((token: any, i: number) => (
                      <img
                        src={cachedTokens[token.address]?.logo}
                        className={`w-[26px] h-[26px] rounded-full shrink-0 ${
                          i > 0 && "ml-[8px]"
                        }`}
                      />
                    ))}
                  </div>
                </Popover>
              )}

              <button
                className="font-medium underline ml-[12px]"
                onClick={() => {
                  onClick(5, token);
                }}
              >
                Incentives
              </button>
            </div>
          </div>
          <div className="w-1/3 md:w-1/2 md:mt-[6px]">
            <div className="text-[#3D405A] font-medium">Dappers</div>
            <div className="font-semibold	mt-[2px]">{token.total_dappers}</div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">You Dapped</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              {userInfo?.stakedAmountUSD ? (
                <span>
                  {userInfo?.stakedAmountUSD
                    ? "$" + balanceShortFormated(userInfo?.stakedAmountUSD, 2)
                    : "-"}
                </span>
              ) : (
                <span>
                  {userInfo?.stakedAmount
                    ? balanceShortFormated(userInfo?.stakedAmount, 2)
                    : "-"}
                </span>
              )}
              {!isMobile && (
                <Image
                  src={token.token.logo}
                  width={16}
                  height={16}
                  className="rounded-full"
                  alt={token.token.symbol}
                />
              )}
            </div>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">Your Rewards</div>
            <Popover
              content={
                claimable ? null : (
                  <div className="w-[236px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 px-[14px] py-[16px]">
                    Rewards will unlock after this round ends.
                  </div>
                )
              }
              placement={PopoverPlacement.TopLeft}
              trigger={PopoverTrigger.Hover}
            >
              <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
                <span>
                  {Big(userReward || 0).gt(0)
                    ? "$" + balanceFormated(userReward, 2)
                    : "-"}
                </span>
                {!isMobile && (
                  <Popover
                    content={<TokensPopover tokens={userRewards} />}
                    placement={PopoverPlacement.TopLeft}
                  >
                    <div className="flex items-center gap-[3px] cursor-pointer">
                      {token.reward_tokens.map((token: any, i: number) => (
                        <img
                          src={cachedTokens[token.address]?.logo}
                          className={`w-[26px] h-[26px] rounded-full shrink-0 ${
                            i > 0 && "ml-[8px]"
                          }`}
                        />
                      ))}
                    </div>
                  </Popover>
                )}
                {claimable && Big(userReward || 0).gt(0) && claimData && (
                  <button
                    className="font-medium underline ml-[12px]"
                    disabled={Number(claimData[currentRound.round]) === 1}
                    onClick={() => {
                      onClick(3);
                    }}
                  >
                    {Number(claimData[currentRound.round]) === 1
                      ? "Claimed"
                      : "Claim"}
                  </button>
                )}
              </div>
            </Popover>
          </div>
          <div className="w-1/3 mt-[6px] md:w-1/2">
            <div className="text-[#3D405A] font-medium">In Wallet</div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              {balancesLoading ? (
                <Loading />
              ) : balance ? (
                balanceFormated(balance, 2)
              ) : (
                "-"
              )}
              {!isMobile && (
                <Image
                  src={token.token.logo}
                  width={16}
                  height={16}
                  className="rounded-full"
                  alt={token.token.symbol}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[15px] md:flex-row md:mt-[12px]">
          <Button
            className="h-[40px] w-[172px]"
            type="primary"
            disabled={currentRound.status !== "ongoing"}
            onClick={() => {
              onClick(1, token);
            }}
          >
            Dap me up!
          </Button>
          <Button
            className="h-[40px] w-[172px] !bg-transparent"
            disabled={
              !userInfo?.stakedAmount || currentRound.status !== "ended"
            }
            onClick={() => {
              onClick(2, token);
            }}
          >
            Unstake
          </Button>
        </div>
      </div>
    </div>
  );
}
