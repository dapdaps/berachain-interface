import { Swiper, SwiperSlide } from "swiper/react";
import { TOKENS } from "../laptop/config";
import { useMemo, useState } from "react";
import Item from "../tokens/item";

export default function Tokens() {
  const tokens = useMemo(() => Object.values(TOKENS), [TOKENS]);
  const [selectToken, setSelectToken] = useState<number>();
  return (
    <div className="pt-[30px]">
      <Swiper
        width={375}
        height={260}
        slidesPerView={4}
        spaceBetween={38}
        speed={500}
        loop={true}
      >
        {Object.values(tokens).map((token, i) => (
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
    </div>
  );
}
