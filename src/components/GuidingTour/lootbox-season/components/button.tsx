import Loading from "@/components/loading";
import clsx from "clsx";

const LootboxSeasonButton = (props: any) => {
  const { className, children, disabled, loading, ...restProps } = props;

  return (
    <button
      type="button"
      className={clsx(
        "relative disabled:opacity-30 disabled:!cursor-not-allowed hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] transition-all duration-150 px-[50px] flex justify-center items-center gap-[5px] text-black text-center font-Montserrat text-[16px] font-bold leading-normal h-[50px] flex-shrink-0 rounded-[10px] border border-black bg-[#FFDC50] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)]",
        className,
      )}
      disabled={disabled}
      {...restProps}
    >
      {
        loading && (
          <Loading size={16} />
        )
      }
      <div className="w-full h-full flex justify-center items-center">
        {children}
      </div>
    </button>
  );
};

export default LootboxSeasonButton;
