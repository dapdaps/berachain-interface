'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';

interface ProbabilityItem {
  percentage: string;
  value: number;
}

interface NFTCardProps {
  title: string;
  floorPrice: string;
  remaining: {
    current: number;
    total: number;
  };
  probabilities: ProbabilityItem[];
  imageUrl: string;
  className?: string;
}

export default function NFTCard({
  title,
  floorPrice,
  remaining,
  probabilities,
  imageUrl,
  className = '',
}: NFTCardProps) {
  const controls = useAnimation();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const playInitialAnimation = async () => {
      await controls.start({
        rotate: [0, -3, 3, -3, 3, -2, 2, 0],
        transition: {
          duration: 1.2,
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
          ease: 'easeInOut',
        },
      });
      setHasInitialized(true);
    };

    playInitialAnimation();
  }, [controls]);

  const handleClick = async () => {
    await controls.start({
      rotate: [0, -4, 4, -4, 4, -3, 3, 0],
      transition: {
        duration: 0.6,
        times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
        ease: 'easeInOut',
      },
    });
  };

  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="absolute left-1/2 -translate-x-1/2 top-[-25px] z-20">
        <img src="/images/gacha/nail.png" alt="pin" className="w-[43px]" />
      </div>

      <motion.div
        className="relative"
        animate={controls}
        style={{
          transformOrigin: 'top center',
        }}
        onClick={handleClick}
      >
        <div className="bg-[#FFE5B8] rounded-[16px] overflow-hidden p-[5px] shadow-xl cursor-pointer hover:shadow-2xl transition-shadow duration-300">
          <div className="flex gap-[10px] ">
            <div className="w-[145px] h-[145px] relative rounded-[16px] overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                />
            </div>

            <div className="flex flex-col justify-between pt-[10px] flex-1">
              <div>
                <h3 className="text-[24px] font-bold text-black font-CherryBomb">
                  {title}
                </h3>
              </div>
              <div className="text-[14px]">
                {/* Floor Price */}
                <div className="flex justify-between items-center gap-[10px]">
                  <div className="text-[#3D405A] mb-1">Floor Price</div>
                  <div className="font-bold text-black">
                    {floorPrice} BERA
                  </div>
                </div>

                {/* NFT Remaining */}
                <div className="flex justify-between items-center gap-[10px]">
                  <div className="text-[#3D405A] mb-1">
                    NFT remaining
                  </div>
                  <div className="font-bold text-black">
                    {remaining.current}/{remaining.total}
                  </div>
                </div>

                {/* Probability */}
                <div className="flex justify-between flex-wrap items-center">
                  <div className="text-[#3D405A] mb-1">Probability</div>
                  <div className="w-full flex gap-[10px] font-bold pl-[10px]">
                    {probabilities.map((prob, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center"
                      >
                        <span className="text-black">
                          {prob.percentage}%
                        </span>
                        <div className="flex items-center gap-1 bg-[#FFC35A] rounded-[10px] px-[5px]">
                          <div className="w-5 h-5 relative">
                            <svg
                              viewBox="0 0 24 24"
                              fill="#D4A574"
                              className="w-full h-full"
                            >
                              <circle cx="12" cy="10" r="6" />
                              <ellipse cx="12" cy="18" rx="4" ry="3" />
                              <circle cx="10" cy="9" r="1" fill="#5D4037" />
                              <circle cx="14" cy="9" r="1" fill="#5D4037" />
                              <circle cx="8" cy="8" r="2" />
                              <circle cx="16" cy="8" r="2" />
                            </svg>
                          </div>
                          <span className=" text-black">
                            {prob.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

