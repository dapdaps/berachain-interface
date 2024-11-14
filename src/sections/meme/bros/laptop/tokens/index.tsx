import LazyImage from "@/components/layz-image";
import { motion } from "framer-motion";
import { TOKENS } from "../config";
import { useMemo } from "react";

const position = [90, 45, 0, 120, 100, 110];

const Item = ({ token, i }: any) => {
  return (
    <motion.div
      initial={{
        y: position[i]
      }}
      className="cursor-pointer relative"
    >
      <LazyImage
        src={token.icon}
        width={100}
        height={100}
        containerClassName="rounded-full ml-[-3px]"
      />
      <div className="relative top-[-2px] bg-[url(/images/meme/brick.png)] bg-cover w-[93px] h-[93px]">
        <div className="text-[20px] text-white text-center font-CherryBomb pt-[6px]">
          {token.symbol}
        </div>
        <div className="mt-[10px] ml-[2px] w-[89px] rounded-[16px] border border-black bg-[#FFDC50] text-center leading-[32px] text-[18px] font-bold">
          28.2%
        </div>
      </div>
      {i === 2 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="68"
          height="79"
          viewBox="0 0 68 79"
          fill="none"
          className="ml-[8px]"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M61 6H14V39H61V6ZM60.5825 39.3877H6.9903V60.3586H13.9806V66.572H60.5825L60.5825 60.3586L60.5825 60.3584L60.5825 39.3877ZM20.9709 66.5723H53.5922V72.7859H20.9709V66.5723Z"
            fill="#EBF479"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.5243 0H20V5.99029H13.9806H6.99029V12.2039V39.3884L0 39.3883V60.3592H6.99029V66.5728H13.9806V72.7864H20.9709V79H53.5922V72.7864H60.5825V66.5728H67.5728V12.2039H61V6H41V0H36.5049H34H27H22.5243ZM53.5922 33.1748V39.3884H60.5825V66.5728H53.5922V72.7864H20.9709V66.5728H13.9806V60.3592H6.99029V39.3884H10.0971H13.9806H20V40H27V39.3884H34V46H41V39.3884H46.6019V33.1748H53.5922ZM53.5922 33.1748V13H60.5825V33.1748L53.5922 33.1748ZM46.6019 33.1748L41 33.1748V13H46.6019V33.1748ZM27 6.21359H34V33.1748H27V6.21359ZM13.9806 12.2039V33.1748H20V12.2039H13.9806ZM34.1748 46.3786H20.1942V52.5922H34.1748V46.3786Z"
            fill="black"
          />
        </svg>
      )}
    </motion.div>
  );
};

export default function Tokens() {
  const tokens = useMemo(() => Object.values(TOKENS), [TOKENS]);
  return (
    <div className="mt-[116px] w-[1070px] mx-[auto] flex justify-between gap-[98px]">
      {Object.values(tokens).map((token, i) => (
        <Item key={token.address} token={token} i={i} />
      ))}
    </div>
  );
}
