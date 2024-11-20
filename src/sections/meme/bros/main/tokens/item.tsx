import useIsMobile from "@/hooks/use-isMobile";
import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import GoldCoinThrow from "../../components/gold-coin-throw";
import RankMark from "../../rank-mark";

const position = [90, 45, 10, 120, 100, 110];

export default function Item({ token, i, show, onClick }: any) {
  const isMobile = useIsMobile();
  return (
    <div
      className="cursor-pointer relative origin-bottom duration-100"
      style={{
        transform: `translateY(${show ? position[i] - 40 : position[i]}px)`
      }}
      onClick={(ev) => {
        onClick(i);
      }}
    >
      <div className="relative">
        <LazyImage
          src={token.icon}
          width={isMobile ? 60 : 100}
          height={isMobile ? 60 : 100}
          containerClassName="rounded-full ml-[-3px]"
        />
        {i < 3 && (
          <RankMark
            rank={-i + 3}
            className="left-[10px] top-[10px] md:left-[6px] md:top-[6px]"
          />
        )}
      </div>
      <div className="relative top-[-2px] bg-[url(/images/meme/brick.png)] bg-cover w-[93px] h-[93px] md:w-[56px] md:h-[56px]">
        <div
          className={clsx(
            "text-[20px] text-white text-center font-CherryBomb pt-[6px]",
            "md:text-[16px] md:text-black md:rounded-[12px] md:border md:border-black md:bg-[#FFDC50] md:leading-[24px] md:w-[76px] md:pt-0 md:relative md:left-[-10px] md:top-[-10px]"
          )}
        >
          {token.symbol}
        </div>
        <div className="md:hidden mt-[10px] ml-[2px] w-[89px] rounded-[16px] border border-black bg-[#FFDC50] text-center leading-[32px] text-[18px] font-bold">
          28.2%
        </div>
      </div>
      {show && <GoldCoinThrow />}
    </div>
  );
}
