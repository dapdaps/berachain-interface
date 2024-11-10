import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Dropdown({
  list,
  value,
  onChange,
  title,
  className,
  titleClassName,
  dropPanelClassName
}: any) {
  const [modalShow, setModalShow] = useState(false);
  const domRef = useRef<any>(null);

  const docClick = useCallback((e: any) => {
    const isChild = domRef.current?.contains(e.target);
    if (!isChild) {
      setModalShow(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", docClick, false);

    return () => {
      document.removeEventListener("click", docClick);
    };
  }, []);

  return (
    <div
      ref={domRef}
      onClick={() => {
        setModalShow(true);
      }}
      className={clsx(
        `flex relative justify-between items-center bg-[#fff] gap-8 h-[40px] md:h-[32px] px-[20px] md:px-[12px] text-[14px] font-medium rounded-[12px] border border-[#373A53] cursor-pointer`,
        className
      )}
    >
      <div className={clsx("text-nowrap", titleClassName)}>{title}</div>
      <svg
        width="14"
        height="8"
        viewBox="0 0 14 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 1L7 5.8L1 0.999999"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      {modalShow && (
        <div
          className={clsx(
            "absolute w-[100%] z-[10]  overflow-auto bg-[#FFFDEB] rounded-[8px] border border-[#373A53] right-0",
            dropPanelClassName
          )}
        >
          {list?.map((item: any) => {
            return (
              <div
                key={item.key}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(item);
                  setModalShow(false);
                }}
                className={clsx(
                  "h-[40px] px-[18px]  hover:bg-[#0000000F] relative flex justify-between items-center text-nowrap",
                  item.key === value && "bg-black/10"
                )}
              >
                <div>{item.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
