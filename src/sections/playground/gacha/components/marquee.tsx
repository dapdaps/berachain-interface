"use client";

import { numberFormatter } from "@/utils/number-formatter";
import { useEffect, useRef, useState } from "react";

function getMultiplierColor(multiplier: number): { bg: string; border: string } {
  let borderColor = "";
  
  if (multiplier >= 1 && multiplier < 1.5) {
    borderColor = "rgb(178, 233, 70)";
  } else if (multiplier >= 1.5 && multiplier < 3) {
    borderColor = "rgb(171, 87, 255)";
  } else if (multiplier >= 3) {
    borderColor = "rgb(255, 154, 47)";
  } else {
    borderColor = "rgb(178, 233, 70)";
  }
  
  const bgColor = borderColor.replace("rgb", "rgba").replace(")", ", 0.1)");
  
  return {
    bg: bgColor,
    border: borderColor,
  };
}

export interface MarqueeCardData {
  id: string;
  imageUrl: string;
  address: string;
  timeAgo: string;
  multiplier: number;
  tokenAddress: string;
}

interface MarqueeCardProps {
  data: MarqueeCardData;
  tokenNameMap: Record<string, string>;
}

function MarqueeCard({ data, tokenNameMap }: MarqueeCardProps) {
  const color = getMultiplierColor(data.multiplier);
  
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  };

  return (
    <div 
      className="flex-shrink-0 w-[310px] h-[92px] flex items-center rounded-[12px] border border-[#FFCF23] p-[10px] relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #825445 0%, #1C120F 100%)",
      }}
      >
      <div className="w-[66px] h-[66px] rounded-[8px] flex-shrink-0 overflow-hidden relative">
        <img
          src={data.imageUrl}
          alt={tokenNameMap[data.tokenAddress.toLowerCase()]}
          className="w-full h-full object-cover"
        />
      </div>

      <div className=" ml-[10px] flex flex-col justify-between">
        <div className="flex items-center">
          <div className=" border border-[#E6CC9E] rounded-[8px] px-[8px] py-[2px]">
            <span className="text-white text-[16px] font-medium">
              {formatAddress(data.address)}
            </span>
          </div>
        </div>

        <div className="text-white text-[16px] mt-[2px]">
          win <span className="font-[600]">{tokenNameMap[data.tokenAddress.toLowerCase()]}</span>
        </div>

        <div className="text-white text-[14px] opacity-60">
          {data.timeAgo}
        </div>
      </div>

      <div
        className="absolute top-[8px] right-[8px] rounded-full px-[8px] py-[2px] border"
        style={{
          backgroundColor: color.bg,
          borderColor: color.border,
        }}
      >
        <span 
          className="text-[14px] font-bold"
          style={{
            color: color.border,
          }}
        >
          {numberFormatter(data.multiplier, 2, true, { isShort: true, isShortUppercase: true })}x
        </span>
      </div>
    </div>
  );
}

interface MarqueeProps {
  items: MarqueeCardData[];
  speed?: number;
  gap?: number;
  className?: string;
  pauseOnHover?: boolean;
  tokenNameMap: Record<string, string>;
}

export default function Marquee({
  items,
  speed = 50,
  gap = 16,
  className = "",
  pauseOnHover = true,
  tokenNameMap,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const singleContentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);
  const shouldAnimateRef = useRef(false);
  const [shouldDuplicate, setShouldDuplicate] = useState(true);

  useEffect(() => {
    if (!singleContentRef.current || !wrapperRef.current || items.length === 0) {
      return;
    }

    const checkIfShouldDuplicate = () => {
      const singleContent = singleContentRef.current;
      const wrapper = wrapperRef.current;
      
      if (!singleContent || !wrapper) return;
      
      const singleItemWidth = 310;
      const singleContentWidth = singleItemWidth * items.length + gap * (items.length - 1);
      const wrapperWidth = wrapper.offsetWidth;
      
      const needsDuplicate = singleContentWidth > wrapperWidth;
      setShouldDuplicate(needsDuplicate);
      shouldAnimateRef.current = needsDuplicate;
    };

    const timeoutId = setTimeout(checkIfShouldDuplicate, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [items, gap]);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || !wrapperRef.current || items.length === 0) {
      return;
    }

    if (!shouldDuplicate) {
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;
    const wrapper = wrapperRef.current;
    
    const checkAndStartAnimation = () => {
      const contentWidth = content.offsetWidth;
      const wrapperWidth = wrapper.offsetWidth;
      
      shouldAnimateRef.current = contentWidth > wrapperWidth;
      
      if (!shouldAnimateRef.current) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
        positionRef.current = 0;
        container.style.transform = `translateX(0px)`;
        setShouldDuplicate(false);
        return;
      }

      if (!animationRef.current) {
        const animate = () => {
          if (shouldAnimateRef.current && !isPausedRef.current) {
            const currentContentWidth = content.offsetWidth;
            const singleContentWidth = currentContentWidth / 2;
            
            positionRef.current -= speed / 60;

            if (Math.abs(positionRef.current) >= singleContentWidth) {
              positionRef.current = 0;
            }

            container.style.transform = `translateX(${positionRef.current}px)`;
          }
          
          if (shouldAnimateRef.current) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        animationRef.current = requestAnimationFrame(animate);
      }
    };

    checkAndStartAnimation();

    const resizeObserver = new ResizeObserver(() => {
      checkAndStartAnimation();
    });

    resizeObserver.observe(wrapper);
    resizeObserver.observe(content);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items, speed, gap, shouldDuplicate]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      isPausedRef.current = true;
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      isPausedRef.current = false;
    }
  };

  if (items.length === 0) {
    return null;
  }

  const displayItems = shouldDuplicate ? [...items, ...items] : items;

  return (
    <div 
      ref={wrapperRef}
      className={`overflow-hidden w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={singleContentRef}
        className="absolute opacity-0 pointer-events-none flex"
        style={{ gap: `${gap}px` }}
      >
        {items.map((item, index) => (
          <MarqueeCard
            key={`single-${item.id}-${index}`}
            data={item}
            tokenNameMap={tokenNameMap}
          />
        ))}
      </div>
      
      <div
        ref={containerRef}
        className="flex"
        style={{
          gap: `${gap}px`,
          willChange: shouldDuplicate ? "transform" : "auto",
          width: "fit-content",
        }}
      >
        <div ref={contentRef} className="flex" style={{ gap: `${gap}px` }}>
          {displayItems.map((item, index) => (
            <MarqueeCard
              key={`${item.id}-${index}`}
              data={item}
              tokenNameMap={tokenNameMap}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
