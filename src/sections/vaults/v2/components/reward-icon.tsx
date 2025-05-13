import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Card from "@/components/card";
import LazyImage from "@/components/layz-image";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { useEffect, useMemo, useRef } from "react";
import DoubleTokenIcons from "@/components/token-icon/double";
import { motion } from "framer-motion";
import { usePriceStore } from '@/stores/usePriceStore';
import Big from 'big.js';

const RewardIcon = (props: any) => {
  const { reward, className, cardClassName } = props;

  const isMobile = useIsMobile();
  const { containerRef } = useVaultsV2Context();

  const popoverRef = useRef<any>();

  useEffect(() => {
    const handleScroll = () => {
      popoverRef.current?.onClose();
    };

    containerRef?.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef?.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Popover
      ref={popoverRef}
      trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
      placement={PopoverPlacement.Bottom}
      content={
        <Card className={clsx("!rounded-[10px] !p-[10px] w-[200px] flex flex-col items-stretch gap-[10px_5px]", cardClassName)}>
          <RewardIconContent reward={reward} />
        </Card>
      }
    >
      {typeof reward.icon === "string" ? (
        <LazyImage
          src={reward.icon}
          width={26}
          height={26}
          containerClassName={clsx(
            "relative shrink-0 rounded-full overflow-hidden cursor-pointer",
            className
          )}
          fallbackSrc="/assets/tokens/default_icon.png"
        />
      ) : (
        <motion.div
          variants={{
            focus: {
              scale: 1.1,
              zIndex: 1
            }
          }}
          whileHover="focus"
          whileTap="focus"
        >
          <DoubleTokenIcons
            size={26}
            icon0={reward.icon[0]}
            icon1={reward.icon[1]}
            className={clsx(
              "relative shrink-0 rounded-full overflow-hidden cursor-pointer",
              className
            )}
          />
        </motion.div>
      )}
    </Popover>
  );
};

export default RewardIcon;

export const RewardIconContent = (props: any) => {
  const { reward, className, isNumber = true, record } = props;

  const { toggleClaimVisible, setCurrentProtocol } = useVaultsV2Context();
  const prices = usePriceStore(store => store.beraTownPrice);

  const rewardUsd = useMemo(() => {
    let price = prices[reward.symbol];
    if (!price) {
      price = prices[reward.address];
    }
    if (!price) return null;
    return numberFormatter(Big(price).times(reward.amount || 0), 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true });
  }, [reward, prices]);

  const [claimRecord, claimToken, claimTokenUsd] = useMemo(() => {
    if (!record) return [];
    let _claimToken: any;
    const _claimRecord = record.list.find((it: any) =>
      it.user_reward?.some((_it: any) => {
        if (_it.address.toLowerCase() === reward.address.toLowerCase()) {
          _claimToken = _it;
          return true;
        }
        return false;
      })
    );
    if (_claimToken) {
      let price = prices[_claimToken.symbol];
      if (!price) {
        price = prices[_claimToken.address];
      }
      if (!price) {
        return [_claimRecord, _claimToken];
      }
      return [_claimRecord, _claimToken, numberFormatter(Big(price).times(_claimToken.amount || 0), 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true })];
    }
    return [_claimRecord, _claimToken];
  }, [record, reward]);

  return (
    <>
      <div
        className={clsx(
          "w-full flex justify-between items-center gap-[10px] text-[#000] font-Montserrat text-[14px] font-[500] leading-[100%]",
          className
        )}
      >
        <div
          className={clsx(
            "flex items-center gap-[5px] flex-1",
            isNumber ? "w-0" : ""
          )}
        >
          {typeof reward.icon === "string" ? (
            <LazyImage
              src={reward.icon}
              width={26}
              height={26}
              containerClassName="shrink-0 rounded-full overflow-hidden"
              fallbackSrc="/assets/tokens/default_icon.png"
            />
          ) : (
            <DoubleTokenIcons
              size={26}
              icon0={reward.icon[0]}
              icon1={reward.icon[1]}
              className="shrink-0 rounded-full overflow-hidden"
            />
          )}
          <a
            href={reward.link}
            target="_blank"
            rel="noreferrer nofollow"
            className={clsx(
              "flex-1 flex items-center",
              isNumber ? "w-0" : ""
            )}
          >
            <div className="whitespace-nowrap overflow-hidden text-ellipsis relative" title={reward.symbol}>
              {reward.symbol}
              <div className="absolute bottom-0 left-0 w-full h-[1px] border-b border-dashed border-black"></div>
            </div>
            <img
              src="/images/vaults/v2/open-link.svg"
              alt=""
              className="w-[20px] h-[20px] object-center object-cover shrink-0"
            />
          </a>
        </div>
        {isNumber && (
          <div className="flex items-center justify-end shrink-0">
            <div className="">
              {numberFormatter(reward.amount, 6, true, {
                isShort: true,
                isShortUppercase: true
              })}{rewardUsd && `(${rewardUsd})`}
            </div>
          </div>
        )}
      </div>
      {claimRecord && claimToken && (
        <div className="flex items-center justify-between gap-[10px] shrink-0">
          <div className="flex items-center justify-end shrink-0 text-[#6CA200] text-[16px] font-[500]">
            +
            {numberFormatter(claimToken.amount, 6, true, {
              isShort: true,
              isShortUppercase: true
            })}{claimTokenUsd && `(${claimTokenUsd})`}
          </div>
          {!["BeraBorrow"].includes(claimRecord.protocol) && (
            <button
              type="button"
              className="shrink-0 w-[53px] h-[25px] rounded-[6px] bg-[#FFDC50] border border-black text-[14px] font-[500] flex justify-center items-center"
              onClick={() => {
                setCurrentProtocol(claimRecord);
                toggleClaimVisible(true, claimRecord.user_reward);
              }}
            >
              Claim
            </button>
          )}
        </div>
      )}
    </>
  );
};
