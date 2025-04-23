import LazyImage from "@/components/layz-image";
import clsx from "clsx";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import Card from "@/components/card";
import useIsMobile from "@/hooks/use-isMobile";
import Link from "next/link";
import { RewardIconContent } from "@/sections/vaults/v2/components/reward-icon";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { uniq } from "lodash";
import DoubleTokenIcons from "@/components/token-icon/double";

export const Pool = (props: any) => {
  const { record, className } = props;

  return (
    <div className={clsx("flex flex-col gap-[1px] items-stretch", className)}>
      <div className="text-[16px] flex items-center gap-[4px] whitespace-nowrap w-full">
        <div className="overflow-hidden text-ellipsis">
          {record.tokens.map((tk: any) => tk.symbol).join("-")}
        </div>
        {record.reward_tokens?.some((tk: any) =>
          ["BGT"].includes(tk.symbol?.toUpperCase?.())
        ) && (
          <Link
            href="/hall?from=vaults"
            className="w-[20px] h-[20px] block shrink-0 bg-no-repeat bg-center bg-contain"
            style={{
              backgroundImage: 'url("/images/vaults/v2/hub.png")'
            }}
          />
        )}
      </div>
      <div
        className="text-[12px] truncate"
        title={uniq(record.list.map((p: any) => p.pool_project)).join("/")}
      >
        {uniq(record.list.map((p: any) => p.pool_project)).join("/")}
      </div>
    </div>
  );
};

export const Vaults = (props: any) => {
  const { record, index, className, isPool } = props;

  return (
    <div className={clsx("w-full flex items-center gap-[5px]", className)}>
      <div className="flex items-center shrink-0 min-w-[70px]">
        {record.protocolIcon?.map((icon: any, idx: number) => (
          <LazyImage
            key={idx}
            src={icon}
            alt=""
            width={26}
            height={26}
            containerClassName={clsx(
              "shrink-0 overflow-hidden rounded-[8px] border border-[#FFFDEB]",
              idx > 0 && "ml-[-6px]"
            )}
            fallbackSrc="/assets/tokens/default_icon.png"
          />
        ))}
      </div>
      {isPool && <Pool record={record} className="flex-1 w-0" />}
    </div>
  );
};

export const DepositButton = (props: any) => {
  const { record, index, className, ...restProps } = props;

  const { toggleActionVisible } = useVaultsV2Context();

  return (
    <button
      type="button"
      className="shrink-0 w-[32px] h-[32px] bg-white rounded-[10px] bg-[url('/images/vaults/v2/deposit.svg')] bg-no-repeat bg-center bg-contain disabled:!cursor-not-allowed disabled:opacity-[0.3]"
      {...restProps}
      onClick={() => {
        toggleActionVisible({
          type: ACTION_TYPE.DEPOSIT,
          record,
          visible: true
        });
      }}
    />
  );
};

export const WithdrawButton = (props: any) => {
  const { record, index, className, ...restProps } = props;

  const { toggleActionVisible } = useVaultsV2Context();

  return (
    <button
      type="button"
      {...restProps}
      disabled={
        record?.protocol === "Slimee" || Big(record?.balance || 0).lte(0)
      }
      className="w-[32px] h-[32px] bg-[url('/images/vaults/v2/withdraw.svg')] bg-no-repeat bg-center bg-contain disabled:!cursor-not-allowed disabled:opacity-[0.3]"
      onClick={() => {
        if (record.protocol === "Slimee") return;
        toggleActionVisible({
          type: ACTION_TYPE.WITHDRAW,
          record,
          visible: true
        });
      }}
    />
  );
};

export const TVL = (props: any) => {
  const { record, index, className } = props;

  return numberFormatter(record.tvl, 2, true, {
    prefix: "$",
    isShort: true,
    isShortUppercase: true
  });
};

export const APYContent = (props: any) => {
  const { record, className } = props;

  return (
    <Card
      className={clsx(
        "!rounded-[10px] !bg-white !p-[18px_14px] !text-[14px] font-[500]",
        className
      )}
    >
      <div className="w-full flex flex-col gap-[20px]">
        <div className="w-full flex justify-between items-center gap-[10px]">
          <div className="">Pool APR</div>
          <div className="">{numberFormatter(record.apy, 6, true)}%</div>
        </div>
        {record.apr &&
          Object.keys(record.apr)
            .filter((ak) => ak !== "pool")
            .map((ak: any, idx: number) => (
              <div
                key={idx}
                className="w-full flex justify-between items-center gap-[5px]"
              >
                <div className="">
                  {ak.slice(0, 1).toUpperCase() + ak.slice(1)} APR
                </div>
                <div className="">
                  {numberFormatter(record.apr[ak], 6, true)}%
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
};

export const APY = (props: any) => {
  const { record, index, className } = props;

  const popoverRef1 = useRef<any>();
  const popoverRef2 = useRef<any>();
  const popoverRef3 = useRef<any>();
  const isMobile = useIsMobile();
  const { containerRef } = useVaultsV2Context();

  useEffect(() => {
    const handleScroll = () => {
      popoverRef1.current?.onClose();
      popoverRef2.current?.onClose();
      popoverRef3.current?.onClose();
    };

    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className="whitespace-nowrap flex items-center gap-[2px]"
    >
      {record.list?.length > 1 ? (
        <>
          <Popover
            ref={popoverRef1}
            triggerContainerClassName="inline-block"
            content={<APYContent record={record.totalApyList[0]} />}
            trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
            placement={PopoverPlacement.Bottom}
            closeDelayDuration={0}
            onClickBefore={(e) => {
              e.stopPropagation();
              return true;
            }}
          >
            <div className="underline decoration-dashed underline-offset-4">
              {numberFormatter(record.totalApy[0], 2, true, { isShort: true })}%
            </div>
          </Popover>
          <div className="">~</div>
          <Popover
            ref={popoverRef2}
            triggerContainerClassName="inline-block"
            content={<APYContent record={record.totalApyList[1]} />}
            trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
            placement={PopoverPlacement.Bottom}
            closeDelayDuration={0}
            onClickBefore={(e) => {
              e.stopPropagation();
              return true;
            }}
          >
            <div className="underline decoration-dashed underline-offset-4">
              {numberFormatter(record.totalApy[1], 2, true, { isShort: true })}%
            </div>
          </Popover>
        </>
      ) : (
        <Popover
          ref={popoverRef3}
          triggerContainerClassName="inline-block"
          content={<APYContent record={record.totalApyList[0]} />}
          trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
          placement={PopoverPlacement.Bottom}
          closeDelayDuration={0}
          onClickBefore={(e) => {
            e.stopPropagation();
            return true;
          }}
        >
          <div className="underline decoration-dashed underline-offset-4">
            {numberFormatter(record.totalApy[0], 2, true, { isShort: true })}%
          </div>
        </Popover>
      )}
    </button>
  );
};

export const Rewards = (props: any) => {
  const { record } = props;

  const { containerRef } = useVaultsV2Context();
  const isMobile = useIsMobile();
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

  if (!record.reward_tokens) return null;

  return (
    <div className="flex items-center gap-[2px] flex-wrap">
      <div className={clsx("flex items-center")}>
        {record.reward_tokens.map((reward: any, index: number) => (
          <Popover
            ref={popoverRef}
            key={index}
            trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
            placement={PopoverPlacement.Top}
            content={
              <Card className="!rounded-[10px] !bg-white !p-[5px_10px] w-[200px] flex flex-col items-stretch gap-[10px_5px] max-h-[150px] overflow-y-auto">
                <RewardIconContent
                  reward={reward}
                  record={record}
                  className=""
                  isNumber={false}
                />
              </Card>
            }
            onClickBefore={(e) => {
              e.stopPropagation();
              return true;
            }}
          >
            <motion.div
              key={index}
              className="relative flex items-center gap-[4px]"
              whileHover={{ scale: 1.1, zIndex: 1 }}
            >
              {typeof reward.icon === "string" ? (
                <LazyImage
                  src={reward.icon}
                  alt=""
                  width={isMobile ? 18 : 26}
                  height={isMobile ? 18 : 26}
                  containerClassName={clsx(
                    "shrink-0 rounded-full overflow-hidden",
                    index > 0 && "ml-[-10px]"
                  )}
                  fallbackSrc="/assets/tokens/default_icon.png"
                />
              ) : (
                <DoubleTokenIcons
                  size={isMobile ? 18 : 26}
                  icon0={reward.icon[0]}
                  icon1={reward.icon[1]}
                  className={clsx(
                    "shrink-0 rounded-full overflow-hidden",
                    index > 0 && "ml-[-10px]"
                  )}
                />
              )}
            </motion.div>
          </Popover>
        ))}
      </div>
    </div>
  );
};

export const Yours = (props: any) => {
  const { record, index, className } = props;

  const isMobile = useIsMobile();
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
    <Popover
      ref={popoverRef}
      content={
        Big(record.balance || 0).gt(0) ? (
          <Card className="!rounded-[10px] !bg-white !p-[5px_10px] !text-[14px] font-[500] whitespace-nowrap flex items-center">
            {record.list
              ?.filter((protocol: any) => Big(protocol.balance || 0).gt(0))
              ?.map((protocol: any, index: number) => (
                <div
                  className="text-[14px] font-[500] leading-normal font-[Montserrat] text-[#000]"
                  key={index}
                >
                  {index > 0 && <>&nbsp;+&nbsp;</>}
                  {numberFormatter(protocol.balance, 2, true, {
                    prefix: "$",
                    isShort: true
                  })}
                </div>
              ))}
          </Card>
        ) : null
      }
      trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      onClickBefore={(e) => {
        e.stopPropagation();
        return true;
      }}
    >
      <div
        className={clsx(
          "",
          Big(record.balance || 0).gt(0)
            ? "opacity-100 underline decoration-dashed underline-offset-4 cursor-pointer"
            : "opacity-30"
        )}
      >
        {numberFormatter(record.balance, 2, true, {
          prefix: "$",
          isShort: true
        })}
      </div>
    </Popover>
  );
};
