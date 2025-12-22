import MobileHeader from "@/sections/home/mobile/header";
import { useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ENTRIES } from "./config";
import Card from "@/components/card";
import MenuV3 from "@/sections/home-earth/components/menu/v3";
import Link from "next/link";
import useToast from "@/hooks/use-toast";

const GameIndexMobile = () => {
  const swiperRef = useRef<any>(null);
  const toast = useToast();

  const onSwiperSlide = (direction: string) => {
    if (swiperRef.current) {
      if (direction === "prev") {
        swiperRef.current.slidePrev();
      } else {
        swiperRef.current.slideNext();
      }
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-[#0B1537] pt-16 pb-16 relative overflow-y-auto overflow-x-hidden">
      <MobileHeader />
      <img
        src="/images/playground/v2/line-lights-left.png"
        alt=""
        className="w-full h-[152px] absolute z-[1] top-[0px] left-[0px] pointer-events-none object-center object-cover opacity-30"
      />
      <img
        src="/images/playground/v2/line-lights-center.png"
        alt=""
        className="w-full h-[101px] absolute z-[2] top-[20px] right-[0px] pointer-events-none object-center object-cover"
      />
      <div className="w-full flex flex-col items-center relative z-[3]">
        <img
          src="/images/home-earth/beratown-logo.png"
          alt=""
          className="w-[65vw] h-[40vw] pointer-events-none object-center object-contain mt-2"
        />
        <Swiper
          // modules={[Autoplay]}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="w-full mt-4 min-h-[100vw]"
          spaceBetween={0}
          slidesPerView={1}
          updateOnWindowResize={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {
            ENTRIES.sort((a, b) => a.sort - b.sort).map((entry) => (
              <SwiperSlide key={entry.name}>
                <div className="w-full flex flex-col items-center">
                  {
                    entry.isLaptopOnly ? (
                      <img
                        src={entry.image}
                        alt=""
                        className="w-[80vw] h-[110vw] object-center object-contain"
                        onClick={() => {
                          toast.info({
                            title: "This game is only available on laptop",
                          });
                        }}
                      />
                    ) : (
                      <Link
                        href={entry.link}
                        prefetch={true}
                        className="block w-[80vw] h-[110vw] bg-no-repeat bg-center bg-contain"
                        style={{
                          backgroundImage: `url(${entry.image})`,
                        }}
                      />
                    )
                  }
                  <div className="w-full px-5">
                    <Card className="w-full font-Montserrat font-[500] text-[12px] text-center !rounded-[6px] !p-[5px_10px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {entry.description}
                    </Card>
                  </div>
                </div>
              </SwiperSlide>
            ))
          }
          <button
            type="button"
            className="absolute z-[1] top-[50vw] left-2 w-[30px] h-[30px] bg-center bg-contain bg-no-repeat rotate-180 bg-[url('/images/home-earth/v3/icon-entry-arrow.png')]"
            onClick={() => onSwiperSlide("prev")}
          />
          <button
            type="button"
            className="absolute z-[1] top-[50vw] right-2 w-[30px] h-[30px] bg-center bg-contain bg-no-repeat bg-[url('/images/home-earth/v3/icon-entry-arrow.png')]"
            onClick={() => onSwiperSlide("next")}
          />
        </Swiper>
        <div className="w-full flex justify-center mt-4">
          <MenuV3
            className="!static !flex-row"
            isCursor={false}
          />
        </div>
      </div>
    </div>
  );
};

export default GameIndexMobile;
