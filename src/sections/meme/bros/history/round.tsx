import Image from "next/image";
import Button from "@/components/button";
import Popover, { PopoverPlacement } from "@/components/popover";
import RoundLabel from "../components/round-label";
import TokensPanel from "../components/tokens-popover";
import clsx from "clsx";
import { balanceShortFormated } from "@/utils/balance";
import useIsMobile from "@/hooks/use-isMobile";
import { useMemo } from "react";
import Big from "big.js";
import { usePriceStore } from "@/stores/usePriceStore";
import Loading from "@/components/loading";

export default function Round({
  round,
  userStakeData,
  fetchingUserStakingData,
  onOpenModal,
  claimData
}: any) {
  const isMobile = useIsMobile();
  const prices: any = usePriceStore((store) => store.price);

  const [
    tokensAmounts,
    totalDappedUsd,
    totalRewardsUsd,
    userRewardUsd,
    voteToken,
    userAddIncentive
  ] = useMemo(() => {
    let td_u = Big(0);
    let tw_u = Big(0);
    let vt: any = null;
    let user_rewards_u = Big(0);
    let user_incentive_u = Big(0);
    const rts = round.reward_tokens?.reduce(
      (acc: any, curr: any) => ({
        ...acc,
        [curr.address]: curr
      }),
      {}
    );
    const _tokens: any = [];
    const _reward_price: any = {};
    round.tokens.forEach((token: any) => {
      const td = Big(token.total_dapped || 0);
      const price = prices[token.token.symbol] || prices[token.token.priceKey];
      if (price) {
        td_u = td_u.add(td.mul(price));
      }
      token.reward_tokens.forEach((item: any) => {
        const r_t = rts[item.address];
        const r_a = Big(item.amount);
        const r_p = prices[r_t.symbol] || prices[r_t.priceKey];
        _reward_price[item.address] = r_p;
        if (r_p) {
          tw_u = tw_u.add(r_a.mul(r_p));
        }
      });

      if (token.token.address === round.user_vote?.token_address) {
        vt = token.token;
      }

      _tokens.push({
        address: token.token.address,
        logo: token.token.logo,
        symbol: token.token.symbol,
        amount: token.total_dapped,
        usd: price ? td.mul(price || 0).toString() : "-"
      });
    });

    round.user_reward.forEach((item: any) => {
      const price = _reward_price[item.token_address];
      user_rewards_u = Big(item.amount)
        .mul(price || 0)
        .add(user_rewards_u);
    });

    round.user_incentive.forEach((item: any) => {
      const price = _reward_price[item.token_address];
      user_incentive_u = Big(item.amount)
        .mul(price || 0)
        .add(user_incentive_u);
    });

    return [_tokens, td_u, tw_u, user_rewards_u, vt, user_incentive_u];
  }, [round]);

  const claimable = !!(round.claim_reward_time < Date.now() / 1000);
  return (
    <>
      <div
        className={clsx(
          "relative w-full rounded-[18px] mt-[50px] bg-[#FFE5B8] shadow-shadow1 border border-black p-[5px]",
          "md:mx-[14px] md:w-[calc(100%-28px)]"
        )}
      >
        <RoundLabel
          round={round}
          className="w-[342px] !absolute top-[-34px] left-[13px] md:w-[calc(100%-26px)]"
        />
        <div className="hidden border-b border-black/20 w-full justify-center pb-[14px] pt-[44px] md:flex cursor-pointer">
          {round.tokens.map((token: any, i: number) => (
            <Image
              key={token.token_address}
              src={token.token.logo}
              width={40}
              height={40}
              alt={token.token.symbol}
              className={i !== 0 ? "ml-[-15px]" : ""}
            />
          ))}
        </div>
        <div
          className={clsx(
            "border-b border-black/20 pt-[50px] pl-[20px] pb-[20px] flex items-center",
            "md:pb-0 md:pl-0 md:pt-[10px] md:flex-wrap md:border-0"
          )}
        >
          {!isMobile && (
            <div className="w-1/4">
              <Popover
                content={<TokensPanel tokens={tokensAmounts} />}
                placement={PopoverPlacement.TopLeft}
              >
                <div className="flex items-center">
                  {round.tokens.map((token: any, i: number) => (
                    <Image
                      key={token.token_address}
                      src={token.token.logo}
                      width={40}
                      height={40}
                      alt={token.token.symbol}
                      className={i !== 0 ? "ml-[-15px]" : ""}
                    />
                  ))}
                </div>
              </Popover>
            </div>
          )}

          <div className="w-1/4 md:w-1/2 md:pl-[20px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Total Dapped
            </div>
            <div className="font-semibold	mt-[2px]">
              {" "}
              ${balanceShortFormated(totalDappedUsd.toString(), 2)}
            </div>
          </div>
          <div className="w-1/4 md:w-1/2 md:pl-[10px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Total Rewards
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[10px]">
              ${balanceShortFormated(totalRewardsUsd.toString(), 2)}
            </div>
          </div>
          <div className="w-1/4 md:hidden">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Total Dappers
            </div>
            <div className="font-semibold	mt-[2px]">{round.total_dappers}</div>
          </div>
        </div>
        <div className="pt-[12px] pl-[20px] pb-[20px] flex items-center flex-wrap">
          <div className="w-1/4 md:w-1/2">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              You Voted for
            </div>
            <div className="font-semibold	mt-[2px]">
              {voteToken ? (
                <div className="flex items-center gap-[8px]">
                  <Image
                    key={voteToken.address}
                    src={voteToken.logo}
                    width={16}
                    height={16}
                    alt={voteToken.symbol}
                  />
                  <div className="text-[14px]">{voteToken.symbol}</div>
                </div>
              ) : (
                "-"
              )}
            </div>
          </div>
          <div className="w-1/4 md:w-1/2">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Incentive Added
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              {userAddIncentive.gt(0)
                ? `$${balanceShortFormated(userAddIncentive.toString(), 2)}`
                : "-"}
            </div>
          </div>
          <div className="w-1/4 md:w-1/2 md:pt-[12px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              You Dapped
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              <span>
                {fetchingUserStakingData ? (
                  <Loading />
                ) : Big(userStakeData?.totalUsd || 0).gt(0) ? (
                  `$${balanceShortFormated(userStakeData.totalUsd, 2)}`
                ) : (
                  "-"
                )}
              </span>
              {!fetchingUserStakingData &&
                userStakeData?.tokens.length > 0 &&
                userStakeData.tokens.map((token: any, i: number) => (
                  <Image
                    src={token.token.logo}
                    width={16}
                    height={16}
                    alt={token.token.symbol}
                    className={clsx("rounded-full", i > 0 && " ml-[-8px]")}
                  />
                ))}
              <Button
                className="h-[28px] ml-[12px] md:hidden"
                type="primary"
                disabled={!userStakeData?.tokens?.length}
                onClick={() => {
                  onOpenModal(3, round);
                }}
              >
                Unstake!
              </Button>
            </div>
          </div>
          <div className="w-1/4 md:w-1/2 md:pt-[12px]">
            <div className="text-[#3D405A] font-medium md:text-[14px]">
              Your Rewards
            </div>
            <div className="font-semibold	mt-[2px] flex items-center gap-[3px]">
              {userRewardUsd.gt(0)
                ? `$${balanceShortFormated(userRewardUsd.toString(), 2)}`
                : "-"}
              {userRewardUsd.gt(0) &&
                round.reward_tokens.map((token: any, i: number) => (
                  <Image
                    src={token.logo}
                    width={16}
                    height={16}
                    alt={token.symbol}
                    className={clsx("rounded-full", i > 0 && " ml-[-8px]")}
                  />
                ))}
              {claimable && userRewardUsd.gt(0) && (
                <Button
                  className="h-[28px] ml-[12px] md:hidden"
                  type="primary"
                  disabled={Number(claimData) === 1}
                  onClick={() => {
                    onOpenModal(2, {
                      ...round,
                      rewardTokens: round.reward_tokens
                    });
                  }}
                >
                  {Number(claimData) === 1 ? "Claimed" : "Claim"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="items-center gap-[14px] px-[14px] mb-[12px] hidden md:flex">
          <Button
            className="h-[40px] w-1/2"
            type="primary"
            disabled={!userStakeData?.tokens?.length}
            onClick={() => {
              onOpenModal(3, round);
            }}
          >
            Unstake!
          </Button>
          <Button
            className="h-[40px] w-1/2"
            type="primary"
            disabled={!(claimable && userRewardUsd.gt(0) && claimData)}
            onClick={() => {
              onOpenModal(2, {
                ...round,
                rewardTokens: round.reward_tokens
              });
            }}
          >
            {Number(claimData) === 1 ? "Claimed" : "Claim"}
          </Button>
        </div>
      </div>
      <></>
    </>
  );
}
