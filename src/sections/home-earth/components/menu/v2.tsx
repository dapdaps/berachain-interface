import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounceFn } from "ahooks";
import { bera } from "@/configs/tokens/bera";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import MintHoneyModal from "@/components/mint-honey-modal";
import MintNectModal from "@/components/mint-nect-modal";

const MenuV2 = (props: any) => {
  const { className } = props;
  const router = useRouter();
  const mintStablecoinRef = useRef<any>();

  const menuList = useMemo(() => Object.values(MENU_LIST), [MENU_LIST]);

  // Control the visibility state of each layer
  const [visibleLayers, setVisibleLayers] = useState<number[]>([]);
  const [mintHoneyOpen, setMintHoneyOpen] = useState(false);
  const [mintNectOpen, setMintNectOpen] = useState(false);

  // Animation configuration
  const layerAnimation = {
    initial: {
      y: -50,
      opacity: 0,
      scale: 0.7,
      rotateX: -15
    },
    animate: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        mass: 0.8,
        duration: 0.8,
      }
    },
  };

  const { run: displayFirstDelay, cancel: displayFirstDelayCancel } = useDebounceFn(() => {
    setVisibleLayers([0]);
  }, { wait: 1000 });

  // Layer-by-layer display logic
  useEffect(() => {
    displayFirstDelayCancel();
    displayFirstDelay();

    return () => {
      displayFirstDelayCancel();
    };
  }, []);

  // Listen to visible layer changes and show the next layer sequentially
  useEffect(() => {
    if (!visibleLayers.length) return;
    if (visibleLayers.length < menuList.length) {
      const nextLayerIndex = visibleLayers.length;
      const timer = setTimeout(() => {
        setVisibleLayers(prev => [...prev, nextLayerIndex]);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [visibleLayers.length, menuList.length]);

  return (
    <>
      <div className={clsx("relative z-[1] w-full overflow-hidden shrink-0 pt-[22px] pb-[10px]", className)}>
        <div className="font-CherryBomb text-white text-[26px] font-[400] leading-[90%] text-center [text-shadow:_2px_2px_0px_rgba(0,0,0,1)] [-webkit-text-stroke:_1px_rgba(0,0,0,1)]">
          What do you feel like doing today?
        </div>
        <div className="flex flex-col items-center justify-start gap-[10px] mt-[16px] h-[82px]">
          <AnimatePresence>
            {menuList.map((layer, layerIndex) => {
              const isVisible = visibleLayers.includes(layerIndex);

              return isVisible ? (
                <motion.div
                  key={layerIndex}
                  className="shrink-0 flex items-center gap-[7px]"
                  {...layerAnimation}
                >
                  {layer.map((menu, menuIndex) => (
                    <motion.div
                      key={`${layerIndex}-${menuIndex}`}
                      initial={{
                        y: -30,
                        opacity: 0,
                        scale: 0.6,
                        rotateY: -10
                      }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        rotateY: 0
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                        mass: 0.6,
                        delay: menuIndex * 0.08, // Each button delays 0.08 seconds
                        duration: 0.6
                      }}
                      whileTap={{
                        scale: 0.98,
                        y: 1,
                        transition: {
                          type: "spring",
                          stiffness: 600,
                          damping: 15,
                          duration: 0.1
                        }
                      }}
                    >
                      {
                        menu.label === "Mint Stablecoin" ? (
                          <Popover
                            ref={mintStablecoinRef}
                            content={(
                              <MintStablecoinContent
                                menu={menu}
                                mintStablecoinRef={mintStablecoinRef}
                                setMintHoneyOpen={setMintHoneyOpen}
                                setMintNectOpen={setMintNectOpen}
                              />
                            )}
                            placement={PopoverPlacement.Bottom}
                            trigger={PopoverTrigger.Click}
                          >
                            <button
                              type="button"
                              className="shrink-0 px-[15px] h-[36px] font-CherryBomb text-[16px] text-black leading-[100%] font-[400] flex justify-center items-center rounded-[12px] border border-black shadow-[4px_4px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-y-[1px] hover:translate-x-[1px] transition-all duration-150"
                              style={{
                                background: menu.bg,
                              }}
                            >
                              {menu.label}
                            </button>
                          </Popover>
                        ) : (
                          <Link
                            href={menu.href}
                            prefetch={false}
                            onMouseEnter={() => {
                              router.prefetch(menu.href);
                            }}
                            className="shrink-0 px-[15px] h-[36px] font-CherryBomb text-[16px] text-black leading-[100%] font-[400] flex justify-center items-center rounded-[12px] border border-black shadow-[4px_4px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-y-[1px] hover:translate-x-[1px] transition-all duration-150"
                            style={{
                              background: menu.bg,
                            }}
                          >
                            {menu.label}
                          </Link>
                        )
                      }
                    </motion.div>
                  ))}
                </motion.div>
              ) : null;
            })}
          </AnimatePresence>
        </div>
      </div>
      <MintHoneyModal
        isOpen={mintHoneyOpen}
        onClose={() => {
          setMintHoneyOpen(false);
        }}
      />
      <MintNectModal
        isOpen={mintNectOpen}
        onClose={() => {
          setMintNectOpen(false);
        }}
      />
    </>
  );
};

export default MenuV2;

const MENU_LIST = {
  LAYER_1: [
    {
      label: "Swap",
      bg: "linear-gradient(0deg, rgba(255, 255, 255, 0.50) 0%, rgba(255, 255, 255, 0.50) 100%), #FF9C81",
      href: "/swap",
      sort: 1,
    },
    {
      label: "Bridge",
      bg: "#FFEC5E",
      href: "/bridge",
      sort: 2,
    },
    {
      label: "Vaults",
      bg: "#FFB95E",
      href: "/vaults",
      sort: 3,
    },
    {
      label: "Lend",
      bg: "#60FBB8",
      href: "/lend",
      sort: 4,
    },
    {
      label: "Game",
      bg: "#FF96D0",
      href: "/carnival/lucky-bera",
      sort: 5,
    },
    {
      label: "Boost",
      bg: "#FFEC5E",
      href: "/validators",
      sort: 6,
    },
  ],
  LAYER_2: [
    {
      label: "Mint Stablecoin",
      bg: "#B9AFFF",
      href: "javascript: void(0);",
      sort: 1,
    },
    {
      label: "Track my Protfolio",
      bg: "#AFFF83",
      href: "/portfolio",
      sort: 2,
    },
    {
      label: "Stake BERA",
      bg: "#FF9C81",
      href: "/stake",
      sort: 3,
    },
  ],
};

const STABLE_COINS = [
  bera["honey"],
  bera["nect"],
];

const MintStablecoinContent = (props: any) => {
  const { className, menu, mintStablecoinRef, setMintHoneyOpen, setMintNectOpen } = props;

  return (
    <div
      className={clsx("w-[146px] px-[5px] py-[10px] shrink-0 flex flex-col justify-center items-center rounded-[12px] border border-black shadow-[4px_4px_0_0_#000]", className)}
      style={{
        background: menu.bg,
      }}
    >
      {STABLE_COINS.map((coin) => (
        <button
          type="button"
          key={coin.address}
          className="w-full font-CherryBomb text-[16px] text-black leading-[100%] font-[400] rounded-[10px] h-[36px] flex justify-center items-center hover:bg-black/10 transition-all duration-150"
          onClick={() => {
            mintStablecoinRef.current?.onClose();
            if (coin.address === bera["honey"].address) {
              setMintHoneyOpen(true);
              return;
            }
            setMintNectOpen(true);
          }}
        >
          {coin.symbol}
        </button>
      ))}
    </div>
  );
};
