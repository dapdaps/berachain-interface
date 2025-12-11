"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { playShakeSound } from "../sound";

interface ProbabilityItem {
  percentage: string;
  value: number;
}

interface NFTCardProps {
  title: string;
  address: string;
  floorPrice: string;
  balance?: string;
  probabilities: ProbabilityItem[];
  imageUrl: string;
  className?: string;
  total: number;
}

export default function NFTCard({
  title,
  address,
  floorPrice,
  balance,
  probabilities,
  imageUrl,
  className = "",
  total
}: NFTCardProps) {
  const controls = useAnimation();
  const [hasInitialized, setHasInitialized] = useState(false);

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

  return (
    <div className={`relative ${className}`}>
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
            <div className="w-[145px] h-[145px] relative rounded-[16px] overflow-hidden">
              <Image src={imageUrl} alt={title} fill className="object-cover" />
            </div>

            <div className="flex flex-col justify-between py-[10px] flex-1">
              <h3 className="text-[24px] font-bold text-black font-CherryBomb">
                {title}
              </h3>

              <div className="text-[14px]">
                {/* Floor Price */}
                <div className="flex justify-between items-center gap-[10px]">
                  <div className="text-[#3D405A] mb-1">Floor Price</div>
                  <div className="font-bold text-black">{floorPrice} BERA</div>
                </div>

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
                  <a
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
                    
                    {/* External Link Icon */}
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
                  </a>
                </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
