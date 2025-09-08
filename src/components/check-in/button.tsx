import clsx from "clsx";

const LightButton = (props: any) => {
  const { className, innerClassName, children, ...restProps } = props;

  return (
    <button
      type="button"
      className={clsx(
        "disabled:opacity-30 disabled:!cursor-not-allowed hover:scale-[1.02] hover:disabled:scale-100 transition-scale duration-150 h-[52px] p-[2px] shrink-0 rounded-[16px] border-[2px] border-[#4B371F] bg-[#FFB050] text-[#F7F9EA] text-center font-CherryBomb text-[20px] font-[400] leading-[20px] tracking-[2px] uppercase [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F]",
        className
      )}
      {...restProps}
    >
      <div className={clsx("relative w-full h-full px-[24px] flex justify-center items-center gap-[5px] rounded-[12px] border-[2px] border-[#AF7026] bg-[#FFCF23]", innerClassName)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="12"
          viewBox="0 0 56 12"
          fill="none"
          className="absolute left-[2px] top-[2px]"
        >
          <path d="M2 10.4863C2 5.98633 3.5 1.98633 11.5 1.98633M18 1.98633H54" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {children}
      </div>
    </button>
  );
};

export default LightButton;
