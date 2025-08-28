"use client";

import ConnectWallet from "@/components/connect-wallet";
import BGTCoin, { CoinType } from "@/layouts/main/BGTCoin";
import Logo from "@/layouts/main/logo";
import IconMap from "@public/images/icon-map.svg";
import LaptopChain from "@/components/connect-wallet/chain/laptop";
import useMapModalStore from "@/stores/useMapModalStore";
import { useProgressRouter } from "@/hooks/use-progress-router";
import { useBgtCount } from "@/hooks/use-bgt-count";

import { useHall } from "@/stores/hall";
import { numberFormatter } from "@/utils/number-formatter";
import MintHoneyModal from "@/components/mint-honey-modal";
import { useState } from "react";
import Hall from "./hall";
import MintStable from "./mint-stable";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import CheckInEntry from "@/components/check-in/entry";
import PointsEntry from "@/components/points/entry";

const MainLayoutHeader = (props: Props) => {
  const { className, style } = props;

  const store: any = useMapModalStore();

  const hallStore:any = useHall()
  const router = useProgressRouter();
  const { iBGTCount, BGTCount } = useBgtCount();

  const goHome = () => {
    router.replace("/");
  };

  return (
    <header
      className={`w-full h-[68px] stroke-black sticky font-CherryBomb top-0 z-50 ${className} bear-header`}
      style={style}
    >
      <div className="w-full h-full px-[40px] flex justify-between items-center">
        <div className="flex items-center gap-x-[40px]">
          <Logo />
          <div
            data-bp="1010-001"
            onClick={() => store.setOpen(true)}
            className="ml-[-20px] hover:scale-[1.1] ease-in-out duration-300 cursor-pointer"
          >
            <IconMap />
          </div>
          <button
            onClick={goHome}
            className="hover:scale-[1.1] ease-in-out duration-300 before:content-[''] before:block before:absolute before:bottom-0 before:left-0 before:w-full before:h-[30px] before:rounded-[10px] before:bg-[#CCD55B] before:z-0 relative bg-[#EBF479] rounded-[10px] border border-solid border-black px-[25px] py-[9px] leading-none text-black text-center text-[16px] font-[400]"
            data-bp="1010-002"
          >
            <span className="relative z-10">Home</span>
          </button>
        </div>
        <div className="text-white flex items-center gap-x-[17px]">

          {/* <div className="cursor-pointer mt-[4px] w-[120px]" onClick={() => setMineModalOpen(true)}>
            <img src="/images/mint-honey.png" alt="mint" />
          </div> */}

          <CheckInEntry />

          <PointsEntry />

          <motion.div
            className="cursor-pointer relative -top-[8px] w-[57px]"
            onClick={() => {
              router.push("/kingdomly")
            }}
            whileHover={{ x: -4 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/images/icon-nft.png" alt="icon-nft" />
          </motion.div>

          <MintStable />


          {/* <div className="relative">
            <div className="grayscale w-[107px] h-[30px] rounded-[43px] border border-[#88FFB6] bg-[#AEAEAE]  shadow-[0_3px_0_0_black] cursor-not-allowed">
              <div className="-ml-[12px] w-[111px]">
                <img src="/images/icon-launchpad-bg.png" alt="icon-launchpad-bg" />
              </div>
            </div>
            <div className="absolute -right-[16px] -top-[6px] flex items-center justify-center w-[42px] h-[13px] rounded-[8px] border-black border bg-[#FFF5A9]">
              <span className="text-black text-[16px] font-bold scale-50">Thoon...</span>
            </div>
          </div> */}
          {/* <Hall /> */}
          <div className="cursor-pointer pl-[5px] flex items-center gap-[4px] w-[130px] h-[30px] rounded-[18px] border border-black bg-[#4485FF] active:shadow-none active:translate-y-[3px] shadow-[0_3px_0_0_black] bg-[url('/images/hall/icon-hall-button-bg.svg')] bg-center"
            onClick={() => {
              hallStore.set({
                currentTab: "validators"
              })
              router.replace("/hall")
            }}
          >
            <div className="w-full h-full -mt-[3px]">
              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 1500, disableOnInteraction: false }}
                loop={true}
                className="w-full h-full"
              >
                <SwiperSlide>
                  <div className="flex items-center">
                    <img src="/images/hall/icon-ibgt.svg" alt="icon-ibgt" />
                    <div className="text-[#FFF5A9] text-[16px] text-stroke-1 font-CherryBomb whitespace-nowrap">{numberFormatter(iBGTCount, 3, true)} iBGT</div>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="flex items-center">
                    <img src="/images/hall/icon-bgt.svg" alt="icon-bgt" />
                    <div className="text-[#FFF5A9] text-[16px] text-stroke-1 font-CherryBomb whitespace-nowrap">{numberFormatter(BGTCount, 3, true)} BGT</div>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>

          {/* <BGTCoin type={CoinType.BGT} count={BGTCount} bp="1010-004" />
          <BGTCoin type={CoinType.iBGT} count={iBGTCount} bp="1010-005" /> */}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default MainLayoutHeader;

interface Props {
  className?: string;
  style?: React.CSSProperties;
}
