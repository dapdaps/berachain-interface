"use client";

import Link from "next/link";
import { useState } from "react";

const ENTRIES = [
  {
    name: "LuckyBera",
    link: "/carnival/lucky-bera",
    image: "/images/playground/entry-lucky-bera.png",
    size: [270, 347],
    sort: 1,
  },
  {
    name: "NFT GACHA",
    link: "/carnival/gacha",
    image: "/images/playground/v2/entry-nft-gacha.png",
    size: [278, 397],
    sort: 2,
  },
  {
    name: "Guess Who",
    link: "/carnival/guess-who",
    image: "/images/playground/entry-magician.png",
    size: [487, 351],
    sort: 3,
  },
];

const GameIndex = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full h-[100dvh] relative">
      <img
        src="/images/playground/v2/cloud-1.png"
        alt=""
        className="w-[308px] h-[92px] absolute z-[1] top-[33px] right-[24.35%] pointer-events-none object-center object-contain"
      />
      <img
        src="/images/playground/v2/cloud-2.png"
        alt=""
        className="w-[478px] h-[102px] absolute z-[1] top-[230px] left-[1.88%] pointer-events-none object-center object-contain"
      />
      <img
        src="/images/home-earth/beratown-logo.png"
        alt=""
        className="w-[244px] h-[150px] absolute z-[2] top-[80px] left-[50%] -translate-x-1/2 pointer-events-none object-center object-contain"
      />
      <img
        src="/images/playground/v2/line-lights-left.png"
        alt=""
        className="w-[580px] h-[252px] absolute z-[1] top-[0px] left-[0px] pointer-events-none object-center object-contain opacity-30"
      />
      <img
        src="/images/playground/v2/line-lights-right.png"
        alt=""
        className="w-[514px] h-[144px] absolute z-[1] top-[0px] right-[0px] pointer-events-none object-center object-contain opacity-30"
      />
      <img
        src="/images/playground/v2/line-lights-center.png"
        alt=""
        className="w-[1311px] h-[201px] absolute z-[3] top-[0px] right-[0px] pointer-events-none object-center object-contain"
      />

      <div className="absolute z-[5] left-0 top-0 w-full pointer-events-none flex justify-center items-end gap-[50px]">
        {
          ENTRIES.sort((a, b) => a.sort - b.sort).map((entry, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative w-[536px]"
            >
              <img
                src="/images/playground/v2/top-light.png"
                alt=""
                className={`w-[536px] h-[626px] shrink-0 object-top object-contain transition-opacity duration-300 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))
        }
      </div>

      <div className="absolute z-[4] left-0 bottom-0 w-full h-[241px] bg-[radial-gradient(81.94%_103.73%_at_50%_-3.73%,#A7BC2F_0%,#1B311F_100%)]">
        <img
          src="/images/playground/v2/bg-room.png"
          alt=""
          className="w-[659px] h-[487px] absolute z-[1] top-[-487px] left-[-12.95%] pointer-events-none object-center object-contain"
        />
        <img
          src="/images/playground/v2/bg-ferris-wheel.png"
          alt=""
          className="w-[370px] h-[415px] absolute z-[1] top-[-415px] right-[20.85%] pointer-events-none object-center object-contain"
        />

        <div className="flex justify-center items-end gap-[50px] w-full absolute z-[2] bottom-[180px]">
          {
            ENTRIES.sort((a, b) => a.sort - b.sort).map((entry, index) => (
              <div
                key={index}
                className="flex flex-col items-center relative w-[536px]"
              >
                <Link
                  href={entry.link}
                  prefetch={true}
                  className=""
                >
                  <img
                    src={entry.image}
                    alt=""
                    className={`relative z-[2] shrink-0 object-bottom object-contain transition-transform duration-300 ${
                      hoveredIndex === index ? "translate-y-0" : "translate-y-[10px]"
                    }`}
                    style={{
                      width: entry.size[0],
                      height: entry.size[1],
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </Link>
                <img
                  src="/images/playground/v2/bg-light-ground.png"
                  alt=""
                  className={`w-[471px] h-[99px] absolute z-[1] bottom-[-50px] shrink-0 object-center object-contain transition-opacity duration-300 ${
                    hoveredIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default GameIndex;
