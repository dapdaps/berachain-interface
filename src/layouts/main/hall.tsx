import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import { useHall } from "@/stores/hall";
import { useBgtCount } from "@/hooks/use-bgt-count";
import { numberFormatter } from "@/utils/number-formatter";
import { useRouter } from "next/navigation";

const Hall = () => {
  const hallStore = useHall();
  const { iBGTCount, BGTCount } = useBgtCount();
 
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (swiperRef.current) {
      swiperRef.current.autoplay.stop();
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  };
  
  const handleClick = () => {
    router.push('/hall');
  };

  return (
    <div 
      className={`relative cursor-pointer transition-transform`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="w-[98px] h-[35px]"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        <SwiperSlide>
          <div 
            className={`w-[98px] h-[35px] flex items-center justify-center ${isHovered 
              ? 'bg-[url(/images/hall/bgt.svg)]' 
              : ' bg-[url(/images/hall/bgt-shadow.svg)]'} bg-no-repeat bg-center`}
          >
            <div className={`text-white ml-5 flex ${
              numberFormatter(BGTCount, 3, true).length > 3 ? 'flex-col' : 'flex-row'
            } ${isHovered ? '' : 'mb-[3px]'}`}>
              <span className="text-[14px] leading-3 whitespace-nowrap">
                {numberFormatter(BGTCount, 3, true)}
              </span>
              <span className={`text-[10px] mt-[2px] leading-3 whitespace-nowrap ${
                numberFormatter(BGTCount, 3, true).length > 3 ? '' : 'ml-[2px]'
              }`}>
                BGT
              </span>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div 
            className={`w-[98px] h-[35px] flex items-center justify-center ${isHovered 
              ? 'bg-[url(/images/hall/ibgt.svg)]' 
              : 'bg-[url(/images/hall/ibgt-shadow.svg)]'} bg-no-repeat bg-center`}
          >
            <div className={`text-white flex ml-6 ${
              numberFormatter(iBGTCount, 3, true).length > 3 ? 'flex-col' : 'flex-row'
            } ${isHovered ? '' : 'mb-[3px]'}`}>
              <span className="text-[14px] leading-3 whitespace-nowrap">
                {numberFormatter(iBGTCount, 3, true)}
              </span>
              <span className={`text-[10px] mt-[2px] leading-3 whitespace-nowrap ${
                numberFormatter(iBGTCount, 3, true).length > 3 ? '' : 'ml-[2px]'
              }`}>
                iBGT
              </span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Hall;
