import clsx from "clsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { useRef } from "react";

const Steps = [
  {
    key: 1,
    title: "1. ONE CLICK ZAP TO wgBERA-iBERA",
    content: "Zap your bags and they will be automatically deposited directly into the wgBERA-iBERA on Kodiak, the best BERA stable performing pool.",
    banner: "/images/belong/banner-zap.png",
    bannerTop: 20,
  },
  {
    key: 2,
    title: "2. LP TOKEN IS LOCKED TO BORROW NECT",
    content: "NECT, one of the major stablecoins within Berachain, is automatically minted in background as soon as you click the button \"Deposit\" above.",
    banner: "/images/belong/banner-lock-lp.png",
    bannerTop: 20,
  },
  {
    key: 3,
    title: "3. EXPOSURE INCREASE BY LOOPING UP TO 5x",
    content: "NECT is being sold to buy more wgBERA and iBERA, compouding your position within the pool and the exposition to BERA. Watch out for liquidations, check more details here: BERABORROW LINK TO WGBERA-IBERA LP VAULT",
    banner: "/images/belong/banner-leverage.png",
    bannerTop: 10,
  },
];

const HowWork = (props: any) => {
  const { className, style } = props;

  const swiperRef = useRef<any>(null);

  return (
    <div className={clsx("", className)} style={style}>
      <div className="text-[#3D405A] font-Montserrat text-[20px] font-semibold leading-normal">
        How does it work?
      </div>
      <div className="relative w-full h-[330px] rounded-[20px] mt-[10px] bg-[rgba(255,255,255,0.5)] backdrop-blur-[10px] text-[#3D405A] font-Montserrat text-[12px] font-[500] leading-[120%]">
        <Swiper
          modules={[]}
          loop={true}
          className="w-full h-full"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {
            Steps.map((item) => {
              return (
                <SwiperSlide key={item.key}>
                  <div
                    className="w-full h-full p-[22px_12px_17px] flex justify-center items-end bg-no-repeat bg-[length:65%_auto]"
                    style={{
                      backgroundImage: `url(${item.banner})`,
                      backgroundPosition: `center top ${item.bannerTop}px`
                    }}
                  >
                    <div className="w-full">
                      <div className="text-[#471C1C] font-Montserrat text-[16px] font-semibold leading-[80%] text-center">
                        {item.title}
                      </div>
                      <div className="mt-[14px]">
                        {item.content}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })
          }
        </Swiper>
        <button
          type="button"
          className="w-[30px] h-[30px] rounded-full bg-[url('/images/belong/icon-prev.png')] bg-no-repeat bg-center bg-contain absolute top-1/2 -translate-y-1/2 left-[12px] z-[1]"
          onClick={() => swiperRef.current?.slidePrev()}
        />
        <button
          type="button"
          className="w-[30px] h-[30px] rounded-full bg-[url('/images/belong/icon-next.png')] bg-no-repeat bg-center bg-contain absolute top-1/2 -translate-y-1/2 right-[12px] z-[1]"
          onClick={() => swiperRef.current?.slideNext()}
        />
      </div>
    </div>
  );
};

export default HowWork;
