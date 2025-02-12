import clsx from 'clsx';
import Loading from '@/components/loading';

const AirdropButton = (props: any) => {
  const { className, disabled, onClick, children, loading } = props;

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx('h-[50px] disabled:opacity-50 disabled:!cursor-not-allowed bg-[#FFDC50] border border-black rounded-[10px] text-[16px] text-black font-[700] leading-[90%] flex justify-center items-center gap-[10px] shadow-[6px_6px_0px_0px_rgba(0,_0,_0,_0.25)]', className)}
      onClick={onClick}
    >
      {loading && (<Loading size={16} />)}{children}
    </button>
  );
};

export default AirdropButton;
