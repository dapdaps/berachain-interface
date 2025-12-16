"use client";

import useTokenPrice from "@/hooks/use-token-price";
import MainLayoutHeader from "@/layouts/main/header";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import MapModal from "@/sections/home/map-modal";
import useUser from "@/hooks/use-user";
import { useAccount } from "wagmi";
import Link from "next/link";
import Image from "next/image";
import useClickTracking from "@/hooks/use-click-tracking";
import GuidingTutorial from "@/components/GuidingTour/lootbox-season";
import { SceneContext } from "@/context/scene";
import { SceneStatus } from "@/configs/scene";
import RainyDay from "@/components/rainy-day";
import { useRainyDay } from "@/hooks/use-rainy-day";
import { AnimatePresence, motion } from "framer-motion";
import { useActivityStore } from "@/stores/useActivityStore";
import Downtime from "@/components/downtime";
import TreasureBook from "@/components/treasure-book";
import NFTHolderPerksModal from "@/components/nft-holder";
import { useNftReward } from "@/stores/use-nft-reward";
import dynamic from "next/dynamic";
import { useAudioStore } from "@/stores/use-audio";

// process.env.NEXT_PUBLIC_SYSTEM_MAINTENANCE_DOWNTIME === "true"
const isSystemMaintenanceDowntime = false;

const MenuV3 = dynamic(() => import("@/sections/home-earth/components/menu/v3"), { ssr: false });

const MainLayout = (props: Props) => {
  const { children, style } = props;

  const { handleTrack } = useClickTracking();
  const { initializePrice } = useTokenPrice();
  const { handleReportNoCode } = useClickTracking();
  const pathname = usePathname();
  const context = useContext(SceneContext);
  const currentScene = context.current;
  const { isRainyDay, rainyDay } = useRainyDay({ isLoadPrice: true });
  const { isDefaultTheme, themeConfig } = useActivityStore();
  const nftRewardStore: any = useNftReward();
  const audioStore: any = useAudioStore();

  useEffect(() => {
    handleReportNoCode();
    initializePrice();
  }, []);

  const { address } = useAccount();
  const { getAccessToken } = useUser();

  useEffect(() => {
    getAccessToken();
  }, [address]);

  const isVaults = useMemo(
    () => pathname === "/vaults" || pathname.startsWith("/vaults/"),
    [pathname]
  );
  const router = useRouter();
  const bg = useMemo(() => {
    if (isVaults && !isSystemMaintenanceDowntime) {
      return "bg-[url('/images/vaults/v2/bg.png')] bg-black/90 bg-no-repeat bg-top bg-cover";
    }
    if (["/"].includes(pathname)) {
      return "bg-[#0B1537]";
    }
    return "bg-[var(--background)]";
  }, [isVaults, pathname, isSystemMaintenanceDowntime]);

  const sceneStyles = useMemo(() => {
    if (isVaults) {
      return {
        background:
          "rgba(0, 0, 0, 0.9) url('/images/vaults/v2/bg.png') no-repeat top center / cover"
      };
    }

    if (
      isRainyDay &&
      (rainyDay?.bgPathname === "ALL" ||
        rainyDay?.bgPathname.includes(pathname)) &&
      !rainyDay?.excludePathname?.includes?.(pathname) &&
      rainyDay?.excludePathname !== "ALL" &&
      isDefaultTheme()
    ) {
      return { background: rainyDay?.bg };
    }

    if (
      ([
        "/",
        "/home",
        "/bridge",
        "/dapps",
        "/portfolio",
        "/kingdomly",
        "/bintent",
        "/ibgt",
        "/lend",
        "/swap",
        "/stake",
        "/tokens",
        "/validators",
        "/hall"
      ].includes(pathname) ||
        pathname.startsWith("/lending/") ||
        pathname.startsWith("/staking/") ||
        pathname.startsWith("/bridge/") ||
        pathname.startsWith("/dex/")) &&
      !isDefaultTheme()
    ) {
      return {
        backgroundColor: themeConfig.primaryColor
      };
    }

    if (currentScene?.status === SceneStatus.Ongoing) {
      if (currentScene?.bgPathname.includes(pathname)) {
        return { background: currentScene?.bg };
      }
    }

    if (pathname.startsWith("/invite/")) {
      return {
        height: "100vh",
        overflow: "hidden"
      };
    }

    return {};
  }, [
    currentScene,
    isRainyDay,
    rainyDay,
    pathname,
    isDefaultTheme,
    themeConfig.primaryColor
  ]);

  const [showGuide, setShowGuide] = useState(true);

  const routes = ["/explore", "/game", "/", "/earn", "/activity/christmas", "/home", "/belong", "/carnival/lucky-bera", "/carnival/big-wheel"];

  return (
    <div
      id="layout"
      className={`min-h-screen relative flex flex-col items-stretch justify-start transition-background duration-150 ${bg}`}
      style={isSystemMaintenanceDowntime ? {} : {
        ...sceneStyles,
        ...style
      }}
      onClick={handleTrack}
    >
      {
        isSystemMaintenanceDowntime ? (
          <Downtime />
        ) : (
          <>
            <MainLayoutHeader
              className={routes.includes(pathname) ? "bg-transparent !fixed" : ""}
            />
            <div className="grow">{children}</div>
          </>
        )
      }
      <div className="fixed left-[16px] bottom-[16px] z-[13] flex items-center gap-[6px]">
        <Link
          className="hover:scale-110 ease-in-out duration-300 w-[90px] h-[26px] rounded-full bg-white/50 flex items-center justify-center cursor-pointer"
          href="https://app.dapdap.net?from=berachain"
          target="_blank"
          data-bp="1010-011"
        >
          <svg
            width="72"
            height="19"
            viewBox="0 0 72 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.47707 9.48733C1.17823 8.183 2.58695 4.83731 2.58695 4.83731L10.1327 4.33582C11.5921 3.94477 13.0922 4.81086 13.4833 6.27028L16.6741 11.5287C16.1612 14.0935 15.7361 15.5475 14.2767 15.9386L6.62858 18.1429C5.16916 18.534 3.66905 17.6679 3.278 16.2085L1.47707 9.48733Z"
              fill="#181A27"
            />
            <path
              d="M2.42427 6.64575C2.02154 5.14274 2.9135 3.59784 4.4165 3.19511L11.3384 1.34039C12.8414 0.937665 14.3863 1.82962 14.789 3.33262L16.6438 10.2545C17.0465 11.7575 16.1545 13.3024 14.6515 13.7052L7.72963 15.5599C6.22662 15.9626 4.68172 15.0706 4.27899 13.5676L2.42427 6.64575Z"
              fill="#EBF479"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.5207 2.02075L4.59881 3.87547C3.47155 4.17752 2.80259 5.33619 3.10463 6.46345L4.95935 13.3853C5.2614 14.5126 6.42007 15.1816 7.54733 14.8795L14.4692 13.0248C15.5965 12.7227 16.2654 11.5641 15.9634 10.4368L14.1087 3.51493C13.8066 2.38767 12.648 1.71871 11.5207 2.02075ZM4.4165 3.19511C2.9135 3.59784 2.02154 5.14274 2.42427 6.64575L4.27899 13.5676C4.68172 15.0706 6.22662 15.9626 7.72963 15.5599L14.6515 13.7052C16.1545 13.3024 17.0465 11.7575 16.6438 10.2545L14.789 3.33262C14.3863 1.82962 12.8414 0.937665 11.3384 1.34039L4.4165 3.19511Z"
              fill="#181A27"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.923 5.12098L7.45607 5.51404C6.94355 5.65137 6.6394 6.17817 6.77673 6.69069C6.91406 7.20321 7.44087 7.50736 7.95339 7.37003L9.25131 7.02225C9.86793 6.85703 10.5017 7.22296 10.6669 7.83957C10.8322 8.45618 10.4662 9.08998 9.84963 9.2552L8.56772 9.59869C8.04636 9.73839 7.73695 10.2743 7.87665 10.7957C8.01635 11.317 8.55225 11.6264 9.07362 11.4867L10.5245 11.098C12.175 10.6557 13.1545 8.9592 12.7123 7.3087C12.27 5.65821 10.5735 4.67873 8.923 5.12098Z"
              fill="#181A27"
            />
            <path
              d="M21.7295 4.8064H25.289C26.1462 4.8064 26.9041 4.97703 27.5628 5.3183C28.2295 5.65957 28.7454 6.13577 29.1105 6.74688C29.4835 7.35799 29.67 8.05641 29.67 8.84212C29.67 9.66752 29.4875 10.3937 29.1224 11.0207C28.7652 11.6477 28.2533 12.1358 27.5867 12.485C26.9279 12.8263 26.162 12.9969 25.289 12.9969H21.7295V4.8064ZM25.17 10.854C25.7652 10.854 26.2176 10.6675 26.5271 10.2945C26.8446 9.91356 27.0033 9.42149 27.0033 8.81831C27.0033 8.24688 26.8486 7.7945 26.539 7.46117C26.2374 7.1199 25.7811 6.94926 25.17 6.94926H24.3605V10.854H25.17Z"
              fill="#181A27"
            />
            <path
              d="M33.2732 13.0921C32.7574 13.0921 32.2732 12.9572 31.8209 12.6874C31.3764 12.4096 31.0193 12.0366 30.7494 11.5683C30.4796 11.0921 30.3447 10.5644 30.3447 9.98498C30.3447 9.41355 30.4796 8.89768 30.7494 8.43736C31.0193 7.9691 31.3804 7.60402 31.8328 7.34212C32.2851 7.08021 32.7653 6.94926 33.2732 6.94926C33.6859 6.94926 34.0669 7.06434 34.4161 7.2945C34.7732 7.52466 35.0431 7.8699 35.2256 8.33022V6.94926H37.7256V12.9969H35.2256V11.8898C34.8288 12.6913 34.178 13.0921 33.2732 13.0921ZM34.0471 11.2112C34.3645 11.2112 34.6344 11.1001 34.8566 10.8778C35.0867 10.6477 35.2098 10.3778 35.2256 10.0683V9.97308C35.2098 9.65562 35.0828 9.38578 34.8447 9.16355C34.6145 8.94133 34.3486 8.83022 34.0471 8.83022C33.7137 8.83022 33.428 8.94927 33.1899 9.18736C32.9597 9.41752 32.8447 9.6953 32.8447 10.0207C32.8447 10.354 32.9637 10.6358 33.2018 10.8659C33.4399 11.0961 33.7217 11.2112 34.0471 11.2112Z"
              fill="#181A27"
            />
            <path
              d="M38.9315 7.11593H41.4434V8.15165C41.8243 7.35006 42.4711 6.94926 43.3839 6.94926C43.9156 6.94926 44.4037 7.08418 44.8481 7.35402C45.3005 7.61593 45.6537 7.98101 45.9077 8.44926C46.1696 8.91752 46.3005 9.44133 46.3005 10.0207C46.3005 10.6001 46.1656 11.1239 45.8958 11.5921C45.6339 12.0604 45.2767 12.4294 44.8243 12.6993C44.3799 12.9612 43.9037 13.0921 43.3958 13.0921C42.491 13.0921 41.8402 12.6913 41.4434 11.8898V14.5445L38.9315 15.0207V7.11593ZM42.6338 11.2112C42.9592 11.2112 43.237 11.0921 43.4672 10.854C43.6973 10.6159 43.8124 10.3382 43.8124 10.0207C43.8124 9.68736 43.6934 9.40562 43.4553 9.17546C43.2251 8.9453 42.9513 8.83022 42.6338 8.83022C42.3085 8.83022 42.0307 8.9453 41.8005 9.17546C41.5704 9.39768 41.4553 9.66355 41.4553 9.97308V10.0207C41.4553 10.354 41.5704 10.6358 41.8005 10.8659C42.0386 11.0961 42.3164 11.2112 42.6338 11.2112Z"
              fill="#181A27"
            />
            <path
              d="M47.3178 4.8064H50.8774C51.7345 4.8064 52.4924 4.97703 53.1512 5.3183C53.8178 5.65957 54.3337 6.13577 54.6988 6.74688C55.0718 7.35799 55.2583 8.05641 55.2583 8.84212C55.2583 9.66752 55.0758 10.3937 54.7107 11.0207C54.3536 11.6477 53.8417 12.1358 53.175 12.485C52.5163 12.8263 51.7504 12.9969 50.8774 12.9969H47.3178V4.8064ZM50.7583 10.854C51.3536 10.854 51.8059 10.6675 52.1155 10.2945C52.4329 9.91356 52.5917 9.42149 52.5917 8.81831C52.5917 8.24688 52.4369 7.7945 52.1274 7.46117C51.8258 7.1199 51.3694 6.94926 50.7583 6.94926H49.9488V10.854H50.7583Z"
              fill="#181A27"
            />
            <path
              d="M58.8616 13.0921C58.3457 13.0921 57.8616 12.9572 57.4092 12.6874C56.9647 12.4096 56.6076 12.0366 56.3378 11.5683C56.0679 11.0921 55.933 10.5644 55.933 9.98498C55.933 9.41355 56.0679 8.89768 56.3378 8.43736C56.6076 7.9691 56.9687 7.60402 57.4211 7.34212C57.8735 7.08021 58.3536 6.94926 58.8616 6.94926C59.2743 6.94926 59.6552 7.06434 60.0044 7.2945C60.3616 7.52466 60.6314 7.8699 60.814 8.33022V6.94926H63.314V12.9969H60.814V11.8898C60.4171 12.6913 59.7663 13.0921 58.8616 13.0921ZM59.6354 11.2112C59.9529 11.2112 60.2227 11.1001 60.4449 10.8778C60.6751 10.6477 60.7981 10.3778 60.814 10.0683V9.97308C60.7981 9.65562 60.6711 9.38578 60.433 9.16355C60.2028 8.94133 59.937 8.83022 59.6354 8.83022C59.3021 8.83022 59.0163 8.94927 58.7782 9.18736C58.5481 9.41752 58.433 9.6953 58.433 10.0207C58.433 10.354 58.5521 10.6358 58.7901 10.8659C59.0282 11.0961 59.31 11.2112 59.6354 11.2112Z"
              fill="#181A27"
            />
            <path
              d="M64.5198 7.11593H67.0317V8.15165C67.4127 7.35006 68.0595 6.94926 68.9722 6.94926C69.5039 6.94926 69.992 7.08418 70.4365 7.35402C70.8889 7.61593 71.242 7.98101 71.496 8.44926C71.7579 8.91752 71.8889 9.44133 71.8889 10.0207C71.8889 10.6001 71.7539 11.1239 71.4841 11.5921C71.2222 12.0604 70.8651 12.4294 70.4127 12.6993C69.9682 12.9612 69.492 13.0921 68.9841 13.0921C68.0793 13.0921 67.4285 12.6913 67.0317 11.8898V14.5445L64.5198 15.0207V7.11593ZM68.2222 11.2112C68.5476 11.2112 68.8254 11.0921 69.0555 10.854C69.2857 10.6159 69.4008 10.3382 69.4008 10.0207C69.4008 9.68736 69.2817 9.40562 69.0436 9.17546C68.8135 8.9453 68.5396 8.83022 68.2222 8.83022C67.8968 8.83022 67.619 8.9453 67.3889 9.17546C67.1587 9.39768 67.0436 9.66355 67.0436 9.97308V10.0207C67.0436 10.354 67.1587 10.6358 67.3889 10.8659C67.6269 11.0961 67.9047 11.2112 68.2222 11.2112Z"
              fill="#181A27"
            />
          </svg>
        </Link>
        <Link
          className="ease-in-out duration-300 w-[26px] h-[26px] rounded-full bg-white/50 flex items-center justify-center cursor-pointer"
          href="https://x.com/0xberatown"
          target="_blank"
          data-bp="1010-015"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.1428 5.08177L11.6108 0H10.5524L6.6712 4.41152L3.5736 0H0L4.6852 6.67164L0 12H1.0584L5.1544 7.34028L8.4264 12H12M1.4404 0.780949H3.0664L10.5516 11.2574H8.9252"
              fill="black"
            />
          </svg>
        </Link>
        <Link
          className="hover:scale-110 ease-in-out duration-300 w-[26px] h-[26px] rounded-full bg-white/50 flex items-center justify-center cursor-pointer"
          href="https://t.me/DapDapDiscussion"
          target="_blank"
          data-bp="1010-016"
        >
          <svg
            width="15"
            height="12"
            viewBox="0 0 15 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.643 11.274L5.87603 7.91777L12.2677 2.42717C12.5506 2.1812 12.2094 2.06219 11.8349 2.27642L3.94523 7.02912L0.533028 5.99764C-0.199346 5.79929 -0.207669 5.31529 0.699476 4.96617L13.9904 0.0785899C14.5979 -0.183245 15.1805 0.221409 14.9475 1.11006L12.6838 11.274C12.5257 11.996 12.0679 12.1706 11.4354 11.8374L7.98993 9.40943L6.33376 10.9408C6.14235 11.1233 5.98422 11.274 5.643 11.274Z"
              fill="black"
            />
          </svg>
        </Link>
        <Link
          className="hover:scale-110 ease-in-out duration-300 w-[26px] h-[26px] rounded-full bg-white/50 flex items-center justify-center cursor-pointer"
          href="https://discord.gg/invite/dapdap"
          target="_blank"
          data-bp="1010-017"
        >
          <svg
            width="16"
            height="10"
            viewBox="0 0 16 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 0.491013C4.81493 0.491013 2.58063 1.69243 2.58063 1.69243C3.80475 0.731297 5.94397 0.177601 5.94397 0.177601L5.74193 0C3.73344 0.0313412 1.9151 1.25365 1.9151 1.25365C-0.129049 5.00415 0.00168121 8.24275 0.00168121 8.24275C1.66552 10.1337 4.13751 9.99786 4.13751 9.99786L4.98132 9.05762C3.49575 8.77555 2.55686 7.61592 2.55686 7.61592C2.55686 7.61592 4.79116 8.95315 8 8.95315C11.2088 8.95315 13.4431 7.61592 13.4431 7.61592C13.4431 7.61592 12.5043 8.77555 11.0187 9.05762L11.8625 9.99786C11.8625 9.99786 14.3345 10.1337 15.9983 8.24275C15.9983 8.24275 16.129 5.00415 14.0849 1.25365C14.0849 1.25365 12.2666 0.0313412 10.2581 0L10.056 0.177601C10.056 0.177601 12.1953 0.731297 13.4194 1.69243C13.4194 1.69243 11.1851 0.491013 8 0.491013ZM5.53989 4.45046C6.31239 4.45046 6.94227 5.04594 6.93039 5.77724C6.93039 6.49809 6.31239 7.10402 5.53989 7.10402C4.77928 7.10402 4.16128 6.49809 4.16128 5.77724C4.16128 5.04594 4.76739 4.45046 5.53989 4.45046ZM10.4958 4.45046C11.2683 4.45046 11.8863 5.04594 11.8863 5.77724C11.8863 6.49809 11.2683 7.10402 10.4958 7.10402C9.73515 7.10402 9.11715 6.49809 9.11715 5.77724C9.11715 5.04594 9.72326 4.45046 10.4958 4.45046Z"
              fill="black"
            />
          </svg>
        </Link>
        <Link
          className="hover:scale-110 ease-in-out duration-300 w-[26px] h-[26px] rounded-full bg-white/50 flex items-center justify-center cursor-pointer"
          href="https://bera.town/docs"
          target="_blank"
        >
          <Image
            src="/images/icon-gitbook.svg"
            alt="gitbook"
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </Link>
        <Link
          className="hover:scale-110 ease-in-out duration-300 w-[26px] h-[26px] rounded-full bg-white/50 flex items-center justify-center cursor-pointer"
          href="https://dapdap.mirror.xyz/FSRc-5-o7gHVfTnFDgYPFOMktA7kWreb-m0S3paQCdk"
          target="_blank"
          data-bp="1010-014"
        >
          <Image
            src="/images/mirror.png"
            alt="Mirror"
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <MapModal />
      <MenuV3 />
      <GuidingTutorial />
      <NFTHolderPerksModal open={nftRewardStore.showNftReward} onClose={() => { nftRewardStore.set({ showNftReward: false }) }} />
      {
        !isSystemMaintenanceDowntime && (
          <>
            <AnimatePresence mode="wait">
              {isRainyDay &&
                (rainyDay?.bgPathname === "ALL" ||
                  rainyDay?.bgPathname.includes(pathname)) &&
                rainyDay?.excludePathname !== "ALL" &&
                !rainyDay?.excludePathname?.includes?.(pathname) &&
                isDefaultTheme() && (
                  <motion.div
                    variants={{
                      visible: { opacity: 1 },
                      invisible: { opacity: 0 }
                    }}
                    animate="visible"
                    initial="invisible"
                    exit="invisible"
                    transition={{
                      duration: 2
                    }}
                  >
                    <RainyDay dropCount={120} minSpeed={0.5} maxSpeed={2} />
                  </motion.div>
                )}
            </AnimatePresence>
            {/* {
              pathname === '/' && (
                <motion.div
                  className="fixed top-[420px] right-[10px] z-[15] flex items-center gap-[6px] cursor-pointer"
                  onClick={() => {
                    router.push("/carnival/guess-who");
                  }}
                  animate={{
                    x: [0, -6, 6, -6, 6, 0, 0],
                    rotate: [0, -5, 5, -3, 3, 0, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 5,
                    duration: 0.4,
                    times: [0, 0.18, 0.36, 0.54, 0.72, 0.9, 1],
                    ease: "easeInOut"
                  }}
                >
                  <img src="/images/home/guess-who.png" alt="guess-who" className="w-[92px]" />
                </motion.div>
              )
            } */}

            <TreasureBook />
          </>
        )
      }
      {
        [/^\/carnival/].some((reg) => reg.test(pathname)) && (
          <div className="fixed bottom-[8px] right-[100px] z-[15] flex items-center gap-[6px]">
            <motion.button
              type="button"
              className="w-[20px] h-[20px] bg-no-repeat bg-center bg-contain shrink-0"
              style={{
                backgroundImage: `url("${audioStore.open ? '/images/icon-audio.png' : '/images/icon-audio-disabled.png'}")`,
              }}
              onClick={() => {
                audioStore.setOpen(!audioStore.open);
              }}
              animate={audioStore.open ? {
                transform: ["rotate(0deg)", "rotate(360deg)"],
              } : {
                transform: "rotate(0deg)",
              }}
              transition={audioStore.open ? {
                repeat: Infinity,
                duration: 3,
                ease: "linear",
              } : {
                duration: 0,
              }}
            />
          </div>
        )
      }
    </div>
  );
};

export default MainLayout;

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
