import clsx from "clsx";

export default function Steps({ active, num, className }: any) {
  return (
    <div className={clsx("flex items-center gap-[8px]", className)}>
      {Array.from({ length: num }, (_, i) => i + 1).map((item) => (
        <>
          {item !== 1 && (
            <div
              key={`${item}-line`}
              className="h-[1px] grow bg-[#373A53]/50"
            />
          )}
          <div
            key={`${item}-dot`}
            className={clsx(
              "w-[36px] h-[36px] leading-[36px] shrink-0 text-center rounded-full border text-[16px] font-semibold",
              item <= active ? "border-black bg-[#FFDC50]" : "bg-[#DFDCC4]"
            )}
          >
            {item}
          </div>
        </>
      ))}
    </div>
  );
}
