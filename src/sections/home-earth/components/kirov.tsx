import { useNftReward } from "@/stores/use-nft-reward";
import { get } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";
import { useRequest } from "ahooks";
import Big from "big.js";
import clsx from "clsx";
import { motion, useAnimate, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Kirov = (props: any) => {
  const { className } = props;

  const nftRewardStore: any = useNftReward();

  const kirovControls = useRef<any>();
  const [kirovRef, kirovAnimate] = useAnimate();
  const kirovX = useMotionValue("100vw");
  const [isHovered, setIsHovered] = useState(false);

  const { data: appStats, loading: appStatsLoading } = useRequest(async () => {
    const res = await get("/api/go/app/stats");
    if (res.code !== 200) {
      return;
    }
    return res.data;
  }, {
    refreshDeps: [],
  });

  useEffect(() => {
    kirovControls.current = kirovAnimate(kirovRef.current, {
      x: ["100vw", "-100vw"],
    }, {
      duration: 30,
      repeat: Infinity,
      ease: "linear",
      repeatDelay: 2,
    });
  }, []);

  useEffect(() => {
    if (!kirovControls.current) return;
    if (isHovered) {
      kirovControls.current.pause();
    } else {
      kirovControls.current.play();
    }
  }, [isHovered]);

  return (
    <motion.div
      ref={kirovRef}
      className="fixed z-[1] top-[40px] left-0 flex items-center"
      style={{
        x: kirovX,
      }}
      onHoverStart={() => {
        setIsHovered(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
      }}
    >
      <div className="relative w-[443px] h-[197px] shrink-0 bg-[url('/images/home-earth/v2/kirov.png')] bg-no-repeat bg-center bg-contain">
        <button
          type="button"
          className="w-[34px] h-[52px] shrink-0 hover:scale-[1.1] origin-bottom transition-all duration-150 bg-[url('/images/home-earth/v2/nft-steady-teddy-on-kirov.png')] bg-no-repeat bg-center bg-contain absolute left-[180px] bottom-[15px]"
          onClick={() => {
            nftRewardStore.set({
              showNftReward: true,
            });
          }}
        />
        <button
          type="button"
          className="w-[27px] h-[23px] shrink-0 hover:scale-[1.1] origin-bottom transition-all duration-150 bg-[url('/images/home-earth/v2/nft-honey-comb-on-kirov.png')] bg-no-repeat bg-center bg-contain absolute left-[220px] bottom-[25px]"
          onClick={() => {
            nftRewardStore.set({
              showNftReward: true,
            });
          }}
        />
      </div>
      <KirovFlag>
        <LabelValue label="Protocols intergrated">
          {appStats?.total_transactions}
        </LabelValue>
        <LabelValue label="Users">
          {appStats?.total_users}
        </LabelValue>
        <LabelValue
          label={(
            <div>All time<br /> volume</div>
          )}
        >
          {appStats?.total_volume}
        </LabelValue>
      </KirovFlag>
    </motion.div>
  );
};

export default Kirov;

const KirovFlag = (props: any) => {
  const { className, children } = props;

  return (
    <div className={clsx("relative w-[386px] h-[107px] shrink-0 translate-y-[-10px]", className)}>
      <img
        src="/images/home-earth/v2/kirov-flag.png"
        alt=""
        className="w-full h-full shrink-0 object-center object-contain"
      />
      <div className="absolute z-[1] left-0 top-0 w-full h-full grid grid-cols-3 gap-[5px] pt-[21px]">
        {children}
      </div>
    </div>
  );
};

const LabelValue = (props: any) => {
  const { label, children, labelClassName, valueClassName, className } = props;

  return (
    <div className={clsx("flex flex-col items-center gap-[5px] font-CherryBomb text-[16px] font-[400] text-black text-center", className)}>
      <div className={clsx("text-[32px] leading-[90%]", valueClassName)}>
        {numberFormatter(children, 0, true, { isShort: true, isShortUppercase: false })}
        {Big(children || 0).gt(1000) ? "+" : ""}
      </div>
      <div className={clsx("h-[30px] flex items-center leading-[90%]", labelClassName)}>
        {label}
      </div>
    </div>
  );
};
