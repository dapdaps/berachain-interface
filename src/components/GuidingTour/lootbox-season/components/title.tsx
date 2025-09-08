import clsx from "clsx";

const LootboxSeasonTitle = (props: any) => {
  const { className, children } = props;

  return (
    <div
      className={clsx(
        "text-[36px] font-CherryBomb text-[#FDD54C] [text-shadow:0_2px_0_#000] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000] font-normal leading-[100%] text-center capitalize",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default LootboxSeasonTitle;
