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

export const Vaults = (props: any) => {
  const { record, index, className } = props;

  return (
    <div className="w-full flex items-center gap-[5px]">
      <div className="flex items-center shrink-0 min-w-[72px]">
        {record.protocolIcon?.map((icon: any, idx: number) => (
          <LazyImage
            key={idx}
            src={icon}
            alt=""
            width={36}
            height={36}
            containerClassName={clsx(
              "shrink-0 rounded-full overflow-hidden",
              idx > 0 && "ml-[-10px]"
            )}
            fallbackSrc="/assets/tokens/default_icon.png"
          />
        ))}
      </div>
      <div className="flex flex-col gap-[1px]">
        <div className="text-[16px] flex items-center gap-[4px] whitespace-nowrap">
          <div className="flex-1">
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
        <div className="text-[12px]">{record.pool_project}</div>
      </div>
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

  return (
    <Popover
      triggerContainerClassName="inline-block"
      content={null}
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Bottom}
      closeDelayDuration={0}
    >
      <button type="button" className="whitespace-nowrap">
        {record.list?.length > 1 ? (
          <>
            {numberFormatter(record.totalApy[0], 2, true, { isShort: true })}% ~{" "}
            {numberFormatter(record.totalApy[1], 2, true, { isShort: true })}%
          </>
        ) : (
          <>
            {numberFormatter(record.totalApy[0], 2, true, { isShort: true })}%
          </>
        )}
      </button>
    </Popover>
  );
};

export const Rewards = (props: any) => {
  const { record } = props;

  const isMobile = useIsMobile();

  if (!record.reward_tokens) return null;

  return (
    <div className="flex items-center gap-[2px] flex-wrap">
      <div className={clsx("flex items-center")}>
        {record.reward_tokens.map((reward: any, index: number) => (
          <div key={index} className="flex items-center gap-[4px]">
            <LazyImage
              src={reward.icon}
              title={reward.symbol}
              alt=""
              width={isMobile ? 18 : 26}
              height={isMobile ? 18 : 26}
              containerClassName={clsx(
                "shrink-0 rounded-full overflow-hidden",
                index > 0 && "ml-[-10px]"
              )}
              fallbackSrc="/assets/tokens/default_icon.png"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const Yours = (props: any) => {
  const { record, index, className } = props;

  return numberFormatter(record.balance, 2, true, {
    prefix: "$",
    isShort: true
  });
};

export const ClaimButton = (props: any) => {
  const { record, index, className, ...restProps } = props;

  const { toggleClaimVisible } = useVaultsV2Context();

  return (
    <button
      type="button"
      {...restProps}
      className={clsx(
        "w-[32px] h-[32px] bg-[url('/images/vaults/v2/claim-square.svg')] bg-[#C1F45C] rounded-[10px] bg-no-repeat bg-center bg-contain disabled:!cursor-not-allowed disabled:opacity-[0.3]",
        className
      )}
      onClick={() => toggleClaimVisible()}
    />
  );
};
