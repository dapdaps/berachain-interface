import React from 'react';

export const PageButton = (props: PageButtonProps) => {
  const {
    page,
    pageIndex,
    className,
    style,
    onPage,
  } = props;

  const handleClick = () => {
    if (typeof page !== 'number' || page === pageIndex) return;
    onPage(page);
  };

  const pageItemStyles = 'w-[32px] h-[32px] rounded-full leading-[30px] cursor-pointer text-[14px] font-light text-center border transition-all duration-300';
  const pageItemActiveStyles = 'bg-[#E9E3B5] border-black border';
  const pageItemInActiveStyles = 'text-black border-0';

  return (
    <div
      className={`page-${page} ${pageItemStyles} ${pageIndex === page ? pageItemActiveStyles : pageItemInActiveStyles} ${className}`}
      style={style}
      onClick={handleClick}
    >
      {page}
    </div>
  );
};

interface PageButtonProps {
  page: number | string;
  pageIndex: number;
  className?: string;
  style?: React.CSSProperties;

  onPage(page: number): void;
}
