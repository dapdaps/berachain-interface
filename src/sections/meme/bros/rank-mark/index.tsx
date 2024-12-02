import clsx from "clsx";

const COLOR: Record<number, string> = {
  1: "#F86CFF",
  2: "#FFB625",
  3: "#25FFBA"
};

export default function RankMark({ rank, className, iconClassName }: any) {
  return (
    <div
      className={clsx("absolute flex items-center justify-center", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 33 33"
        fill="none"
        className={clsx(
          "absolute z-[1] w-[33px] h-[33px] md:w-[22px] md:h-[22px]",
          iconClassName
        )}
      >
        <path
          d="M2.00232 17.9154L2.00232 17.9154L5.25153 21.1593L5.24777 25.7506C5.24687 26.8564 6.14356 27.7531 7.24941 27.7522L11.8407 27.7485L15.0846 30.9977C15.8659 31.7803 17.1341 31.7803 17.9154 30.9977L21.1593 27.7485L25.7506 27.7522C26.8564 27.7531 27.7531 26.8564 27.7522 25.7506L27.7485 21.1593L30.9977 17.9154C31.7803 17.1341 31.7803 15.8659 30.9977 15.0846L27.7485 11.8407L27.7522 7.24941C27.7531 6.14356 26.8564 5.24687 25.7506 5.24777L21.1593 5.25153L17.9154 2.00232C17.1341 1.21972 15.8659 1.21972 15.0846 2.00232L15.0846 2.00232L11.8407 5.25153L7.24941 5.24777C6.14356 5.24687 5.24687 6.14356 5.24777 7.24941L5.25153 11.8407L2.00232 15.0846L2.00232 15.0846C1.21972 15.8659 1.21972 17.1341 2.00232 17.9154Z"
          fill={COLOR[rank]}
          stroke="black"
          stroke-width="2"
        />
      </svg>
      <span className="absolute z-[2] text-[14px] font-bold md:text-[12px]">
        {rank}
      </span>
    </div>
  );
}
