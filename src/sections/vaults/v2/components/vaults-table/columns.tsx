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

export const Vaults = (props: any) => {
  const { record, index, className } = props;

  return (
    <div className="w-full flex items-center gap-[5px]">
      <div className="flex items-center shrink-0 min-w-[52px]">
        {record.tokens.map((tk: any, idx: number) => (
          <LazyImage
            key={idx}
            src={tk.icon}
            alt=""
            width={26}
            height={26}
            containerClassName="shrink-0 rounded-full overflow-hidden"
            containerStyle={{
              transform: idx > 0 ? "translateX(-6px)" : ""
            }}
            fallbackSrc="/assets/tokens/default_icon.png"
          />
        ))}
      </div>
      <div className="flex flex-col gap-[1px]">
        <div className="text-[16px] flex items-center gap-[4px]">
          <div className="flex-1">
            {record.tokens.map((tk: any) => tk.symbol).join("-")}
          </div>
          {record.nameIcon && (
            <LazyImage
              src={record.nameIcon}
              width={20}
              height={20}
              containerClassName="shrink-0"
              fallbackSrc="/assets/tokens/default_icon.png"
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
      disabled={record.protocol === "Slimee"}
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

export const APY = (props: any) => {
  const { record, index, className } = props;

  return (
    <Popover
      triggerContainerClassName="inline-block"
      content={
        <Card className="!rounded-[10px] !bg-white !p-[18px_14px] !text-[14px] font-[500]">
          <div className="w-full flex flex-col gap-[20px]">
            <div className="w-full flex justify-between items-center gap-[10px]">
              <div className="">Pool APY</div>
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
                      {ak.slice(0, 1).toUpperCase() + ak.slice(1)} APY
                    </div>
                    <div className="">
                      {numberFormatter(record.apr[ak], 6, true)}%
                    </div>
                  </div>
                ))}
          </div>
        </Card>
      }
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Bottom}
      closeDelayDuration={0}
    >
      <button
        type="button"
        className="underline decoration-dashed underline-offset-4"
      >
        {numberFormatter(record.totalApy, 2, true)}%
      </button>
    </Popover>
  );
};

export const Rewards = (props: any) => {
  const { record, index, className, isClaim = true } = props;

  const { toggleClaimVisible } = useVaultsV2Context();
  const isMobile = useIsMobile();

  if (!record.reward_tokens) return null;

  return (
    <div className="flex items-center gap-[2px] flex-wrap">
      <div className="flex items-center">
        {record.reward_tokens.map((reward: any, idx: number) => (
          <LazyImage
            key={idx}
            src={reward.icon}
            alt=""
            width={isMobile ? 18 : 26}
            height={isMobile ? 18 : 26}
            containerClassName="shrink-0 rounded-full overflow-hidden"
            containerStyle={{
              transform: idx > 0 ? "translateX(-6px)" : ""
            }}
            fallbackSrc="/assets/tokens/default_icon.png"
          />
        ))}
      </div>
      {isClaim &&
        record.user_reward.map((reward: any, idx: number) => {
          if (!reward.amount) return null;
          return (
            <div
              key={idx}
              className="text-[#6CA200] font-[500] text-[16px] flex items-center gap-[4px]"
            >
              <div className="">
                +
                {numberFormatter(reward.amount, 2, true, {
                  // prefix: "$",
                  isShort: true
                })}
              </div>
              <Popover
                triggerContainerClassName="inline-block"
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
                  className="shrink-0 w-[21px] h-[21px] rounded-full bg-[url('/images/vaults/v2/claim.svg')] bg-no-repeat bg-center bg-contain"
                  onClick={() => toggleClaimVisible(true, record, reward)}
                />
              </Popover>
            </div>
          );
        })}
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
