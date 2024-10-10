import Loading from '@/components/circle-loading';

export default function ({
  loading,
  onClick,
  children,
  disabled = false
}: any) {
  return (
    <button
      onClick={onClick}
      className='h-[60px] w-full duration-500 hover:opacity-70 active:opacity-90 flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] font-[600] mt-[16px] cursor-pointer'
      disabled={disabled}
    >
      {loading ? <Loading /> : children}
    </button>
  );
}
