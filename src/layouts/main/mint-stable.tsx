import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import MintHoneyModal from "@/components/mint-honey-modal";

const MintStable = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mineModalOpen, setMineModalOpen] = useState(false);

  
  const tokens = [
    { id: 'honey', name: 'HONEY', image: '/images/header/honey.svg' },
    { id: 'nect', name: 'NECT', image: '/images/header/nect.svg' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        dropdownRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsHovered(false);
        if (swiperRef.current) {
          swiperRef.current.autoplay.start();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsDropdownOpen(true);
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    const toElement = e.relatedTarget as HTMLElement;
    if (dropdownRef.current && dropdownRef.current.contains(toElement)) {
      return;
    }
    if (!dropdownRef.current?.contains(toElement)) {
      setIsHovered(false);
      if (swiperRef.current) {
        swiperRef.current.autoplay.start();
      }
    }
  };
  
  const handleTokenClick = (tokenId: string) => {
    setSelectedToken(tokenId);

    if (tokenId === 'honey') {
      setMineModalOpen(true);
    }
  };


  return (
    <div 
      ref={containerRef}
      className={`bg-[url(/images/header/${isHovered ? 'mint-stable':'mint-stable-shadow'}.svg)] w-[130px] bg-no-repeat bg-center cursor-pointer transition-transform relative ${isHovered ? 'transform translate-y-[2px] h-[37px]' : ' h-[39px]'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        loop={true}
        className="absolute w-[24px] h-[24px] left-[6px] bottom-[6px]"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {
            tokens.map((token) => (
              <SwiperSlide key={token.id}>
                <img src={token.image} alt={token.name} className="w-[24px] h-[24px]" />
              </SwiperSlide>
            ))
        }
      </Swiper>

      {isDropdownOpen && (
        <motion.div 
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[100%] left-0 w-[128px] h-[90px] bg-[#FFFDEB] border border-black rounded-[12px] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)] mt-0 z-50 p-[6px] pb-[10px]"
          onMouseEnter={handleMouseEnter} // 添加这个事件处理
          onMouseLeave={(e) => {
            // 检查鼠标是否移向主按钮
            const toElement = e.relatedTarget as HTMLElement;
            if (!containerRef.current?.contains(toElement)) {
              setIsDropdownOpen(false);
              setIsHovered(false);
              if (swiperRef.current) {
                swiperRef.current.autoplay.start();
              }
            }
          }}
        >
          <div className="flex flex-col space-y-2">
            {tokens.map((token) => (
              <div 
                key={token.id}
                className={`flex items-center p-1 cursor-pointer rounded-[8px] ${selectedToken === token.id ? 'bg-black/10' : ''} hover:bg-black/10`}
                onClick={() => handleTokenClick(token.id)}
              >
                <img src={token.image} alt={token.name} className="w-[24px] h-[24px]" />
                <span className="ml-2 text-[#FFF5A9] text-stroke-1 text-[15px] leading-3 font-CherryBomb">{token.name}</span>
              </div>
            ))}
          </div>
          <MintHoneyModal isOpen={mineModalOpen} onClose={() => setMineModalOpen(false) } />

        </motion.div>
      )}
    </div>
  );
};

export default MintStable;