import clsx from 'clsx';
import McBeraArrow from '@/sections/home-earth/mc-bera/components/arrow';

const McBeraEntry = (props: any) => {
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

export default McBeraEntry;
