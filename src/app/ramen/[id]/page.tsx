"use client";
import RamenDetail from "@/sections/ramen/detail";
import useIsMobile from '@/hooks/use-isMobile';

export default function DetailPage() {
  const isMobile = useIsMobile();

  return (
    isMobile ? (
      <div className="bg-[#FFFDEB] w-full rounded-[10px] p-[14px_12px_17px]">
        <RamenDetail />
      </div>
    ) : (
      <RamenDetail />
    )
  );
}
