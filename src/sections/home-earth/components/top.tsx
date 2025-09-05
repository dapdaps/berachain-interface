"use client";

import Vaults from "@/components/vaults";
import { HomeEarthContext } from "@/sections/home-earth/context";
import { VisibleAnimation } from "@/sections/home-earth/utils";
import { useActivityStore } from "@/stores/useActivityStore";
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useContext } from "react";
import LGBTLogo from "./lgbt-animated-logo";
import clsx from "clsx";
import { useNftReward } from "@/stores/use-nft-reward";

const HomeEarthTop = (props: any) => {
  const { isLogo = true, isAirdrop = true, className } = props;
  const { isDefaultTheme } = useActivityStore();
  const { isRainyDay } = useContext(HomeEarthContext);
  const { scrollY } = useScroll();
  const nftRewardStore: any = useNftReward();

  const logoY = useTransform(scrollY, (value) => {
    return -Math.max(0, value);
  });

  return (
    <div className={clsx("relative w-full pt-[20px] flex justify-center shrink-0", className)}>
      {
        isLogo && (
          <motion.div className="mt-[40px] relative" style={{ y: logoY }}>
            <motion.img
              src="/images/nft-holder/nft-1-home.png"
              alt="NFT 1"
              onClick={() => {
                nftRewardStore.set({
                  showNftReward: true,
                })
              }}
              className={clsx("w-[84px] absolute cursor-pointer", {
                "right-[25px] top-[30px]": !isDefaultTheme(),
                "right-[-45px] top-[80px]": isDefaultTheme(),
              })}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              whileHover={{ y: -4, transition: { duration: 0.1, delay: 0 } }}
            />
            <motion.img
              src="/images/nft-holder/nft-2-home.png"
              alt="NFT 2"
              onClick={() => {
                nftRewardStore.set({
                  showNftReward: true,
                })
              }}
              className={clsx("w-[94px] absolute cursor-pointer", {
                "right-[65px] top-[-20px]": !isDefaultTheme(),
                "right-[-20px] top-[30px]": isDefaultTheme(),
              })}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              whileHover={{
                y: -4,
                transition: {
                  duration: 0.1,
                  delay: 0
                }
              }}
            />
            {isDefaultTheme() ? (
              <motion.img
                src="/images/home-earth/beratown-logo.png"
                alt=""
                className="w-[340px] h-[209px] relative z-10 pointer-events-none"
                variants={{
                  visible: {
                    opacity: 1,
                    scale: 1
                  },
                  invisible: {
                    opacity: 0,
                    scale: 0.5
                  }
                }}
                animate="visible"
                initial="invisible"
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  duration: 1,
                  delay: 0.3
                }}
              />
            ) : (
              <LGBTLogo />
            )}
          </motion.div>
        )
      }
      <div className="absolute left-0 -top-[88px] w-[472px] h-[371px] overflow-hidden">
        <AnimatePresence mode="wait">
          {isRainyDay ? (
            <motion.img
              key="down"
              src="/images/home-earth/cloud-left-rainy.svg"
              alt=""
              className="animate-cloud-float-left origin-top-left w-full h-full"
              {...VisibleAnimation}
            />
          ) : (
            <motion.img
              key="up"
              src="/images/home-earth/cloud-left.svg"
              alt=""
              className="animate-cloud-float-left origin-top-left w-full h-full"
              {...VisibleAnimation}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="absolute right-0 -top-[88px] w-[493px] h-[370px] overflow-hidden">
        <AnimatePresence mode="wait">
          {isRainyDay ? (
            <motion.img
              key="down"
              src="/images/home-earth/cloud-right-rainy.svg"
              alt=""
              className="animate-cloud-float-right origin-top-right w-full h-full"
              {...VisibleAnimation}
            />
          ) : (
            <motion.img
              key="up"
              src="/images/home-earth/cloud-right.svg"
              alt=""
              className="animate-cloud-float-right origin-top-right w-full h-full"
              {...VisibleAnimation}
            />
          )}
        </AnimatePresence>
      </div>
      {
        isAirdrop && (
          <Vaults className="!left-[unset] right-[100px] !top-[150px]" />
        )
      }
    </div>
  );
};

export default HomeEarthTop;
