import { useChristmas } from "@/hooks/use-christmas";
import { useProgressRouter } from "@/hooks/use-progress-router";
import ChristmasEnterance from "@/sections/activity/christmas/enterance";
import MobileHeader from "@/sections/home/mobile/header";
import { useTapSoundStore } from "@/stores/tap-sound";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import VaultsEnterance from "../vaults-enterance";
import EntryCard from "@/sections/home/mobile/entry-card";
import VaultsEntrance from '@/sections/vaults/v2/entrance';
import Signpost from '@/sections/home-earth/components/signpost';

const Home = () => {
  const router = useProgressRouter();
  const tapSound = useTapSoundStore();

  const [viewportHeight, setViewportHeight] = useState("100vh");
  const [visibleHeight, setVisibleHeight] = useState(844);
  const [showBeraciage, setShowBeraciage] = useState(false);

  const { isChristmas, path: christmasPath } = useChristmas();
  const scrollRef = useRef(null);
  const screen_width = window.screen.width;

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
      setVisibleHeight(window.visualViewport?.height || window.innerHeight);
    };

    updateViewportHeight();
    window.addEventListener("resize", updateViewportHeight);

    if (scrollRef.current && isChristmas) {
      // @ts-ignore
      scrollRef.current.scrollTop = 0.35 * screen_width;
    }
    return () => {
      window.removeEventListener("resize", updateViewportHeight);
    };
  }, [isChristmas]);

  return (
    <div
      className={clsx(
        "relative w-full h-full overflow-hidden",
        isChristmas
          ? "bg-[linear-gradient(180deg,_#181C34_0%,_15%,_#FFFFFF_75%,_#C4B9AA_100%)]"
          : "bg-[#B6DF5D]"
      )}
    >
      <MobileHeader />

      <div
        className="w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-hide"
        ref={scrollRef}
        onScroll={(event) => {
          // @ts-ignore
          const scrollTop = event.target.scrollTop;
          if (scrollTop === 0) {
            setShowBeraciage(true);
          } else {
            setShowBeraciage(false);
          }
        }}
      >
        {isChristmas ? (
          <div
            className="relative w-[114.359vw] overflow-hidden pb-[60px] pt-[120px] transition-all duration-500"
            style={{
              backgroundImage:
                "url('/images/mobile/beratown-home-christmas.jpg')",
              backgroundSize: "contain",
              backgroundPosition: "-9.63vw 102px",
              backgroundRepeat: "no-repeat",
              height: "calc(120px + 212.564vw)",
              minHeight: "100dvh"
            }}
          >
            {/* <VaultsEnterance
              imgSrc="/images/background/vaults-m.svg"
              onClick={() => {
                router.push("/vaults");
                tapSound.play?.();
              }}
              className="absolute z-[20] right-[calc(15vw)] top-[-80px] hover:scale-110 transition-transform duration-500"
            /> */}

            <motion.div
              className={clsx(
                "transform relative z-10 w-[9.487vw] translate-y-[24vw] translate-x-[30vw]",
                showBeraciage ? "opacity-0" : "opacity-100"
              )}
              variants={EntryAnimationBg}
              transition={EntryAnimation}
              onClick={() => {
                // @ts-ignore
                scrollRef.current.scrollTop = 0;
              }}
            >
              <motion.img
                src="/images/mobile/home/christmas/arrow.svg"
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>

            <motion.div
              className="w-[51.538vw] -translate-y-[25.513vw] translate-x-[2.156vw]"
              whileTap="tap"
              data-bp="1015-011"
              onClick={() => {
                window.open(
                  process.env.NEXT_PUBLIC_TG_ADDRESS ||
                  "https://t.me/beraciaga_official_bot/Beraciaga"
                );
              }}
            >
              <motion.img
                src="/images/mobile/home/christmas/beraciaga.png"
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>

            <motion.div
              className="w-[46.923vw] -translate-y-[20.913vw] translate-x-[9.256vw]"
              whileTap="tap"
              data-bp="1015-003"
              onClick={() => {
                router.push("/bridge");
                tapSound.play?.();
              }}
            >
              <motion.img
                src="/images/mobile/home/christmas/bridge.png"
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>

            <motion.div
              className="w-[59.744vw] -translate-y-[35.744vw] translate-x-[42.256vw]"
              whileTap="tap"
              onClick={() => {
                router.push("/marketplace");
                tapSound.play?.();
              }}
              data-bp="1015-004"
            >
              <motion.img
                src="/images/mobile/home/christmas/market.png"
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>

            <motion.div
              className="w-[53.59vw] -translate-y-[61.05vw] translate-x-[0.156vw]"
              whileTap="tap"
              data-bp="1015-005"
              onClick={() => {
                router.push("/dapps");
                tapSound.play?.();
              }}
            >
              <motion.img
                src="/images/mobile/home/christmas/dapps.png"
                alt=""
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>
            <motion.div
              className="w-[65.128vw] -translate-y-[94.241vw] translate-x-[34.9vw]"
              whileTap="tap"
              onClick={() => {
                router.push("/portfolio");
                tapSound.play?.();
              }}
              data-bp="1015-006"
            >
              <motion.img
                src="/images/mobile/home/christmas/dashboard.png"
                alt=""
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>

            <motion.div
              className="w-[55.461vw] -translate-y-[115.641vw] translate-x-[0.152vw]"
              whileTap="tap"
              onClick={() => {
                router.push("/earn");
                tapSound.play?.();
              }}
              data-bp="1015-007"
            >
              <motion.img
                src="/images/mobile/home/christmas/vaults.png"
                alt=""
                className="w-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
            </motion.div>
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden pb-[60px]"
            style={{
              backgroundImage: "url('/images/mobile/beratown-home.svg')",
              backgroundSize: "cover",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
              height: "calc(252vw + 64px)",
              minHeight: "100dvh"
            }}
          >
            {/*#region Beraciaga*/}
            <motion.div
              className="w-[187px] h-[41vw] translate-y-[19.487vw] translate-x-[3vw] opacity-50"
              // whileTap="tap"
              // style={{ clipPath: `path("M18.9114 5.11072C2.51142 13.1107 -2.58852 33.6113 -0.588519 43.6113C-0.588519 53.1114 1.91148 77.8111 1.91148 86.6111C1.91148 95.4111 14.0781 97.2778 18.9114 97.1111C17.5781 100.444 15.7114 109.611 18.9114 119.611C22.9114 132.111 77.9114 129.111 88.9114 124.611C97.7114 121.011 99.5781 102.778 99.4114 94.1111L126.411 84.1113C152.912 84.1113 161.411 86.1113 175.411 84.1113C189.411 82.1113 187.911 75.6111 179.411 61.6111C172.611 50.4111 153.245 53.9444 144.411 57.1111C135.911 35.6111 103.411 0.611248 90.9114 -2.38875C78.4114 -5.38875 39.4114 -4.88928 18.9114 5.11072Z")` }}
              data-bp="1015-011"
              onClick={() => {
                // window.open(
                //   process.env.NEXT_PUBLIC_TG_ADDRESS ||
                //     "https://t.me/beraciaga_official_bot/Beraciaga"
                // );
                // tapSound.play?.();
              }}
            >
              <motion.img
                src="/images/mobile/home/bg-beraciaga.svg"
                alt=""
                className="w-full h-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              <motion.img
                src="/images/mobile/home/text-beraciaga.svg"
                className="absolute left-[9.5vw] top-[5vw] w-[28.2vw] h-[10.5vw]"
                variants={EntryAnimationSignpost}
                transition={EntryAnimation}
              />
            </motion.div>
            {/*#endregion*/}

            <motion.div
              className="w-[182px] h-[25.128vw] mt-[10vw] translate-y-[23vw] translate-x-[10.256vw]"
              whileTap="tap"
              // style={{ clipPath: `path("M18.9114 5.11072C2.51142 13.1107 -2.58852 33.6113 -0.588519 43.6113C-0.588519 53.1114 1.91148 77.8111 1.91148 86.6111C1.91148 95.4111 14.0781 97.2778 18.9114 97.1111C17.5781 100.444 15.7114 109.611 18.9114 119.611C22.9114 132.111 77.9114 129.111 88.9114 124.611C97.7114 121.011 99.5781 102.778 99.4114 94.1111L126.411 84.1113C152.912 84.1113 161.411 86.1113 175.411 84.1113C189.411 82.1113 187.911 75.6111 179.411 61.6111C172.611 50.4111 153.245 53.9444 144.411 57.1111C135.911 35.6111 103.411 0.611248 90.9114 -2.38875C78.4114 -5.38875 39.4114 -4.88928 18.9114 5.11072Z")` }}
              data-bp="1015-003"
              onClick={() => {
                router.push("/bridge");
                tapSound.play?.();
              }}
            >
              <motion.img
                src="/images/mobile/home/bg-bridge.png"
                alt=""
                className="w-full h-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              <motion.img
                src="/images/mobile/home/text-bridge.png"
                className="absolute left-0 -bottom-6 w-[22.564vw] h-[20.512vw]"
                variants={EntryAnimationSignpost}
                transition={EntryAnimation}
              />
            </motion.div>
            <motion.div
              className="w-[65.64vw] h-[47.43vw] translate-y-[10.256vw] translate-x-[40.256vw]"
              whileTap="tap"
              style={
                {
                  // clipPath: `path("M126.336 15.4999C102.736 14.2999 87.836 36.9999 83.336 48.4999C70.836 33.5 67 25 48.5 25C20.5 25 17.836 75.5 19.336 91C20.836 106.5 44.836 103.5 51.336 106C56.536 108 66.5027 116.5 70.836 120.5C71.1693 122.833 72.136 130.8 73.336 144C74.536 157.2 84.5027 161.5 89.336 162C131.669 158.667 210.436 152.3 220.836 149.5C236.494 145.284 231.951 134 228.336 110.5C225.797 94 214.169 96 208.836 97.5V91C212.836 87.6667 220.836 75 220.836 51C220.836 21 184.836 -7 162.336 -7C144.336 -7 130.836 7.99991 126.336 15.4999Z")`
                }
              }
              onClick={() => {
                router.push("/marketplace");
                tapSound.play?.();
              }}
              data-bp="1015-004"
            >
              <motion.img
                src="/images/mobile/home/bg-market.png"
                alt=""
                className="w-full h-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              <EntryCard
                className="right-[9.856vw] bottom-[8.697vw]"
                childrenClassName="rotate-[-4deg]"
                bgClassName="rotate-[-4deg]"
              >
                Token
                <br /> Marketplace
              </EntryCard>
              {/*<motion.img
                 src='/images/mobile/home/text-market.png'
                 className='absolute right-[9.856vw] bottom-[8.697vw] w-[37.435vw] h-[11.282vw]'
                 variants={EntryAnimationSignpost}
                 transition={EntryAnimation}
                 />*/}
            </motion.div>
            <motion.div
              className="w-[63.076vw] h-[56.153vw] -translate-y-[12.85vw] -translate-x-[10.256vw]"
              whileTap="tap"
              data-bp="1015-005"
              onClick={() => {
                router.push("/dapps");
                tapSound.play?.();
                // handleReport('1015-005');
              }}
            // style={{ clipPath: `path("M121.948 -6C102.748 -6 96.7813 8.66667 95.9479 16.5C69.9479 19.7 68.4479 39.5 71.4479 51.5C65.6146 50.3333 50.9479 52.6 50.9479 75C50.9479 90 56.6147 99.3333 59.948 101C55.9479 107 55.6146 116.833 55.9479 123.5C45.9479 126 28.448 159.5 59.948 171.5C91.448 183.5 92.948 181.5 134.948 182C176.948 182.5 175.948 171 192.948 161.5C206.548 153.9 203.948 142.5 201.948 136C210.115 131 226.448 119.2 226.448 112V75C229.281 69.5 232.448 56.3 222.448 47.5C212.448 38.7 193.948 75 175.448 47.5C175.448 47.5 177.948 37 175.448 28.5C171.498 15.0689 158.948 13.6667 148.448 16.5C147.448 8.66667 141.148 -6 121.948 -6Z")` }}
            >
              <motion.img
                src="/images/mobile/home/bg-dapps.png"
                alt=""
                className="w-full h-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              <motion.img
                src="/images/mobile/home/text-dapps.png"
                className="absolute left-[21.538vw] top-[6.153vw] w-[20.512vw] h-[8.717vw]"
                alt=""
                variants={EntryAnimationSignpost}
                transition={EntryAnimation}
              />
            </motion.div>
            <motion.div
              className="w-[77.435vw] h-[54.684vw] -translate-y-[45.641vw] translate-x-[34.8vw]"
              whileTap="tap"
              onClick={() => {
                router.push("/portfolio");
                tapSound.play?.();
                // handleReport('1015-006');
              }}
              data-bp="1015-006"
            // style={{ clipPath: `path("M84.3664 53.4998C67.8449 53.4998 47.3664 96 38.8664 116C29.3664 119.5 20.3511 141.062 33.8664 151C50.8664 163.5 90.1997 161.833 102.866 156.5C102.866 162.333 105.166 174 114.366 178C123.566 182 184.366 183 219.366 183.5C247.366 183.9 241.366 166 241.366 148C246.366 142.5 251.56 136 253.866 130.5C259.066 118.1 250.2 99 241.366 91.5C237.866 88.5283 237.866 80.5 237.866 68C237.866 52.2165 213.366 56 194.866 53.4998C194.2 50.4999 188.966 39.9 187.366 29.5C185.366 16.5 173.366 -9.5 161.866 -9.5C150.366 -9.5 140.366 6.5 134.366 19.5C129.566 29.9 123.866 48.3332 124.366 53.4998C117.366 52.6665 92.8664 53.4998 84.3664 53.4998Z")` }}
            >
              <motion.img
                src="/images/mobile/home/bg-dashboard.png"
                alt=""
                className="w-full h-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              <EntryCard>Portfolio</EntryCard>
              {/*<motion.img
                 src='/images/mobile/home/text-dashboard.png'
                 className='absolute right-[18.974vw] bottom-[10.471vw] w-[30.769vw] h-[9.271vw]'
                 alt=''
                 variants={EntryAnimationSignpost}
                 transition={EntryAnimation}
                 />*/}
            </motion.div>
            <motion.div
              className="w-[73.846vw] h-[47.692vw] -translate-y-[65.64vw] -translate-x-[17.948vw]"
              whileTap="tap"
              onClick={() => {
                router.push("/earn");
                tapSound.play?.();
                // handleReport('1015-007');
              }}
              data-bp="1015-007"
            // style={{ clipPath: `path("M188.949 14.0009C184.382 -1.52529 152.449 9.00029 112.949 14.0014C92.9491 16.5336 101.949 57.0024 95.4491 81.5C77.4491 89 65.449 103.502 69.949 125.502C72.5053 138 158.949 129.502 224.449 125.502C276.849 122.302 267.116 104.502 260.449 95.5024C263.449 87.0024 268.549 76.6024 270.949 57.0024C273.349 37.4024 243.449 34.0024 215.949 34.0024C205.949 21.501 193.949 30.9995 188.949 14.0009Z")` }}
            >
              <motion.img
                src="/images/mobile/home/bg-vaults.png"
                alt=""
                className="w-full h-full"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              {/* <motion.img
                src="/images/mobile/home/text-vaults.png"
                className="absolute left-[32.307vw] top-[7.692vw] w-[21.538vw] h-[11.794vw]"
                alt=""
                variants={EntryAnimationSignpost}
                transition={EntryAnimation}
              /> */}

              <EntryCard
                className="right-[18.974vw] top-[7.692vw] w-[28.538vw] h-[8.794vw] whitespace-nowrap"
                childrenClassName="rotate-[-9deg]"
                bgClassName="rotate-[-9deg]"
              >
                Earn Yield
              </EntryCard>
            </motion.div>
            <motion.div
              className='relative w-[77.435vw] h-[51.794vw] -translate-y-[76.923vw] translate-x-[34.8vw]'
              // whileTap="tap"
              onClick={() => {
                // router.push('/cave');
                tapSound.play?.();
                // handleReport('1015-008');
              }}
              data-bp="1015-008"
            // style={{ clipPath: `path("M73.8874 23.9999C70.6874 26.3999 72.5541 41.6666 73.8874 48.9999C61.4874 63.3999 56.3874 77.9999 55.3875 83.5C42.3875 83.5 27.3875 100.5 30.3875 108C33.3875 115.5 50.3875 125 112.387 128.5C174.387 132 223.387 128 236.387 121.5C249.387 115 241.387 102.5 236.387 88C231.387 73.5 214.887 67 207.887 62C202.287 58 201.221 39.6667 201.387 31C203.887 30.0001 208.687 25.2002 207.887 14.0002C206.887 0.000192642 193.387 -0.999808 183.387 1.00019C175.387 2.60019 166.721 10.3335 163.387 14.0002C161.554 12.8334 154.687 9.99992 141.887 7.99992C129.087 5.99992 110.887 15.1666 103.387 19.9999C94.8875 20.3333 77.0874 21.5999 73.8874 23.9999Z")` }}
            >
              <motion.img
                src="/images/mobile/home/bg-cave.png"
                alt=""
                className="w-full h-full opacity-50"
                variants={EntryAnimationBg}
                transition={EntryAnimation}
              />
              <motion.img
                src='/images/mobile/home/text-cave.png'
                className='absolute top-0 left-[21.025vw] w-[32.679vw] h-[14.407vw] opacity-50'
                alt=''
                variants={EntryAnimationSignpost}
                transition={EntryAnimation}
              />
              <img src="/images/mobile/icon-lock.svg" alt="" className="w-[52px] h-[53px] absolute left-1/2 -translate-x-1/2 top-1/2 translate-y-[calc(-50%_-_26px)]" />
            </motion.div>
            <div className="absolute bottom-[40px] w-[113px] h-[176px]">
              <Signpost className="scale-[0.6348] origin-bottom-left z-[2]" />
              <img
                src="/images/mobile/left-bottom-tree.svg"
                alt=""
                className="absolute z-[1] w-[71px] h-[49px] object-center object-contain bottom-[-30px] left-0 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>
      {isChristmas && <ChristmasEnterance path={christmasPath} />}
    </div>
  );
};

export default Home;

export const EntryAnimation = {
  type: "spring",
  stiffness: 200,
  damping: 10
};
export const EntryAnimationBg = {
  tap: {
    y: 4,
    scale: 0.95
  }
};
export const EntryAnimationSignpost = {
  tap: {
    y: -8,
    scale: 1.1
  }
};