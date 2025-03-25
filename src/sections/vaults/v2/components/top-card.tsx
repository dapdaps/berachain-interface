import clsx from 'clsx';
import LazyImage from '@/components/layz-image';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';

const TopCard = (props: any) => {
  const { className, type } = props;

  const currType = cardType[type as CardType] ?? cardType[CardType.TopAPR];

  const {
    toggleActionVisible,
  } = useVaultsV2Context();

  return (
    <div
      className={clsx("rounded-[14px] p-[19px_20px_20px] h-[152px]", className)}
      style={{
        backgroundColor: currType.bg,
      }}
    >
      <div className="text-[#FFF5A9] text-stroke-1 font-CherryBomb text-[18px] not-italic font-normal leading-[90%]">
        {currType.title}
      </div>
      <div
        className="text-[#000] font-CherryBomb text-[26px] not-italic font-normal leading-[90%] mt-[14px]"
        style={{
          lineHeight: '23.4px',
        }}
      >
        380.94%
      </div>
      <div className="flex justify-between items-center gap-[10px] mt-[24px]">
        <div className="flex items-center gap-[2px]">
          <div className="flex items-center">
            <LazyImage src="/images/icon-coin.svg" width={36} height={36} containerClassName="shrink-0 rounded-full overflow-hidden" />
            <LazyImage src="/images/icon-coin.svg" width={36} height={36} containerClassName="shrink-0 rounded-full overflow-hidden translate-x-[-10px]" />
          </div>
          <div className="text-[#000] font-Montserrat text-[16px] not-italic font-medium leading-[100%]">
            NECT-BERA
          </div>
        </div>
        <button
          type="button"
          className="h-[36px] px-[19px] disabled:opacity-30 disabled:!cursor-not-allowed flex-shrink-0 rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[14px] font-normal font-medium leading-[100%]"
          onClick={() => {
            toggleActionVisible({
              type: ACTION_TYPE.DEPOSIT
            });
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
  HotStrategy,
}

export const cardType: Record<CardType, any> = {
  [CardType.TopAPR]: {
    bg: "#CFFFBE",
    title: "Top APR",
    button: "Deposit",
  },
  [CardType.HotVault]: {
    bg: "#FFB8B9",
    title: "Hot Vault",
    button: "Deposit",
  },
  [CardType.HotStrategy]: {
    bg: "#B0A9FF",
    title: "Hot Strategy",
    button: "Strategy",
  },
};
