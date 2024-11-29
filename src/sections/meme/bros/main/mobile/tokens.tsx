import { Swiper, SwiperSlide } from "swiper/react";
import Loading from "@/components/loading";
import { useState } from "react";
import Item from "../tokens/item";

export default function Tokens({ tokens, loading }: any) {
  const [selectToken, setSelectToken] = useState<number>();
  return (
    <div className="pt-[30px]">
      {loading ? (
        <div className="flex justify-center w-full h-[260px]">
          <Loading size={40} />
        </div>
      ) : (
        <Swiper
          width={375}
          height={260}
          slidesPerView={4}
          spaceBetween={30}
          speed={500}
          loop={true}
          className="px-[20px]"
        >
          {tokens.map((token: any, i: number) => (
            <SwiperSlide key={token.address} style={{ height: 260 }}>
              <Item
                token={token}
                i={i}
                show={i === selectToken}
                onClick={() => {
                  setSelectToken(i);
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
