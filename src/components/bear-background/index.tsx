

'use client';
import { AnimatePresence, motion } from 'framer-motion';
import ArrowTopSvg from "@public/images/background/arrow-top.svg";
import BearCircleSvg from "@public/images/background/bear-circle.svg";
import BearSvg from "@public/images/background/bear.svg";
import BridgeSvg from "@public/images/background/bridge.svg";
import CloudSvg from "@public/images/background/cloud.svg";
import DappsSvg from "@public/images/background/dapps.svg";
import DashboardSvg from "@public/images/background/dashboard.svg";
import ExploreSvg from "@public/images/background/explore.svg";
import FlowersSvg from "@public/images/background/flowers.svg"

import DashboardFlowersSvg from '@public/images/background/dashboard-flowers.svg'
import HillsideSvg from '@public/images/background/hillside.svg'
import GrassSvg from '@public/images/background/grass.svg'
import DashboardBearSvg from '@public/images/background/dashboard-bear.svg'
import BridgeGroudSvg from '@public/images/background/bridge-groud.svg'
import LeftTreeSvg from '@public/images/background/tree.svg'
import RightTreeSvg from '@public/images/background/tree-2.svg'
import HatBearSvg from '@public/images/background/hat-bear.svg'

import { memo } from "react";

const Clouds = function () {
  return (
    <>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity
        }}
        className="absolute top-[109px] "
      >
        <CloudSvg />
      </motion.div>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 4
        }}
        className="absolute top-[13px]">
        <CloudSvg />
      </motion.div>

      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 8
        }}
        className="absolute top-[143px]">
        <CloudSvg />
      </motion.div>
    </>
  )
}
const DappClouds = function () {
  return (
    <>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
        className="absolute left-[73px] bottom-[479px]">
        <CloudSvg />
      </motion.div>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 4
        }}
        className="absolute right-[248px] bottom-[559px]">
        <CloudSvg />
      </motion.div>
      <motion.div
        initial={{
          right: -212
        }}
        animate={{
          right: window?.screen?.availWidth,
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
          delay: 8
        }}
        className="absolute right-[455px] bottom-[129px]">
        <CloudSvg />
      </motion.div>
    </>
  )
}
const LeftTree = function () {
  return (
    <div className="absolute left-0 bottom-0">
      <LeftTreeSvg />
    </div>
  )
}

const RightTree = function () {
  return (
    <div className="absolute right-0 bottom-0">
      <RightTreeSvg />
    </div>
  )
}

const BearTown = function () {
  return (
    <div className="absolute bottom-[389px] left-1/2 translate-x-[-149px] flex flex-col items-center">
      <BearCircleSvg />
      {/* @ts-ignore */}
      <div className="mt-[-42px] text-[90px] text-[#9F9EFF] font-CherryBomb leading-[90%]" style={{ "-webkit-text-stroke-width": 6, "-webkit-text-stroke-color": "#000" }}>BERA</div>
      {/* @ts-ignore */}
      <div className="mt-[-13px] text-[90px] text-[#EBF479] font-CherryBomb leading-[90%]" style={{ "-webkit-text-stroke-width": 6, "-webkit-text-stroke-color": "#000" }}>TOWN</div>
    </div>
  )
}
const HomeBear = function () {
  return (
    <div className="absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-168px] z-10">
      <img src='/images/background/bear.gif' />
    </div>
  )
}

const BrigeBear = function () {
  return (
    <div className="absolute w-[360px] left-1/2 bottom-[32px] translate-x-[-676px] z-10">
      <img src='/images/background/bear.gif' />
    </div>
  )
}

const Flowers = function () {
  return (
    <div className="absolute right-0 bottom-0 z-10">
      <FlowersSvg />


    </div>
  )
}

const DashboardFlowers = function () {
  return (
    <div className="absolute left-0 bottom-0 z-10">
      <DashboardFlowersSvg />
    </div>
  )
}
const DashboardBear = function () {
  return (
    <div className="absolute right-0 bottom-[31px] z-10">
      <DashboardBearSvg />
    </div>
  )
}

const Ground = function () {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[233px] bg-[#B6DF5D] border-t border-black" />
  )
}

const DashboardGroud = function () {
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <HillsideSvg className="absolute left-0 bottom-[186px]" />
      <GrassSvg className="absolute right-0 bottom-[220px]" />
      <div className="absolute left-0 bottom-0 w-full h-[233px] bg-[#B6DF5D]" />
    </div>
  )
}

const BridgeGroud = function () {
  return (
    <div className="absolute left-0 bottom-0 w-full">
      <BridgeGroudSvg className="relative mx-auto z-[5]" />
      <div className="absolute bottom-[154px] left-[-21px] right-1/2 rounded-[8px] border border-black bg-[#B6DF5D] h-[80px]" />
      <div className="absolute bottom-[-142px] left-0 right-1/2 bg-[#A7CC55] h-[297px] border-t border-black " />
      <div className="absolute bottom-[154px] right-[-21px] left-1/2 rounded-[8px] border border-black bg-[#B6DF5D] h-[80px]" />
      <div className="absolute bottom-[-142px] right-0 left-1/2 bg-[#A7CC55] h-[297px] border-t border-black " />
    </div>
  )
}



type PropsType = {
  type: "home" | "dashboard" | "bridge" | "dapps" | "dapp";
  children: React.ReactNode
}

export default memo(function BearBackground({ type, children }: PropsType) {
  return (
    <div className="relative" style={{ height: 'calc(100dvh - 68px)', minHeight: 899, overflow: "hidden" }}>
      {
        type === "home" ? (
          <>
            <Clouds />
            <BearTown />
            <Flowers />
            <HomeBear />
            <Ground />
          </>
        ) : type === "dashboard" ? (
          <>
            <Clouds />
            <DashboardFlowers />
            <DashboardBear />
            <DashboardGroud />
          </>
        ) : type === "bridge" ? (
          <>
            <Clouds />
            <BrigeBear />
            <BridgeGroud />
          </>
        ) : type === "dapps" ? (
          <>
            <Clouds />
            <Flowers />
            <Ground />
            <HatBearSvg className="absolute  left-[86px] bottom-[186px]" />
          </>
        ) : type === "dapp" ? (
          <>
            <DappClouds />
            <LeftTree />
            <RightTree />
          </>
        ) : (
          <></>
        )
      }
      {children}
    </div>
  );
});
