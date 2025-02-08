import clsx from "clsx";

const Step = (props: any) => {
  const { className, list, spaceClassName } = props;

  return (
    <div
      className={clsx(
        "flex justify-between items-center gap-[10px] pb-[24px]",
        className
      )}
    >
      {list.map((item: any, idx: number) => {
        const isActive =
          idx === 0 ? true : Date.now() > new Date(item.date).getTime();
        const isNextActive =
          idx < list.length - 1
            ? Date.now() > new Date(list[idx + 1].date).getTime()
            : false;

        const icon = !isActive
          ? "/images/ramen/icon-uncheck.svg"
          : isNextActive
          ? "/images/ramen/icon-check.svg"
          : "/images/ramen/icon-current.svg";

        return (
          <>
            <div
              key={idx}
              className={clsx(
                "min-w-[142px] relative flex items-center gap-[8px] text-black text-[18px] font-Montserrat font-[600] leading-[90%] shrink-0",
                !isActive && "opacity-50"
              )}
            >
              <img
                src={icon}
                alt=""
                className="w-[22px] h-[22px] rounded-full shrink-0"
              />
              <div
                className={clsx(list.length > 3 && "max-w-[142px] truncate")}
              >
                {item.label}
              </div>
              <div className="absolute left-0 -bottom-[24px] text-[#3D405A] text-[14px] font-[500] leading-normal whitespace-nowrap">
                {item.date}
              </div>
            </div>
            {idx < list.length - 1 && (
              <div
                className={clsx(
                   "grow border-b border-black min-w-[10px]",
                  !isNextActive && "border-dashed"
                  spaceClassName
                )}
              ></div>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Step;
