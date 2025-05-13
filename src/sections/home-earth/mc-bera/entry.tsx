import clsx from 'clsx';
import McBeraArrow from '@/sections/home-earth/mc-bera/components/arrow';
import ReactDOM from 'react-dom';
import React from 'react';

const McBeraEntry = (props: any) => {
  const { isRoot } = props;

  if (isRoot) {
    return ReactDOM.createPortal(
      (
        <McBeraEntryContent {...props} />
      ) as any,
      document.body
    ) as unknown as React.ReactPortal;
  }

  return (
    <McBeraEntryContent {...props} />
  );
};

export default McBeraEntry;

const McBeraEntryContent = (props: any) => {
  const { className, isOpen = true } = props;

  const onOpenMcBera = () => {
    window.scrollTo({
      top: isOpen ? document.documentElement.scrollHeight : 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      type="button"
      className={clsx('absolute z-[5] bottom-[15px] left-1/2 -translate-x-1/2 w-[227px] h-9 flex-shrink-0 text-black text-center font-CherryBomb flex items-center justify-center text-lg font-normal leading-[90%] rounded-[10px] bg-white/80 backdrop-blur-sm', className)}
      onClick={onOpenMcBera}
    >
      <div className="">
        {isOpen ? "Walk to Home" : "Walk in Beratown"}
      </div>
      <McBeraArrow className={clsx("absolute right-[12px]", isOpen ? "rotate-0" : "rotate-180")} />
    </button>
  );
};
