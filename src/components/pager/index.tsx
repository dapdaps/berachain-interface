"use client";
import { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
type PropsType = {
  maxPage: number;
  defaultPage?: number;
  onPageChange: (data: number) => void;
};

export default memo(function Pager({ maxPage, defaultPage = 1, onPageChange }: PropsType) {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const handlePageChange = function (page: number) {
    if (page < 1 || page > maxPage) return;
    setCurrentPage(page);
  };
  useEffect(() => {
    onPageChange?.(currentPage);
  }, [currentPage]);

  const isOverflow = useMemo(() => maxPage > 5, [maxPage]);
  return (
    <div className="flex items-center gap-[10px]">
      {isOverflow && (
        <button
          className={clsx(
            "cursor-pointer rounded-[8px] px-[10px] py-[2px] text-[12px] font-semibold border-black border",
            currentPage === 1 ? "opacity-[0.3]" : "opacity-[1]"
          )}
          onClick={() => {
            handlePageChange(1);
          }}
        >
          First
        </button>
      )}
      <div
        onClick={() => {
          handlePageChange(currentPage - 1);
        }}
        className={clsx(
          "cursor-pointer",
          currentPage === 1 ? "opacity-[0.3]" : "opacity-[1]"
        )}
        style={{
          padding: 5
        }}
      >
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.80005 1L2.00005 7L6.80005 13"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {isOverflow ? (
        <div
          className={clsx(
            "flex",
            "items-center",
            "justify-center",
            "rounded-full",
            "border-black",
            "text-[14px]",
            "text-black"
          )}
        >
          {currentPage}
          {maxPage && ` / ${maxPage}`}
        </div>
      ) : (
        Array(maxPage)
          .fill(null)
          .map((_, index) => (
            <div
              className={clsx(
                "flex",
                "cursor-pointer",
                "items-center",
                "justify-center",
                "w-[32px]",
                "h-[32px]",
                "rounded-full",
                "border-black",
                "text-[14px]",
                "text-black",
                {
                  "bg-[#E9E3B5]": index + 1 === currentPage,
                  border: index + 1 === currentPage
                }
              )}
              onClick={() => {
                handlePageChange(index + 1);
              }}
            >
              {index + 1}
            </div>
          ))
      )}
      <div
        onClick={() => {
          handlePageChange(currentPage + 1);
        }}
        className="cursor-pointer"
        style={{
          padding: 5
        }}
      >
        <svg
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity={currentPage === maxPage ? "0.3" : "1"}
            d="M1.80005 1L6.60005 7L1.80005 13"
            stroke="black"
            stroke-width="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {isOverflow && (
        <button
          className={clsx(
            "cursor-pointer rounded-[8px] px-[10px] py-[2px] text-[12px] font-semibold border-black border",
            currentPage === maxPage ? "opacity-[0.3]" : "opacity-[1]"
          )}
          onClick={() => {
            handlePageChange(maxPage);
          }}
        >
          Last
        </button>
      )}
    </div>
  );
});
