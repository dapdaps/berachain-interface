import clsx from "clsx";

const StepVertical = (props: any) => {
  const { className, list } = props;

  return (
    <div
      className={clsx(
        "flex flex-col items-start gap-[56px] pb-[30px]",
        className
      )}
    >
      {list.map((item: any, idx: number) => {
        const isActive = Date.now() < new Date(item.date).getTime();

        const isPrevActive =
          idx < list.length - 1
            ? Date.now() < new Date(list[idx + 1].date).getTime()
            : true;
        return (
          <div
            key={idx}
            className="relative w-full flex justify-between items-start"
          >
            <div className="relative flex items-center gap-[8px] text-black text-[18px] font-Montserrat font-[600] leading-[90%] shrink-0">
              <img
                src={item.icon}
                alt=""
                className={clsx(
                  "w-[22px] h-[22px] rounded-full shrink-0",
                  !isActive && "opacity-50"
                )}
              />
              <div className={clsx(!isActive && "opacity-50")}>
                {item.label}
              </div>
              {idx < list.length - 1 && (
                <div
                  className={clsx(
                    "absolute flex-1 w-[1px] h-[50px] left-[10.5px] top-[25px] border-l border-l-black",
                    !isPrevActive && "border-dashed"
                  )}
                ></div>
              )}
            </div>
            <div
              className={clsx(
                "absolute right-0 flex flex-col items-end gap-[5px] text-black text-[16px] font-[600] leading-[90%] text-right whitespace-nowrap translate-y-[5px]",
                !isActive && "opacity-50"
              )}
            >
              <div className="">{item.value}</div>
              <div className="text-[#3D405A] font-[500] text-[0.75em] leading-normal">
                {item.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepVertical;
