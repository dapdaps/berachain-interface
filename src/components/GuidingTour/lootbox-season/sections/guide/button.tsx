import clsx from "clsx";

const LootboxSeasonGuideButton = (props: any) => {
  const { children, className, type, ...restProps } = props;

  return (
    <button
      type="button"
      className={clsx(
        "text-black font-Montserrat text-[14px] font-semibold leading-[120%] px-[5px] h-[26px] flex justify-center items-center",
        type === "primary" ? "border border-black rounded-[10px] bg-[#FFDC50]" : "",
        className,
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default LootboxSeasonGuideButton;
