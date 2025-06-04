import clsx from "clsx";

export default function ShadowButton({ children, className, onClick }: any) {
  return (
    <div className={clsx("text-[12px] relative font-semibold", className)}>
      <div
        className={clsx(
          "absolute z-[2] w-full h-full rounded-[6px] flex items-center justify-center border border-[#000000] bg-[#FFDC50]",
          "cursor-pointer duration-300 hover:left-[1px] hover:top-[1px]"
        )}
        onClick={onClick}
      >
        {children}
      </div>
      <div className="absolute z-[1] left-[2px] top-[2px] w-full h-full rounded-[6px] bg-black" />
    </div>
  );
}
