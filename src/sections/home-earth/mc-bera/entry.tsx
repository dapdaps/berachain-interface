import clsx from 'clsx';
import McBeraArrow from '@/sections/home-earth/mc-bera/components/arrow';

const McBeraEntry = (props: any) => {
  const { className } = props;

  return (
    <button
      type="button"
      className={clsx('absolute z-[5] bottom-[15px] left-1/2 -translate-x-1/2 w-[227px] h-9 flex-shrink-0 text-black text-center font-CherryBomb flex items-center justify-center text-lg font-normal leading-[90%] rounded-[10px] bg-white/80 backdrop-blur-sm', className)}
    >
      <div className="">
        Walk to Home
      </div>
      <McBeraArrow className="absolute right-[12px]" />
    </button>
  );
};

export default McBeraEntry;
