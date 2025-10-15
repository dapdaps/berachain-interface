import Link from "next/link";

const PartnersMore = (props: any) => {
  const { onClose } = props;

  return (
    <div className="mt-[40px]">
      <div className="font-CherryBomb text-[36px] text-center text-[#FDD54C] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000] font-[400]">
        How to get?
      </div>
      <div className="flex items-start justify-center gap-[20px] mt-[25px]">
        <div className="w-[260px] shrink-0">
          <div className="w-full h-[160px] bg-[url('/images/treasure-book/guess-who-banner2.png')] bg-no-repeat bg-center bg-contain relative">
            <div className="absolute top-[-10px] left-[-15px] w-[65px] flex justify-center h-[65px] text-[36px] font-CherryBomb text-[#FFF4CD] bg-[url('/images/treasure-book/quest-step.png')] bg-no-repeat bg-center bg-contain [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
              1
            </div>
          </div>
          <div className="text-center font-Montserrat text-[18px] font-[700] text-black mt-[15px]">
            <Link
              href="/carnival/guess-who"
              className="block underline underline-offset-[2px] text-[24px]"
              onClick={() => {
                onClose?.();
              }}
            >
              Play ‘Guess Who?’
            </Link>
            and create at least 2.5<br /> Bera games
          </div>
        </div>
        <div className="w-[260px] shrink-0">
          <div className="w-full h-[160px] bg-[url('/images/treasure-book/guess-who-banner.png')] bg-no-repeat bg-center bg-contain relative">
            <div className="absolute top-[-10px] left-[-15px] w-[65px] flex justify-center h-[65px] text-[36px] font-CherryBomb text-[#FFF4CD] bg-[url('/images/treasure-book/quest-step.png')] bg-no-repeat bg-center bg-contain [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#000]">
              2
            </div>
          </div>
          <div className="text-center font-Montserrat text-[18px] font-[700] text-black mt-[15px]">
            <Link
              href="/marketplace"
              className="block underline underline-offset-[2px] text-[24px]"
              onClick={() => {
                onClose?.();
              }}
            >
              ‘Token Marketplace’
            </Link>
            There are three types of boxes for you to purchase
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersMore;
