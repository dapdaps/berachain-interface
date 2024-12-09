import TitleIcon from "./components/title-icon";
import { useRouter } from "next-nprogress-bar";
import useEnteranceToken from "./hooks/use-enterance";
import RankMark from "./rank-mark";
import Image from "next/image";
import SwapModal from "@/sections/swap/SwapModal";
import { useState } from "react";

export default function Enterance() {
  const router = useRouter();
  const { token } = useEnteranceToken();
  const [showSwapModal, setShowSwapModal] = useState(false);
  return (
    <>
      <div className="absolute !w-[120px] right-[30px] top-[44px]">
        <TitleIcon
          onClick={() => {
            router.push("/meme/bros");
          }}
          className="!w-[120px] !h-[36px] hover:scale-110 transition-transform duration-500 cursor-pointer"
        />
        {token?.address && (
          <div className="relative text-center mt-[8px] w-[120px] h-[20px] rounded-[18px] border border-black bg-[#FFE5B8]">
            <div className="absolute top-[-4px] shrink-0 w-[26px] h-[26px] rounded-full  border-[2px] border-black">
              <Image
                src={token.logo}
                width={26}
                height={26}
                className="rounded-full rotate-12"
                alt={token.symbol}
              />

              <RankMark
                rank={1}
                className="left-[-2px] top-[4px]"
                iconClassName="scale-50"
              />
            </div>
            <div className="text-[14px] font-bold mt-[-2px] ml-[-8px]">
              {token.symbol}
            </div>
            <button
              onClick={() => {
                setShowSwapModal(true);
              }}
              className="absolute right-[1px] top-[1px] w-[35px] h-[16px] rounded-[18px] border border-black bg-[#FFCC00] text-[12px] font-semibold leading-[14px]"
            >
              Get
            </button>
          </div>
        )}
      </div>
      {token && (
        <SwapModal
          defaultOutputCurrency={token}
          outputCurrencyReadonly={true}
          show={showSwapModal}
          onClose={() => {
            setShowSwapModal(false);
          }}
        />
      )}
    </>
  );
}
