"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface NFTTrait {
  name: string;
  value: string;
  rarity: string;
  price?: string;
}

export interface NFTDetailData {
  name: string;
  address: string;
  imageUrl: string;
  tokenList: any[];
}

interface NFTDetailModalProps {
  visible: boolean;
  address: string;
  data?: NFTDetailData;
  rarityRank: Record<string, any>;
  onClose: () => void;
}

export default function NFTDetailModal({ visible, address, data, rarityRank, onClose }: NFTDetailModalProps) {
  const [selectedThumbnailIndex, setSelectedThumbnailIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  if (!visible || !data || !data.tokenList || data.tokenList.length === 0) return null;

  const currentImage = data.tokenList[selectedThumbnailIndex].imageUrl;
  
  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };


  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full z-[100] bg-[#00000080] backdrop-blur-[20px] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-[615px] max-h-[90vh] overflow-y-auto bg-[#FFF1C7] rounded-[16px] shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-[33px] h-[33px] cursor-pointer bg-transparent"
            >
              <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_1077_38047)">
                  <circle cx="15" cy="15" r="13" fill="#E9E3B5" />
                  <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2" stroke-linejoin="round" />
                </g>
                <path d="M16.444 15L19.7799 11.6642C20.0307 11.4133 20.0735 11.0494 19.8756 10.8516L19.1482 10.1242C18.9503 9.92632 18.5869 9.96974 18.3356 10.2204L15.0001 13.5561L11.6643 10.2205C11.4135 9.96941 11.0496 9.92632 10.8517 10.1245L10.1243 10.8519C9.92648 11.0495 9.96931 11.4134 10.2205 11.6642L13.5563 15L10.2205 18.336C9.96973 18.5866 9.92631 18.9503 10.1243 19.1482L10.8517 19.8756C11.0496 20.0735 11.4135 20.0306 11.6643 19.7799L15.0003 16.4439L18.3357 19.7794C18.587 20.0307 18.9504 20.0735 19.1483 19.8756L19.8757 19.1482C20.0735 18.9503 20.0307 18.5866 19.78 18.3356L16.444 15Z" fill="black" />
                <defs>
                  <filter id="filter0_d_1077_38047" x="0" y="0" width="33" height="33" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dx="3" dy="3" />
                    <feComposite in2="hardAlpha" operator="out" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1077_38047" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1077_38047" result="shape" />
                  </filter>
                </defs>
              </svg>

            </button>

            <div className="bg-[#FFF9E6] p-6 rounded-t-[16px]">
              <div className="w-full h-[450px] relative rounded-[20px] overflow-hidden mb-4  flex items-center justify-center">
                <img
                  src={imageErrors[selectedThumbnailIndex] ? data.imageUrl : currentImage}
                  alt={data.name}
                  className="h-full rounded-[20px]"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 px-2">
                {data.tokenList.map((token, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedThumbnailIndex(index)}
                    className={`relative w-[60px] h-[60px] rounded-[8px] overflow-hidden flex-shrink-0 border-2 transition-all ${selectedThumbnailIndex === index
                      ? "border-[#C84F27] shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={imageErrors[index] ? data.imageUrl : token.imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-[56px] h-[56px] object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#DDC682] py-3 px-6 rounded-b-[16px]">
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <h2 className="text-[24px] font-bold text-black">
                    {data.name} #{data.tokenList[selectedThumbnailIndex]?.tokenId}
                  </h2>
                  <div className="text-[14px] bg-[#FFFFFF80] rounded-[4px] px-[8px] py-[2px]">{rarityRank?.[data.tokenList[selectedThumbnailIndex]?.tokenId] || '-'}</div>
                </div>

                <a href={`https://magiceden.io/collections/berachain/${address}`} target="_blank" rel="noopener noreferrer">
                  <svg width="28" height="11" viewBox="0 0 28 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g opacity="0.5">
                      <path d="M0 9.65649V1.34355L0.000888622 1.2932C0.0183716 0.774301 0.305042 0.310903 0.739185 0.106813C1.18731 -0.103828 1.70575 0.00263781 2.05597 0.377089L5.46517 4.0222L7.8255 0.537483C8.05463 0.19918 8.41429 4.76554e-05 8.79617 4.76554e-05H14.7867C15.4567 4.76554e-05 15.9999 0.601556 15.9999 1.34355C15.9999 2.08555 15.4567 2.68706 14.7867 2.68706H11.3865L12.7613 4.51404C13.1219 4.99318 13.1373 5.68405 12.7985 6.18227L11.5518 8.01532L14.7736 7.97711C15.4437 7.96916 15.9927 8.56425 15.9999 9.30619C16.0071 10.0481 15.4697 10.6562 14.7997 10.6641L9.11252 10.7315C8.65022 10.737 8.22527 10.4511 8.0167 9.99417C7.80815 9.53728 7.85218 8.98877 8.1303 8.57982L10.2818 5.41622L8.84623 3.50871L6.58202 6.85189C6.37322 7.16018 6.05481 7.35438 5.70791 7.38506C5.36104 7.41573 5.01898 7.27994 4.76864 7.01229L2.42653 4.50814V9.65649C2.42653 10.3985 1.88333 11 1.21326 11C0.543197 11 0 10.3985 0 9.65649Z" fill="#3D405A" />
                      <path d="M19 10L27 2M27 2L21.5 2M27 2V7.5" stroke="#3D405A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
