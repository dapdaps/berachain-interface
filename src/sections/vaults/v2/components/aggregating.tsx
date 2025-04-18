import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import Infrared from '@/configs/staking/dapps/infrared';
import Bex from '@/configs/swap/bex';
import Kodiak from '@/configs/swap/kodiak';
import Dolomite from '@/configs/lending/dolomite';
import Beraborrow from '@/configs/lending/beraborrow';
import LazyImage from '@/components/layz-image';
import { motion } from 'framer-motion';
import { numberFormatter } from '@/utils/number-formatter';
import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { icons } from '@/configs/chains';
import useIsMobile from '@/hooks/use-isMobile';

const DAPPS = [
  {
    name: Infrared.name,
    icon: Infrared.icon,
    path: Infrared.path,
    bg: "#FFB8B9",
    rotate: 8,
    message: {
      avatar: "/images/vaults/v2/avatar-berahub.png",
      title: "",
      content: "",
    },
  },
  {
    name: "BEX",
    icon: Bex.icon,
    path: Bex.path,
    bg: "#FFF5A9",
    rotate: -6,
    message: {
      avatar: "/images/vaults/v2/avatar-berahub.png",
      avatarCorner: icons[80094],
      name: "Cap’n Jack Bearow",
      title: "Head of DeFi, Berachain Foundation",
      content: "Beratown offers a fun and gamified way to interact with the Berachain app ecosystem in an easy-to-use and abstracted format!",
    },
  },
  {
    name: Dolomite.basic.name,
    icon: Dolomite.basic.icon,
    path: Dolomite.basic.path,
    bg: "#E7FFB8",
    rotate: 0,
    message: {
      avatar: "/images/vaults/v2/avatar-berahub.png",
      title: "",
      content: "",
    },
  },
  {
    name: Beraborrow.basic.name,
    icon: Beraborrow.basic.icon,
    path: Beraborrow.basic.path,
    bg: "#DBECF8",
    rotate: 8,
    message: {
      avatar: "/images/vaults/v2/avatar-berahub.png",
      title: "",
      content: "",
    },
  },
  {
    name: Kodiak.name,
    icon: Kodiak.icon,
    path: Kodiak.path,
    bg: "#FFF5A9",
    rotate: -8,
    message: {
      avatar: "/images/vaults/v2/avatar-berahub.png",
      title: "",
      content: "",
    },
  },
];

const Aggregating = (props: any) => {
  const {} = props;

  return (
    <div className="w-full mt-[20px]">
      <div className="text-[#FFF5A9] text-center text-stroke-1 font-CherryBomb text-[24px] font-normal leading-[90%] flex justify-center items-center gap-[5px]">
        <Description />
        <Tips />
      </div>
      <div className="flex justify-center items-center gap-[10px] text-white font-Montserrat text-[16px] font-[500] leading-[100%] mt-[27px]">
        <div className="shrink-0">
          Aggregating from:
        </div>
        <div className="flex items-center gap-[3px]">
          {
            DAPPS.map((dapp, idx) => (
              <Popover
                key={idx}
                offset={20}
                content={dapp.message.title ? (
                  <div className="w-[300px] bg-[url('/images/vaults/v2/berachain-logo.svg')] bg-no-repeat bg-center bg-[length:169px_82px] pt-[30px] pb-[20px] px-[20px] rotate-[3deg] shrink-0 border border-[#847B36] bg-[#FFF5A9] shadow-[6px_14px_0px_0px_rgba(0,_0,_0,_0.25)] font-Fuzzy text-black text-[15px] font-normal leading-[150%]">
                    <div className="line-clamp-5">
                      '{dapp.message.content}'
                    </div>
                    <div className="w-full flex items-center gap-[15px] mt-[20px]">
                      <div
                        className="relative w-[64px] h-[64px] shrink-0 rounded-full border-[2px] border-black bg-no-repeat bgcenter bg-contain"
                        style={{
                          backgroundImage: `url(${dapp.message.avatar})`,
                        }}
                      >
                        <img
                          src={dapp.message.avatarCorner}
                          alt=""
                          className="w-[26px] h-[26px] rounded-full absolute right-[-10px] bottom-[-5px]"
                        />
                      </div>
                      <div className="flex-1 w-0">
                        <div className="font-[700] text-[16px] line-clamp-1">
                          {dapp.message.name}
                        </div>
                        <div className="text-[12px] line-clamp-2">
                          {dapp.message.title}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
                triggerContainerClassName={clsx("shrink-0 !w-[80px] !h-[80px]", !!dapp.message.title && "cursor-pointer")}
                trigger={PopoverTrigger.Hover}
                placement={PopoverPlacement.BottomLeft}
                closeDelayDuration={0}
              >
                <motion.div
                  key={idx}
                  className="relative flex flex-col justify-center items-center gap-[3px] w-[80px] h-[80px] shrink-0 shadow-[-3px_4px_0px_0px_rgba(0,_0,_0,_0.25)]"
                  style={{
                    background: dapp.bg,
                    zIndex: idx + 1,
                    rotate: dapp.rotate,
                  }}
                  whileHover={{
                    zIndex: 10,
                    scale: 1.1,
                    y: 5,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                >
                  <LazyImage
                    src={dapp.icon}
                    alt={dapp.name}
                    containerClassName="shrink-0 !w-[40px] !h-[40px] rounded-[10px] overflow-hidden"
                    fallbackSrc="/assets/tokens/default_icon.png"
                  />
                  <div className="text-[#060606] text-center font-Montserrat text-[13px] font-bold leading-[100%] whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {dapp.name}
                  </div>
                </motion.div>
              </Popover>
            ))
          }
        </div>
        <div className="flex shrink-0 items-center gap-[5px]">
          and more…
        </div>
      </div>
      <Statistics className="mt-[46px]" />
    </div>
  );
};

export default Aggregating;

export const Statistics = (props: any) => {
  const { className } = props;

  const isMobile = useIsMobile();
  const {
    getTotalStatistics,
    totalStatistics,
    totalStatisticsLoading,
  } = useVaultsV2Context();

  useEffect(() => {
    getTotalStatistics();
  }, []);

  return (
    <div className={clsx("", className)}>
      <div className="text-center text-[#FFF5A9] text-[42px] md:text-[36px] text-stroke-1 font-CherryBomb font-normal leading-[90%]">
        {
          totalStatisticsLoading ? (
            <Skeleton height={38} width={150} borderRadius={6} />
          ) : numberFormatter(totalStatistics?.total_staked_volume, 2, true, { prefix: '$', isShort: isMobile, isShortUppercase: true })
        }
      </div>
      <div className="text-center mt-[8px] text-white font-Montserrat text-[16px] md:text-[12px] font-[500] leading-[100%]">
        Total Staked via Beratown
      </div>
    </div>
  );
};

export const Description = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx("", className)}>
      The best place to access PoL Vaults and earn Berachain yield.
    </div>
  );
};

export const Tips = (props: any) => {
  const { className } = props;

  const isMobile = useIsMobile();

  return (
    <Popover
      content={(
        <Card className="!w-[347px] !bg-[#FFF5A9] !p-[11px_9px_12px_14px] !rounded-[10px] text-black font-Montserrat text-[14px] font-[500] leading-[120%]">
          <strong>Note:</strong> You are directly interacting with all vault and pool protocols themselves. Beratown does not host any smart contracts.
        </Card>
      )}
      trigger={PopoverTrigger.Hover}
      placement={isMobile ? PopoverPlacement.Left : PopoverPlacement.RightTop}
      triggerContainerClassName={clsx("shrink-0 cursor-pointer w-[15px] h-[15px]", className)}
      closeDelayDuration={0}
    >
      <img src="/images/vaults/v2/icon-tips.svg" alt="" className="w-full h-full translate-y-0.5" />
    </Popover>
  );
};
