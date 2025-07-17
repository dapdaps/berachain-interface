"use client";

import BelongView from "@/sections/belong";
import useIsMobile from "@/hooks/use-isMobile";
import PageBack from "@/components/back";

const BelongPage = () => {
  const isMobile = useIsMobile();

  return (
    <div className="w-full min-h-screen md:min-h-[unset] md:h-screen md:overflow-y-auto">
      <div className="w-full bg-black bg-[url('/images/belong/v2/bg-bar-primary.png')] bg-no-repeat bg-[length:100%_auto] bg-[position:top_0px_center] py-[114px] md:py-[0px] md:pb-[70px]">
        {
          isMobile && (
            <div className="w-full relative py-[16px] px-[12px]">
              <PageBack className="" showBackText={false} />
              <img
                src="/images/belong/v2/mobile-title.png"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[185px] h-[32px] object-contain object-center"
              />
            </div>
          )
        }
        <BelongView />
      </div>
    </div>
  );
};

export default BelongPage;
