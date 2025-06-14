"use client";

import Vaults from "@/components/vaults";
import { HomeEarthContext } from "@/sections/home-earth/context";
import { VisibleAnimation } from "@/sections/home-earth/utils";
import { useActivityStore } from "@/stores/useActivityStore";
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useContext } from "react";
import LGBTLogo from "./lgbt-animated-logo";

const HomeEarthTop = (props: any) => {
  const {} = props;
  const { isDefaultTheme } = useActivityStore();
  const { isRainyDay } = useContext(HomeEarthContext);
  const { scrollY } = useScroll();

  const logoY = useTransform(scrollY, (value) => {
    return -Math.max(0, value);
  });

  return (
    <div className="relative w-full pt-[20px] flex justify-center shrink-0">
      <motion.div className="mt-[40px]" style={{ y: logoY }}>
        {isDefaultTheme() ? (
          <motion.img
            src="/images/home-earth/beratown-logo.png"
            alt=""
            className="w-[340px] h-[209px]"
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
      <Vaults className="!left-[unset] right-[100px] !top-[150px]" />
    </div>
  );
};

export default HomeEarthTop;
