import LazyImage from "@/components/layz-image";
import GoldCoinThrow from "../../../components/gold-coin-throw";
import RankMark from "../../../rank-mark";
import { TOKENS } from "../config";
import { useEffect, useMemo, useState } from "react";

const position = [90, 45, 0, 120, 100, 110];

const Item = ({ token, i, show, onClick }: any) => {
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
          width={100}
          height={100}
          containerClassName="rounded-full ml-[-3px]"
        />
        {i < 3 && <RankMark rank={-i + 3} className="left-[10px] top-[10px]" />}
      </div>
      <div className="relative top-[-2px] bg-[url(/images/meme/brick.png)] bg-cover w-[93px] h-[93px]">
        <div className="text-[20px] text-white text-center font-CherryBomb pt-[6px]">
          {token.symbol}
        </div>
        <div className="mt-[10px] ml-[2px] w-[89px] rounded-[16px] border border-black bg-[#FFDC50] text-center leading-[32px] text-[18px] font-bold">
          28.2%
        </div>
      </div>
      {show && <GoldCoinThrow />}
    </div>
  );
};

export default function Tokens() {
  const tokens = useMemo(() => Object.values(TOKENS), [TOKENS]);
  const [selectToken, setSelectToken] = useState<number>();
  return (
    <div className="mt-[86px] w-[1070px] mx-[auto] flex justify-between gap-[98px]">
      {Object.values(tokens).map((token, i) => (
        <Item
          key={token.address}
          token={token}
          i={i}
          show={i === selectToken}
          onClick={() => {
            setSelectToken(i);
          }}
        />
      ))}
    </div>
  );
}
