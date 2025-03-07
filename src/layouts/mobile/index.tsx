"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import IconMenu from "@public/images/mobile/menu.svg";
import IconClose from "@public/images/mobile/close.svg";
import MenuButton from "@/components/mobile/menuButton";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useProgressRouter } from "@/hooks/use-progress-router";
import useClickTracking from "@/hooks/use-click-tracking";
import { useAccount } from "wagmi";
import useUser from "@/hooks/use-user";
import { useChristmas } from "@/hooks/use-christmas";
import clsx from "clsx";
import GuidingTutorial from "@/components/GuidingTour/mainnet";

const menuItems = [
  // { id: 1, title: "Bera Cave", href: "/cave", dataBp: "1015-002-001" },
  { id: 2, title: "Bridge", href: "/bridge", dataBp: "1015-002-002" },
  {
    id: 3,
    title: "Token Marketplace",
    href: "/marketplace",
    dataBp: "1015-002-003"
  },
  {
    id: 4,
    title: "Earn",
    href: "/earn",
    dataBp: "1015-002-004"
  },
  { id: 5, title: "DApps", hasDropdown: true, dataBp: "1015-002-005" },
  {
    id: 6,
    title: "Portfolio",
    href: "/portfolio",
    dataBp: "1015-002-006",
    disabled: true
  },
  { id: 7, title: "Maps", href: "/", dataBp: "1015-002-007" }
];

interface DApp {
  id: string;
  name: string;
  icon: string;
  href?: string;
}

const dapps: DApp[] = [
  {
    id: "infrared",
    name: "Infrared",
    icon: "/images/dapps/infrared.svg",
    href: "/staking/infrared"
  },
  // {
  //   id: "berps",
  //   name: "Berps",
  //   icon: "/images/dapps/infrared/berps.svg",
  //   href: "/staking/berps"
  // },
  // {
  //   id: "bex",
  //   name: "Bex",
  //   icon: "/images/dapps/bex.svg",
  //   href: "/dex/bex"
  // },
  // {
  //   id: "bend",
  //   name: "Bend",
  //   icon: "/images/dapps/bend.svg",
  //   href: "/lending/bend"
  // },
  {
    id: "kodiak",
    name: "Kodiak",
    icon: "/images/dapps/kodiak.svg",
    href: "/dex/kodiak"
  },
  {
    id: "dolomite",
    name: "Dolomite",
    icon: "/images/dapps/dolomite.svg",
    href: "/lending/dolomite"
  },
  {
    id: "stargate",
    name: "Stargate",
    icon: "/images/dapps/stargate.svg",
    href: "/bridge/stargate"
  },
  {
    id: "ooga",
    name: "Ooga Booga",
    icon: "/images/dapps/ooga-booga.svg",
    href: "/dex/ooga-booga"
  }
];

const MobileLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDappsOpen, setIsDappsOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const toggleDapps = () => setIsDappsOpen(!isDappsOpen);
  const router = useProgressRouter();
  const { handleReportNoCode, handleTrack } = useClickTracking();
  const { isChristmas } = useChristmas();

  const DAppIcon: React.FC<{ dapp: DApp }> = ({ dapp }) => {
    if (dapp.href) {
      return (
        <div
          onClick={() => dapp.href && router.push(dapp.href)}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-[12.82vw] h-[12.82vw] rounded-[2.56vw] flex items-center justify-center">
            <Image
              src={dapp.icon}
              alt={dapp.name}
              className="w-[10.769vw] h-[10.769vw]"
              width={"42"}
              height={"42"}
            />
          </div>
          <span className="font-CherryBomb text-base font-normal leading-[14.4px] text-center text-black">
            {dapp.name}
          </span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center gap-1 blur-[2px]">
        <div className="w-[12.82vw] h-[12.82vw] rounded-[2.56vw] flex items-center justify-center">
          <Image
            src={dapp.icon}
            alt={dapp.name}
            className="w-[10.769vw] h-[10.769vw]"
            width={"42"}
            height={"42"}
          />
        </div>
        <span className="font-CherryBomb text-base font-normal leading-[14.4px] text-center text-black">
          {dapp.name}
        </span>
      </div>
    );
  };

  const pathname = usePathname();
  const { address } = useAccount();
  const { getAccessToken } = useUser();

  useEffect(() => {
    getAccessToken();
  }, [address]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname, setIsMenuOpen]);

  useEffect(() => {
    handleReportNoCode();
  }, []);

  const routes: any = [];

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div
      className={`relative overflow-hidden ${
        routes.includes(pathname) ? "min-h-full" : "h-full"
      }`}
      style={{
        backgroundColor: !routes.includes(pathname) ? "#96d6ff" : "transparent"
      }}
      onClick={handleTrack}
    >
      <main className="h-full">{children}</main>
      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-[#F6EFC8] flex flex-col items-center pt-12 pb-24 z-[50]"
            style={{
              overflowY: isDappsOpen ? "scroll" : "auto"
            }}
          >
            <div className="w-full max-w-md flex justify-center items-center flex-col gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={clsx(
                    "w-full flex justify-center items-center flex-col relative z-0 whitespace-nowrap",
                    item.disabled && "opacity-50"
                  )}
                >
                  <MenuButton
                    href={item.disabled ? "" : item.href}
                    hasDropdown={item.hasDropdown}
                    isActive={item.hasDropdown && isDappsOpen}
                    onClick={item.hasDropdown ? toggleDapps : undefined}
                    toggle={toggleMenu}
                    dataBp={item.dataBp}
                  >
                    {item.title}
                  </MenuButton>

                  <AnimatePresence>
                    {item.hasDropdown && isDappsOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                          transition: { duration: 0.3 }
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full -mt-6 px-4 py-6 bg-[#D5CDA1] overflow-hidden z-[-1] pt-[13.84vw]"
                      >
                        <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                          {dapps.map((dapp) => (
                            <DAppIcon key={dapp.id} dapp={dapp} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="absolute h-9 bottom-[68px] left-0 right-0 flex px-4 items-center justify-between"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {
        !pathname.startsWith('/invite/') && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-4 py-3 z-[50]">
          <div className="flex items-center gap-3">
            <div className="relative">
              {/* {["/"].includes(pathname) && isChristmas && (
                <motion.div
                  className="absolute w-[31.718vw] -left-[2.564vw] -top-[31.282vw] z-[1]"
                  onClick={() => {
                    router.push("/activity/christmas");
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                  whileTap={{
                    y: 8,
                    scale: 0.95
                  }}
                >
                  <img
                    className="w-full"
                    src="/images/mobile/henlo.png"
                    alt="Henlo"
                  />
                </motion.div>
              )} */}
              <motion.img
                src="/images/mobile/town.png"
                alt="Town"
                className="relative w-[15.9vw] h-auto z-[2]"
                onClick={handleHome}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
                whileTap={{
                  y: 8,
                  scale: 0.95
                }}
                data-bp="1015-001"
              />
            </div>
            {isMenuOpen && (
              <>
                <Link
                  className="z-[4] hover:scale-110 ease-in-out duration-300 w-[98px] h-[28px] rounded-full bg-[rgba(217,217,217,0.5)]"
                  href="https://app.dapdap.net?from=berachain"
                  target="_blank"
                  data-bp="1015-002-008"
                >
                  <Image
                    src="/images/dapdap.svg"
                    alt="dapdap-link"
                    width={98}
                    height={28}
                    className="cursor-pointer"
                  />
                </Link>
                <img
                  onClick={() => window.open("https://dapdap.mirror.xyz")}
                  src="/images/mobile/mirror.png"
                  className="w-[29px] h-[29px]"
                  alt=""
                  data-bp="1015-002-009"
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-[20px]">
            {/* {isMenuOpen && (
              <div
                className="cursor-pointer"
                onClick={() => {
                  window.open("https://bartio.faucet.berachain.com");
                }}
                data-bp="1015-002-010"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[26px] w-[26px] hover:opacity-80"
                >
                  <g clipPath="url(#clip0_58_106)">
                    <rect width="16" height="16" rx="4" fill="#0284C7"></rect>
                    <path
                      d="M13.0094 7.0098H12.5548V6.01306C12.5548 3.63489 10.6138 1.69388 8.2356 1.69388C5.85742 1.69388 3.91641 3.63489 3.91641 6.01306V16.3476H3.00711C2.72733 16.3476 2.5 16.575 2.5 16.8547V18.3061H7.27383V16.8547C7.27383 16.575 7.04651 16.3476 6.76672 16.3476H5.85742V6.01306C5.85742 4.70157 6.9241 3.65237 8.21811 3.65237C9.51212 3.65237 10.5788 4.71906 10.5788 6.01306V7.0098H10.1067C9.82687 7.0098 9.59955 7.23712 9.59955 7.51691V8.46118C9.59955 8.74097 9.82687 8.96829 10.1067 8.96829H12.9919C13.2717 8.96829 13.4991 8.74097 13.4991 8.46118V7.51691C13.5165 7.23712 13.2892 7.0098 13.0094 7.0098Z"
                      fill="#B9E2F8"
                    ></path>
                    <path
                      d="M11.8903 10.1224C11.8378 10 11.6979 9.93005 11.5755 9.93005C11.4356 9.93005 11.3132 10 11.2608 10.1224C11.2608 10.1224 10.5263 11.5388 10.369 11.8711C10.1766 12.2733 10.1766 12.6929 10.369 13.0951C10.5963 13.5498 11.0684 13.847 11.5755 13.847C11.7854 13.847 11.9952 13.7946 12.1876 13.7072C12.5023 13.5498 12.7471 13.27 12.8695 12.9203C12.9745 12.5705 12.957 12.2033 12.7996 11.8885L11.8903 10.1224Z"
                      fill="#B9E2F8"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_58_106">
                      <rect width="16" height="16" rx="4" fill="white"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </div>
            )} */}
                <motion.button
                  onClick={toggleMenu}
                  whileTap={{ scale: 0.95, y: 8 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                  }}
                  className="bg-[#fff] bg-opacity-60 backdrop-blur-[10px] p-[10px] rounded-[22px] w-[50px] h-[40px] flex items-center justify-center"
                  data-bp="1015-002"
                >
                  {isMenuOpen ? <IconClose /> : <IconMenu />}
                </motion.button>
          </div>
        </div>
        )
      }
      <GuidingTutorial />
    </div>
  );
};

export default MobileLayout;