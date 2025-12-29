import { useMemo, useState } from "react";
import { NFTCollectionWithStatus } from "../types";
import Big from "big.js";
import Link from "next/link";
import MintDetailCard from "../components/MintDetailCard";

interface NextStepProps {
  item: NFTCollectionWithStatus;
  onBack: () => void;
}

const shortenAddress = (address: string) => {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const NextStep: React.FC<NextStepProps> = ({ item, onBack }) => {
  const mintedPercent = useMemo(() => {
    return Big(item.totalSupplyByContract || 0).div(item.maxSupplyByContract || 0).mul(100).toFixed(2);
  }, [item])

  return (
    <div className="w-full md:h-[60dvh] md:overflow-y-auto">
      <div className="px-[20px] py-[24px] flex md:flex-col lg:flex-row gap-[15px] bg-[#FFDC50] rounded-[10px] mb-[14px]">
        <svg
          onClick={onBack}
          className="md:w-[24px] md:h-[24px] lg:w-[34px] lg:h-[34px] shrink-0"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="33"
            height="33"
            rx="10.5"
            fill="white"
            stroke="#373A53"
          />
          <path
            d="M20 11L15.2 17L20 23"
            stroke="black"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
        <div className="flex flex-col w-full">
          <div className="font-Montserrat font-bold md:text-[16px] lg:text-[20px] mb-[15px]">
            {item.collection_name}
          </div>
          <div className="w-full flex md:flex-col lg:flex-row lg:justify-between md:gap-[15px]">
            <div className="lg:w-[534px] md:w-full font-Montserrat text-[14px] text-left mb-[20px]">
              <span dangerouslySetInnerHTML={{ __html: item.description }} />
            </div>
            <div className="md:self-start lg:self-end mb-[20px]">
              <div>Chain</div>
              <img
                src="/images/dapps/berachain.png"
                className="w-[20px] h-[20px] rounded-3xl"
                alt=""
              />
            </div>
          </div>
          <div className="flex md:flex-col lg:flex-row justify-between w-full md:gap-[15px]">
            <div className="lg:w-[528px] md:w-full">
              <div className="flex justify-between mb-[15px] font-Montserrat text-black font-[600]">
                <span>{mintedPercent}% Minted</span>
                <span>{item.totalSupplyByContract}/{item.maxSupplyByContract}</span>
              </div>
              <div className="relative w-full h-3 bg-white border border-[#373A53] rounded-full p-[1px]">
                <div
                  className="absolute left-[2px] top-1/2 -translate-y-1/2 h-2 bg-[#FFDC50] rounded-full"
                  style={{ width: `${mintedPercent}%` }}
                >
                    {
                        Number(mintedPercent) > 0 && Number(mintedPercent) < 100 && (
                            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-[#FFDC50] rounded-full border border-[#373A53]"></div>
                        )
                    }
                </div>
              </div>
            </div>
            <div className="text-right font-Montserrat text-black leading-[24px]">
              <div className="font-[14px]">Contract Address</div>
              <Link className="font-[600] md:text-[14px] lg:text-[18px] underline" href={`https://bartio.beratrail.io/address/${item.contract_address}`} target="_blank">
                {shortenAddress(item.contract_address)}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <MintDetailCard item={item} />
    </div>
  );
};

export default NextStep;
