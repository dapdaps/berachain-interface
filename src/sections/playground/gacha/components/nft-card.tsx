"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { playShakeSound } from "../sound";
import NFTDetailModal, { NFTDetailData } from "./nft-detail-modal";
import { getNftImgUrl } from "../config";
import { balanceFormated } from "@/utils/balance";

interface ProbabilityItem {
  percentage: string;
  value: number;
}

interface NFTCardProps {
  title: string;
  address: string;
  floorPrice: string;
  balance?: string;
  tokenIds: string[];
  probabilities: ProbabilityItem[];
  imageUrl: string;
  className?: string;
  total: number;
  rarityRank: Record<string, any>;
}

export default function NFTCard({
  title,
  address,
  floorPrice,
  balance,
  tokenIds,
  rarityRank, 
  probabilities,
  imageUrl,
  className = "",
  total
}: NFTCardProps) {
  const controls = useAnimation();
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const playInitialAnimation = async () => {
      const randomAngle = (Math.random() - 0.5) * 10;
      await controls.start({
        rotate: [0, -3, 3, -3, 3, -2, 2, randomAngle],
        transition: {
          duration: 1.2,
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
          ease: "easeInOut"
        }
      });
      setHasInitialized(true);
    };

    playInitialAnimation();
  }, [controls]);

  const handleClick = async () => {
    playShakeSound();
    const randomAngle = (Math.random() - 0.5) * 10;
    await controls.start({
      rotate: [0, -4, 4, -4, 4, -3, 3, randomAngle],
      transition: {
        duration: 0.6,
        times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        ease: "easeInOut"
      }
    });
  };

  const handleRewardsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailModal(true);
  };

  const getNFTDetailData = (): NFTDetailData => {
    const tokenList = tokenIds.map(tokenId => {
      return {
        tokenId: tokenId.toString(),
        imageUrl: getNftImgUrl(address.toLowerCase(), tokenId),
      }
    });

    return {
      name: title,
      address: address.toLowerCase(),
      imageUrl: imageUrl,
      tokenList,
    };
  };

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="absolute left-1/2 -translate-x-1/2 top-[-25px] z-20">
        <img src="/images/gacha/nail.png" alt="pin" className="w-[43px]" />
      </div>

      <motion.div
        className="relative"
        animate={controls}
        style={{
          transformOrigin: "top center"
        }}
        onClick={handleClick}
      >
        <div className="bg-[#FFE5B8] rounded-[16px] overflow-hidden p-[5px] shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300">
          <div className="flex gap-[10px] pr-[10px]">
            <div className="w-[145px] h-[145px] relative rounded-[16px] overflow-hidden flex-shrink-0">
              <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
            </div>

            <div className="flex flex-col justify-between py-[10px] flex-1">
              <div className="flex gap-[10px] items-center">
                <h3 className="text-[24px] max-w-[155px] font-bold text-black font-CherryBomb whitespace-nowrap overflow-hidden text-ellipsis">
                  {title}
                </h3>
                <a href={`https://magiceden.io/collections/berachain/${address}`} className="mt-[10px]" target="_blank" rel="noopener noreferrer">
                  <svg width="28" height="11" viewBox="0 0 28 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                      <path d="M0 9.65649V1.34355L0.000888622 1.2932C0.0183716 0.774301 0.305042 0.310903 0.739185 0.106813C1.18731 -0.103828 1.70575 0.00263781 2.05597 0.377089L5.46517 4.0222L7.8255 0.537483C8.05463 0.19918 8.41429 4.76554e-05 8.79617 4.76554e-05H14.7867C15.4567 4.76554e-05 15.9999 0.601556 15.9999 1.34355C15.9999 2.08555 15.4567 2.68706 14.7867 2.68706H11.3865L12.7613 4.51404C13.1219 4.99318 13.1373 5.68405 12.7985 6.18227L11.5518 8.01532L14.7736 7.97711C15.4437 7.96916 15.9927 8.56425 15.9999 9.30619C16.0071 10.0481 15.4697 10.6562 14.7997 10.6641L9.11252 10.7315C8.65022 10.737 8.22527 10.4511 8.0167 9.99417C7.80815 9.53728 7.85218 8.98877 8.1303 8.57982L10.2818 5.41622L8.84623 3.50871L6.58202 6.85189C6.37322 7.16018 6.05481 7.35438 5.70791 7.38506C5.36104 7.41573 5.01898 7.27994 4.76864 7.01229L2.42653 4.50814V9.65649C2.42653 10.3985 1.88333 11 1.21326 11C0.543197 11 0 10.3985 0 9.65649Z" fill="#3D405A" />
                      <path d="M19 10L27 2M27 2L21.5 2M27 2V7.5" stroke="#3D405A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                </a>
              </div>


              <div className="text-[14px]">
                {
                  title === 'Mibera Shadow Trait'
                    ?
                    <div className="flex justify-between items-center gap-[10px]">
                      <div className="text-[#3D405A] mb-1">Vending Machine</div>
                      <div className="font-bold text-black">RAFFLE</div>
                    </div>
                    : <div className="flex justify-between items-center gap-[10px]">
                      <div className="text-[#3D405A] mb-1">Floor Price</div>
                      <div className="font-bold text-black">{balanceFormated(floorPrice, 4)} BERA</div>
                    </div>
                }

                {/* NFT Remaining */}
                <div className="flex justify-between items-center gap-[10px]">
                  <div className="text-[#3D405A] mb-1">NFT remaining</div>
                  <div className="font-bold text-black">
                    {balance || "-"}/{total}
                  </div>
                </div>

                {/* Probability */}
                {/* <div className="flex justify-between flex-wrap items-center">
                  <div className="text-[#3D405A] mb-1">Probability</div>
                  <div className="w-full flex gap-[10px] font-bold pl-[10px]">
                    {probabilities.map((prob, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <span className="text-black">{prob.percentage}%</span>
                        <div className="flex items-center gap-1 bg-[#FFC35A] rounded-[10px] px-[5px]">
                          <div className="w-[14px] h-[14px] relative">
                            <img
                              src="/assets/tokens/bera.svg"
                              alt="star"
                              className="w-full h-full"
                            />
                          </div>
                          <span className=" text-black">{prob.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>

              {/* Magic Eden Button */}
              <div className="mt-[2px]">
                {/* <a
                  href={`https://magiceden.io/collections/berachain/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-[8px] bg-[#FFFFFF80] border border-[#E6CC9E] rounded-[8px] px-[12px] py-[2px] hover:bg-[#FFF9ED] transition-colors duration-200"
                >
                  <div className="flex items-center gap-[8px]">
                    <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.000883815 9.60862L0.291001 1.30074L0.293647 1.25046C0.329228 0.732479 0.631897 0.279367 1.0729 0.090553C1.5281 -0.10432 2.04251 0.0201737 2.37945 0.406619L5.65936 4.16849L8.13986 0.768269C8.38066 0.438169 8.74705 0.25171 9.1287 0.265037L15.1155 0.474103C15.7852 0.497488 16.3071 1.11759 16.2812 1.85913C16.2553 2.60068 15.6914 3.18286 15.0218 3.15948L11.6237 3.04081L12.9339 4.91467C13.2776 5.4061 13.2689 6.09708 12.9129 6.58318L11.6029 8.3716L14.8241 8.44585C15.494 8.46129 16.022 9.07517 16.0033 9.81691C15.9846 10.5587 15.4263 11.1476 14.7564 11.1321L9.07033 11.001C8.60813 10.9904 8.19341 10.6898 8.00092 10.2259C7.80843 9.76198 7.87158 9.21534 8.1638 8.81634L10.4244 5.72976L9.05628 3.77331L6.67677 7.03544C6.45734 7.33625 6.13235 7.51921 5.78459 7.53778C5.43685 7.55632 5.09975 7.40867 4.8589 7.13245L2.60561 4.54808L2.42594 9.6933C2.40004 10.4349 1.83618 11.017 1.16652 10.9936C0.496862 10.9703 -0.0250115 10.3502 0.000883815 9.60862Z" fill="#EC136E" />
                    </svg>

                    <span className="text-[14px] font-medium text-[#333333] whitespace-nowrap">
                      View on Magic Eden
                    </span>
                  </div>

                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M3 11L11 3M11 3H6M11 3V8"
                      stroke="#333333"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a> */}
                <div 
                  onClick={handleRewardsClick}
                  className="bg-[#FFFFFF80] text-center cursor-pointer rounded-[8px] px-[12px] py-[5px] text-[12px] border border-[#E6CC9E] font-medium text-[#3D405A] whitespace-nowrap hover:bg-[#FFF9ED] transition-colors duration-200"
                >
                  Rewards Available
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <NFTDetailModal
        visible={showDetailModal}
        address={address.toLowerCase()}
        data={getNFTDetailData()}
        rarityRank={rarityRank}
        onClose={() => setShowDetailModal(false)}
      />
    </div>
  );
}
