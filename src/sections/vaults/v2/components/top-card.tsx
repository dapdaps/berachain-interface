import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { numberFormatter } from "@/utils/number-formatter";
import { ACTION_TYPE } from "../config";

const TopCard = (props: any) => {
  const { className, type, pool } = props;

  const currType = cardType[type as CardType] ?? cardType[CardType.TopAPR];

  const { toggleStrategyVisible, toggleActionVisible, listLoading } =
    useVaultsV2Context();

  return (
    <div
      className={clsx(
        "rounded-[14px] p-[19px_20px_20px] h-[152px] shadow-[6px_6px_0px_rgba(0,_0,_0,_0.25)]",
        className
      )}
      style={{
        backgroundColor: currType.bg
      }}
    >
      <div className="text-[#FFF5A9] text-stroke-1 font-CherryBomb text-[18px] not-italic font-normal leading-[90%]">
        {currType.title}
      </div>
      <div
        className="text-[#000] font-CherryBomb text-[26px] not-italic font-normal leading-[90%] mt-[14px]"
        style={{
          lineHeight: "23.4px"
        }}
      >
        <div className="flex items-center gap-[4px]">
          <span>
            {type === CardType.TopAPR ? (
              <>
                {numberFormatter(pool?.[currType.dataIndex]?.[0], 2, true, {
                  isShort: true,
                  isShortUppercase: true
                })}
                ~
                {numberFormatter(pool?.[currType.dataIndex]?.[1], 2, true, {
                  isShort: true,
                  isShortUppercase: true
                })}
              </>
            ) : (
              <>
                {numberFormatter(pool?.[currType.dataIndex], 2, true, {
                  isShort: true,
                  isShortUppercase: true,
                  prefix: type === CardType.HotVault ? "$" : ""
                })}
              </>
            )}
            {currType.dataIndex === "totalApy" ? "%" : ""}
          </span>
          <div
            className="text-[16px] font-normal px-[4px] rounded-[6px] leading-[16px] self-end"
            style={{
              backgroundColor: currType.unitBg
            }}
          >
            {currType.unit}
          </div>
          {/*<span>+ 0.16%</span>
           <div className="text-[16px] font-normal px-[4px] bg-[#FFF5A9] rounded-[6px] leading-[16px] self-end">
           Boost
           </div>*/}
        </div>
      </div>
      <div className="flex justify-between items-center gap-[10px] mt-[24px]">
        <div className="flex items-center gap-[2px]">
          <div className="flex items-center">
            {pool?.[type === CardType.HotStrategy ? "tokens" : "list"]?.map(
              (protocol: any, idx: number) => (
                <LazyImage
                  src={
                    type === CardType.HotStrategy
                      ? protocol.icon
                      : protocol.protocolIcon
                  }
                  width={36}
                  height={36}
                  containerClassName={clsx(
                    "shrink-0 rounded-full overflow-hidden",
                    idx !== 0 && "ml-[-10px]"
                  )}
                  fallbackSrc="/assets/tokens/default_icon.png"
                />
              )
            )}
          </div>
          <div className="text-[#000] font-Montserrat text-[16px] not-italic font-medium leading-[100%]">
            {pool?.tokens?.map((token: any) => token.symbol)?.join("-") || "-"}
          </div>
        </div>
        <button
          type="button"
          disabled={listLoading}
          className="h-[36px] px-[19px] disabled:opacity-30 disabled:!cursor-not-allowed flex-shrink-0 rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[14px] font-normal font-medium leading-[100%]"
          onClick={() => {
            if (type === 2) {
              toggleStrategyVisible(true);
            } else {
              toggleActionVisible({
                visible: true,
                type: ACTION_TYPE.DEPOSIT,
                record: pool
              });
            }
          }}
        >
          {currType.button}
        </button>
      </div>
    </div>
  );
};

export default TopCard;

export enum CardType {
  TopAPR,
  HotVault,
  HotStrategy
}

export const cardType: Record<CardType, any> = {
  [CardType.TopAPR]: {
    bg: "#CFFFBE",
    title: "Top APR",
    button: "Deposit",
    unit: "APR",
    unitBg: "#B8FF2B",
    dataIndex: "totalApy"
  },
  [CardType.HotVault]: {
    bg: "#FFB8B9",
    title: "Hot Vault",
    button: "Deposit",
    unit: "TVL",
    unitBg: "#FF58B7",
    dataIndex: "tvl"
  },
  [CardType.HotStrategy]: {
    bg: "#B0A9FF",
    title: "Hot Strategy",
    button: "Strategy",
    unit: "APR",
    unitBg: "#B8FF2B",
    dataIndex: "totalApy"
  }
};
