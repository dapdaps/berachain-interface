import { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import { motion } from "framer-motion";
import clsx from "clsx";

import { useRouter } from "next/navigation";
import MintHoneyModal from "@/components/mint-honey-modal";
import MintNectModal from "@/components/mint-nect-modal";

const MintStable = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mineModalOpen, setMineModalOpen] = useState(false);
  const [nectModalOpen, setNectModalOpen] = useState(false);
  const [isAnyModalOpen, setIsAnyModalOpen] = useState(false);

  useEffect(() => {
    setIsAnyModalOpen(mineModalOpen || nectModalOpen);
  }, [mineModalOpen, nectModalOpen]);

  useEffect(() => {
    if (isAnyModalOpen) {
      setIsDropdownOpen(false);
      setIsHovered(false);
    }
  }, [isAnyModalOpen]);

  const handleModalClose = () => {
    setMineModalOpen(false);
    setNectModalOpen(false);
    setIsDropdownOpen(false);
    setIsHovered(false);
    setSelectedToken(null); 
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  };

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
    if (isAnyModalOpen) return;
    
    setIsHovered(true);
    setIsDropdownOpen(true);
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };
  
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (isAnyModalOpen) return;
    
    const toElement = e.relatedTarget as HTMLElement | null;
    
    if (
      !toElement || 
      (containerRef.current && !containerRef.current.contains(toElement) && 
       dropdownRef.current && !dropdownRef.current.contains(toElement))
    ) {
      setIsHovered(false);
      setIsDropdownOpen(false);
      if (swiperRef.current) {
        swiperRef.current.autoplay.start();
      }
    }
  };
  
  const handleTokenClick = (tokenId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    setSelectedToken(tokenId);
    if (tokenId === 'honey') {
      setMineModalOpen(true);
    } else {
      setNectModalOpen(true);
    }
    setIsDropdownOpen(false);
    setIsHovered(false);
  };

  const handleContainerClick = () => {
    if (isAnyModalOpen) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div 
      ref={containerRef}
      className={clsx(`w-[131px] h-[38px] bg-no-repeat bg-center cursor-pointer transition-transform relative`,
        isHovered ? 'bg-[url(/images/header/mint-stable.svg)] transform' : 'bg-[url(/images/header/mint-stable-shadow.svg)]'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleContainerClick}
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

      {isDropdownOpen && !isAnyModalOpen && (
        <motion.div 
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-[100%] left-0 w-[128px] h-[90px] bg-[#FFFDEB] border border-black rounded-[12px] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)] mt-0 z-50 p-[6px] pb-[10px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col space-y-2">
            {tokens.map((token) => (
              <div 
                key={token.id}
                className={`flex items-center p-1 cursor-pointer rounded-[8px] ${selectedToken === token.id ? 'bg-black/10' : ''} hover:bg-black/10`}
                onClick={(e) => handleTokenClick(token.id, e)}
              >
                <img src={token.image} alt={token.name} className="w-[24px] h-[24px]" />
                <span className="ml-2 text-[#FFF5A9] text-stroke-1 text-[15px] leading-3 font-CherryBomb">{token.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <MintHoneyModal isOpen={mineModalOpen} onClose={handleModalClose} />
      <MintNectModal isOpen={nectModalOpen}  onClose={handleModalClose} />
        
    </div>
  );
};

export default MintStable;