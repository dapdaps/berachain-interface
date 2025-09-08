import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounceFn } from "ahooks";

const MenuV2 = (props: any) => {
  const { className } = props;
  const router = useRouter();

  const menuList = useMemo(() => Object.values(MENU_LIST), [MENU_LIST]);

  // Control the visibility state of each layer
  const [visibleLayers, setVisibleLayers] = useState<number[]>([]);

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
    <div className={clsx("w-full overflow-hidden shrink-0 pb-[10px]", className)}>
      <div className="font-CherryBomb text-white text-[26px] font-[400] leading-[90%] text-center [text-shadow:_2px_2px_0px_rgba(0,0,0,1)] [-webkit-text-stroke:_1px_rgba(0,0,0,1)]">
        What do you feel like doing today?
      </div>
      <div className="flex flex-col items-center justify-center gap-[10px] mt-[16px]">
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
                  </motion.div>
                ))}
              </motion.div>
            ) : null;
          })}
        </AnimatePresence>
      </div>
    </div>
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
      label: "Add LP",
      bg: "#8FA9FF",
      href: "/swap",
      sort: 5,
    },
  ],
  LAYER_2: [
    {
      label: "Mint Stablecoin",
      bg: "#B9AFFF",
      href: "/swap",
      sort: 1,
    },
    {
      label: "Earn with HONEY",
      bg: "#FFEC5E",
      href: "/validators",
      sort: 2,
    },
    {
      label: "Track my Protfolio",
      bg: "#AFFF83",
      href: "/portfolio",
      sort: 3,
    },
  ],
  LAYER_3: [
    {
      label: "Hot Tokens",
      bg: "#FF9C81",
      href: "/tokens",
      sort: 1,
    },
    {
      label: "Try my luck",
      bg: "#FF96D0",
      href: "/carnival/lucky-bera",
      sort: 2,
    },
  ],
};
