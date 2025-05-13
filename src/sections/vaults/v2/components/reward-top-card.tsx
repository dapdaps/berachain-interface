import clsx from 'clsx';
import { useMemo } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import { BGT_ADDRESS, useBGT } from '@/hooks/use-bgt';
import Skeleton from 'react-loading-skeleton';
import { bera } from '@/configs/tokens/bera';
import { useAccount, useBalance } from 'wagmi';
import { DEFAULT_CHAIN_ID } from '@/configs';
import Loading from '@/components/loading';
import Link from 'next/link';
import useIsMobile from '@/hooks/use-isMobile';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';
import IBGTPoints from '@/sections/vaults/v2/components/ibgt-points';
import CustomImage from '@/components/custom-image';

const RewardTopCard = (props: RewardTopCardProps) => {
  const { className, type, loading, pool } = props;

  const isMobile = useIsMobile();
  const { pageData: BGTPageData, loading: BGTLoading } = useBGT("all");
  const { toggleActionVisible, listDataGroupByPool } = useVaultsV2Context();

  const RewardTopCardTypeMap = useMemo<Record<RewardTopCardType, RewardTopCardItem>>(() => {
    return {
      [RewardTopCardType.iBgt]: {
        type: RewardTopCardType.iBgt,
        token: {
          name: bera['ibgt'].name as string,
          address: bera['ibgt'].address,
          symbol: bera['ibgt'].symbol,
          decimals: bera['ibgt'].decimals,
        },
        icon: "/images/vaults/v2/icon-ibgt.svg",
        bg: "#FFB8B9",
        title: "iBGT",
        button: [
          {
            type: "primary",
            text: "Stake",
            // link: "/hall?tab=ibgt&from=vaults",
            pool_address: "0xac03caba51e17c86c921e1f6cbfbdc91f8bb2e6b",
          },
        ],
      },
      [RewardTopCardType.Bgt]: {
        type: RewardTopCardType.Bgt,
        token: {
          name: "Bera Governance Token",
          address: BGT_ADDRESS,
          symbol: "BGT",
          decimals: 18
        },
        icon: "/images/vaults/v2/icon-bgt.svg",
        bg: "#FFF5A9",
        title: "BGT",
        button: [
          {
            type: "default",
            text: "View all validators",
            link: "/hall?tab=validators&from=vaults",
          },
          {
            type: "primary",
            text: "+ Boost",
            link: `/bgt/validator?id=${BGTPageData?.top3EmittingValidators?.validators?.[0]?.id}&from=vaults`,
          },
        ],
      },
    };
  }, [BGTPageData]);

  const currentItem = RewardTopCardTypeMap[type];

  const { address } = useAccount();

  const { data: balance, isLoading: balanceLoading } = useBalance({
    address: address,
    token: currentItem.token.address as `0x${string}`,
    chainId: DEFAULT_CHAIN_ID,
  });

  const [apr, aprLabel, aprLoading] = useMemo(() => {
    if (type === RewardTopCardType.iBgt) {
      return [
        numberFormatter(pool?.totalApy[1], 2, true) + "%",
        "APR",
        loading
      ];
    }
    return [
      numberFormatter(BGTPageData?.polGetGlobalInfo?.annualizedBGTEmission, 2, true, { isShort: true, isShortUppercase: true }),
      "BGT/Year",
      BGTLoading
    ];
  }, [type, BGTLoading, BGTPageData, loading, pool]);

  const [reward, rewardLabel, rewardIcon, rewardLoading] = useMemo(() => {
    if (type === RewardTopCardType.iBgt) {
      return [
        pool?.reward_tokens?.map((token: any) => token.symbol).join("-"),
        "Reward",
        <div className="flex items-center shrink-0">
          {
            pool?.reward_tokens?.map((token: any, idx: number) => (
              <img
                key={token.address}
                src={token.icon}
                alt=""
                className={clsx("shrink-0 w-[30px] h-[30px] object-contain object-center rounded-[6px]", idx > 0 && "ml-[-15px]")}
              />
            ))
          }
        </div>,
        loading
      ];
    }
    return [
      BGTPageData?.top3EmittingValidators?.validators?.[0]?.metadata?.name,
      "Top Validator",
      <CustomImage
        src={BGTPageData?.top3EmittingValidators?.validators?.[0]?.metadata?.logoURI}
        errorImage="https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"
        className={clsx("shrink-0 w-[30px] h-[30px] object-contain object-center rounded-full")}
      />,
      BGTLoading
    ];
  }, [type, BGTPageData, BGTLoading, loading, pool]);

  return (
    <div
      className={clsx('h-[160px] md:h-[115px] shrink-0 w-full p-[24px_22px_18px_24px] md:p-[8px_10px_10px] rounded-[10px] border border-black', className)}
      id={`VaultsRewardTopCard_${type}`}
      style={{
        backgroundColor: currentItem.bg,
      }}
    >
      <div className="flex justify-between md:flex-col">
        <div className="flex gap-[7px] relative">
          <img
            src={currentItem.icon}
            alt=""
            className="absolute w-[107px] md:w-[38px] h-[100px] md:h-[36px] object-contain object-center shrink-0 -translate-y-[40px] md:-translate-y-[15px] md:-translate-x-[15px]"
          />
          <div className="pl-[115px] md:pl-[28px] text-black font-CherryBomb text-[32px] md:text-[18px] font-normal leading-[90%]">
            <div className="flex items-center gap-[10px]">
              <div>{currentItem.title}</div>
              {
                currentItem.type === RewardTopCardType.iBgt && (
                  <IBGTPoints />
                )
              }
            </div>
            {
              !isMobile && (
                <div className="text-[16px] md:text-[10px] font-[400] mt-[7px] md:mt-0">
                  Balance: {
                    balanceLoading ? (
                      <Loading size={isMobile ? 10 : 16} />
                    ) : numberFormatter(balance?.formatted, 2, true, { isShort: true, isShortUppercase: true })
                  }
                </div>
              )
            }
          </div>
        </div>
        <div className="text-black text-end font-CherryBomb md:font-Montserrat text-[32px] md:text-[12px] font-normal md:font-[500] leading-[90%] md:flex md:flex-row-reverse md:justify-between md:mt-[12px]">
          <div className="">
            {
              aprLoading ? (
                isMobile ? (
                  <Loading size={12} />
                ) : (
                  <Skeleton height={28} width={130} borderRadius={6} />
                )
              ) : apr
            }
          </div>
          <div className="text-[16px] md:text-[12px] mt-[7px] md:mt-0 font-[400]">
            {aprLabel}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-[15px]">
        {
          !isMobile && (
            <div className="flex items-center gap-[10px]">
              {
                rewardLoading ? (
                  <Skeleton height={30} width={30} borderRadius={type === RewardTopCardType.iBgt ? 15 : 6} />
                ) : rewardIcon
              }
              <div className="text-black font-Montserrat text-[16px] font-[700] leading-[120%]">
                <div className="text-[14px] font-[500]">
                  {rewardLabel}:
                </div>
                <div className="">
                  {
                    rewardLoading ? (
                      <Skeleton height={19} width={120} borderRadius={6} />
                    ) : reward
                  }
                </div>
              </div>
            </div>
          )
        }
        <div className="shrink-0 flex items-center gap-[12px] justify-end md:w-full">
          {
            currentItem.button.map((item, index) => {
              if (isMobile && item.type === 'default') return null;
              if (item.pool_address) {
                return (
                  <button
                    type="button"
                    key={index}
                    className={clsx(
                      'flex items-center justify-center gap-[5px] min-w-[127px] md:w-full md:min-w-[unset] px-[15px] h-[40px] border border-black rounded-[10px] text-black font-Montserrat text-[14px] font-[500] leading-[120%]',
                      item.type === 'primary' && 'bg-[#FFDC50] font-[600]'
                    )}
                    onClick={() => {
                      const currPool = listDataGroupByPool?.find((it: any) => it.pool_address === item.pool_address);
                      toggleActionVisible({
                        type: ACTION_TYPE.DEPOSIT,
                        record: currPool,
                        visible: true
                      });
                    }}
                  >
                    {item.text}
                  </button>
                );
              }
              return (
                <Link
                  key={index}
                  href={item.link as string}
                  className={clsx(
                    'flex items-center justify-center gap-[5px] min-w-[127px] md:w-full md:min-w-[unset] px-[15px] h-[40px] border border-black rounded-[10px] text-black font-Montserrat text-[14px] font-[500] leading-[120%]',
                    item.type === 'primary' && 'bg-[#FFDC50] font-[600]'
                  )}
                >
                  {item.text}
                </Link>
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default RewardTopCard;

export interface RewardTopCardProps {
  type: RewardTopCardType;
  className?: string;
  loading?: boolean;
  pool?: any;
}

export enum RewardTopCardType {
  Bgt,
  iBgt,
}

export interface RewardTopCardItem {
  type: RewardTopCardType;
  icon: string;
  bg: string;
  title: string;
  token: { name: string; address: string; symbol: string; decimals: number; };
  button: { type?: "primary" | "default", text: string; link?: string; pool_address?: string; }[];
}
