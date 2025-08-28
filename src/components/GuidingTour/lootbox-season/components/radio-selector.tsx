import clsx from "clsx";

const LootboxSeasonRadioSelector = (props: any) => {
  const { className, children, onClick, description, selected } = props;

  return (
    <button
      type="button"
      className={clsx(
        "w-full pl-[17px] pr-[19px] whitespace-nowrap flex justify-between items-center gap-[10px] h-[60px] flex-shrink-0 rounded-[12px] bg-[#EFEDD8] text-[#000] text-right font-Montserrat text-[16px] font-medium leading-[150%]",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-[10px] flex-1 w-0 font-CherryBomb text-[20px] font-[400] leading-[120%]">
        <div className="w-[26px] h-[26px] p-[3px] shrink-0 bg-white rounded-full overflow-hidden border border-black">
          {
            selected && (
              <div className="w-full h-full rounded-full border border-black bg-[#FFDC50]"></div>
            )
          }
        </div>
        <div className="flex-1 w-0 overflow-hidden text-ellipsis text-left">
          {children}
        </div>
      </div>
      <div className="shrink-0 text-right overflow-hidden text-ellipsis">
        {description}
      </div>
    </button>
  );
};

export default LootboxSeasonRadioSelector;
