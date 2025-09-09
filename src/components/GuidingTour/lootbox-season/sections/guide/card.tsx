import clsx from "clsx";

const LootboxSeasonGuideCard = (props: any) => {
  const { children, className, style } = props;

  return (
    <div
      className={clsx(
        "rounded-[16px] border-2 border-[#E5C375] bg-[#FFF1C7] text-black font-CherryBomb text-[20px] font-normal leading-[120%] pl-[17px] pr-[9px] pt-[11px] pb-[13px]",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default LootboxSeasonGuideCard;
