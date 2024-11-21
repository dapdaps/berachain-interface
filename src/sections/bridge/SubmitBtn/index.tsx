export default function SubmitBtn(props: any) {
  const { comingSoon } = props;
  return (
    <button
      type="button"
      className="w-full h-[60px] flex items-center justify-center border border-[#000000] rounded-[10px] bg-[#FFDC50] text-[18px] font-[600] mt-[16px] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
      disabled={comingSoon}
    >
        {comingSoon ? 'Coming soon...' : 'Bridge'}
    </button>
  );
}