"use client";

import LightingButton from "@/components/button/lighting-button";
import { motion } from "framer-motion";
import Link from "next/link";

const PlaygroundView = () => {
  return (
    <div className="flex justify-center items-end gap-[50px] w-full absolute bottom-[6vw]">
      <Link
        href="/carnival/guess-who"
        prefetch={true}
        className="group black flex flex-col items-center gap-[20px]"
      >
        <div className="w-[487px] h-[351px] relative flex justify-center items-center">
          <img
            src="/images/playground/entry-magician.png"
            alt=""
            className="w-full h-full absolute object-center object-contain opacity-100 z-[2] group-hover:opacity-0 group-hover:z-[1] transition-all duration-300"
          />
          <img
            src="/images/playground/entry-magician-white-border.png"
            alt=""
            className="w-full h-full absolute object-center object-contain opacity-0 z-[1] origin-bottom group-hover:scale-[1.24] group-hover:opacity-100 group-hover:z-[2] transition-all duration-300"
          />
          <img
            src="/images/playground/magician/hat-down.png"
            alt=""
            className="w-[61px] h-[57px] absolute opacity-100 z-[4] group-hover:opacity-0 group-hover:z-[3] transition-all duration-300 translate-x-[17px] translate-y-[25px]"
          />
          <div className="flex items-end justify-center opacity-0 absolute z-[3] group-hover:opacity-100 group-hover:z-[4] transition-all duration-300 translate-x-[17px] translate-y-[-20px]">
            <div className="w-[75px] h-[107px]">
              <div className="w-full h-[60px] overflow-hidden relative z-[2] [clip-path:polygon(0_0,100%_0,100%_92%,0_92%)]">
                <motion.img
                  src="/images/playground/magician/guess-2.png"
                  alt=""
                  className="w-full h-full object-bottom object-contain"
                  initial={{
                    y: "100%",
                  }}
                  animate={{
                    y: ["100%", "0%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    repeatDelay: 6,
                  }}
                />
              </div>
              <img
                src="/images/playground/magician/hat-up.png"
                alt=""
                className="w-full h-[53px] object-top object-contain translate-y-[-10px]"
              />
            </div>
            <div className="w-[75px] h-[107px] translate-y-[10px]">
              <div className="w-full h-[60px] overflow-hidden relative z-[2] [clip-path:polygon(0_0,100%_0,100%_92%,0_92%)]">
                <motion.img
                  src="/images/playground/magician/guess-1.png"
                  alt=""
                  className="w-full h-full object-bottom object-contain"
                  initial={{
                    y: "100%",
                  }}
                  animate={{
                    y: ["100%", "0%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    repeatDelay: 6,
                    delay: 3,
                  }}
                />
              </div>
              <img
                src="/images/playground/magician/hat-up.png"
                alt=""
                className="w-full h-[53px] object-top object-contain translate-y-[-10px]"
              />
            </div>
            <div className="w-[75px] h-[107px]">
              <div className="w-full h-[60px] overflow-hidden relative z-[2] [clip-path:polygon(0_0,100%_0,100%_92%,0_92%)]">
                <motion.img
                  src="/images/playground/magician/guess-3.png"
                  alt=""
                  className="w-full h-full object-bottom object-contain"
                  initial={{
                    y: "100%",
                  }}
                  animate={{
                    y: ["100%", "0%", "100%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    repeatDelay: 6,
                    delay: 6,
                  }}
                />
              </div>
              <img
                src="/images/playground/magician/hat-up.png"
                alt=""
                className="w-full h-[53px] object-top object-contain translate-y-[-10px]"
              />
            </div>
          </div>
        </div>
        <LightingButton
          outerClassName="!h-[52px] uppercase !text-[20px] w-[120px]"
          disabled={false}
        >
          play
        </LightingButton>
      </Link>

      <Link
        href="/carnival/gacha"
        prefetch={true}
        className="group black flex flex-col items-center gap-[20px]"
      >
        <div className="w-[270px] h-[347px] relative flex justify-center items-center">
          <img
            src="/images/playground/v2/entry-nft-gacha.png"
            alt=""
            className="w-full h-full absolute object-center object-contain opacity-100 z-[2] group-hover:opacity-0 group-hover:z-[1] transition-all duration-300"
          />
          <img
            src="/images/playground/v2/entry-nft-gacha.png"
            alt=""
            className="w-full h-full absolute object-center object-contain opacity-0 z-[1] origin-bottom group-hover:scale-[1.32] group-hover:opacity-100 group-hover:z-[2] transition-all duration-300"
          />
        </div>
        <LightingButton
          outerClassName="!h-[52px] uppercase !text-[20px] w-[120px]"
          disabled={false}
        >
          play
        </LightingButton>
      </Link>

      <Link
        href="/carnival/lucky-bera"
        prefetch={true}
        className="group black flex flex-col items-center gap-[20px]"
      >
        <div className="w-[270px] h-[347px] relative flex justify-center items-center">
          <img
            src="/images/playground/entry-lucky-bera.png"
            alt=""
            className="w-full h-full absolute object-center object-contain opacity-100 z-[2] group-hover:opacity-0 group-hover:z-[1] transition-all duration-300"
          />
          <img
            src="/images/playground/entry-lucky-bera-white-border.png"
            alt=""
            className="w-full h-full absolute object-center object-contain opacity-0 z-[1] origin-bottom group-hover:scale-[1.32] group-hover:opacity-100 group-hover:z-[2] transition-all duration-300"
          />
        </div>
        <LightingButton
          outerClassName="!h-[52px] uppercase !text-[20px] w-[120px]"
          disabled={false}
        >
          play
        </LightingButton>
      </Link>

      
    </div>
  );
};

export default PlaygroundView;
