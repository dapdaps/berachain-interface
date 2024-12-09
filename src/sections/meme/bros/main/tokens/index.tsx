import { Swiper, SwiperSlide } from "swiper/react";
import { useMemo, useState, useRef } from "react";
import useIsMobile from "@/hooks/use-isMobile";
import Loading from "@/components/loading";
import Item from "./item";
import TapSound from "@/components/tap-sound";

export default function Tokens({ tokens, loading }: any) {
  const [selectToken, setSelectToken] = useState<number>();
  const isMobile = useIsMobile();
  const tapRef = useRef<any>(null);

  const list = useMemo(() => {
    if (!tokens || tokens.length === 0) return [];
    const [t1, t2, t3, ...rest] = tokens;

    const _t1 = { ...t1, rank: 1 };
    const _t2 = { ...t2, rank: 2 };
    const _t3 = { ...t3, rank: 3 };

    if (tokens.length === 1) return [_t1];
    if (tokens.length === 2) return [_t2, _t1];

    return [_t3, _t2, _t1, ...rest];
  }, [tokens]);

  return (
    <div className="pt-[40px] md:pt-[10px] min-h-[400px] md:min-h-[300px]">
      {loading ? (
        <div className="flex justify-center w-full h-[260px]">
          <Loading size={40} />
        </div>
      ) : (
        <Swiper
          width={isMobile ? 375 : 1308}
          height={isMobile ? 300 : 400}
          slidesPerView={isMobile ? 4 : 6}
          spaceBetween={isMobile ? 30 : 60}
          speed={500}
          loop={isMobile ? list.length > 4 : list.length > 6}
          className="px-[20px]"
        >
          {list.map((token: any, i: number) => (
            <SwiperSlide
              key={token.address}
              style={{ height: isMobile ? 300 : 400 }}
            >
              <Item
                token={token}
                i={i}
                show={i === selectToken}
                onClick={() => {
                  setSelectToken(i);
                  tapRef.current?.play?.();
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <TapSound ref={tapRef} src="/audios/meme-jump.mp3" />
    </div>
  );
}
