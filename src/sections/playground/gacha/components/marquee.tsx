"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

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
  prizeName: string;
  timeAgo: string;
  multiplier: number;
}

interface MarqueeCardProps {
  data: MarqueeCardData;
}

function MarqueeCard({ data }: MarqueeCardProps) {
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
        <Image
          src={data.imageUrl}
          alt={data.prizeName}
          fill
          className="object-cover"
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
          win <span className="font-[600]">{data.prizeName}</span>
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
          {data.multiplier}x
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
}

export default function Marquee({
  items,
  speed = 50,
  gap = 16,
  className = "",
  pauseOnHover = true,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current || items.length === 0) {
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;
    
    const getContentWidth = () => {
      return content.offsetWidth;
    };

    const contentWidth = getContentWidth();
    const totalGap = gap * items.length;
    const totalWidth = contentWidth + totalGap;

    const animate = () => {
      if (!isPausedRef.current) {
        positionRef.current -= speed / 60;

        if (Math.abs(positionRef.current) >= totalWidth / 2) {
          positionRef.current = 0;
        }

        container.style.transform = `translateX(${positionRef.current}px)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [items, speed, gap]);

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

  const duplicatedItems = [...items, ...items];

  return (
    <div 
      className={`overflow-hidden w-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={containerRef}
        className="flex"
        style={{
          gap: `${gap}px`,
          willChange: "transform",
          width: "fit-content",
        }}
      >
        <div ref={contentRef} className="flex" style={{ gap: `${gap}px` }}>
          {duplicatedItems.map((item, index) => (
            <MarqueeCard
              key={`${item.id}-${index}`}
              data={item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
