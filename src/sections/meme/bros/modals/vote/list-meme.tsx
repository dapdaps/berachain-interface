import useIsMobile from '@/hooks/use-isMobile';

const VoteListMeme = (props: any) => {
  const {} = props;

  const isMobile = useIsMobile();

  return (
    <button
      type="button"
      className="h-[36px] md:w-full leading-[34px] px-[27px] rounded-[10px] border border-black bg-[#FFDC50] text-center text-black text-[14px] font-[600]"
    >
      {isMobile ? '+' : ''} List Meme
    </button>
  );
};

export default VoteListMeme;
