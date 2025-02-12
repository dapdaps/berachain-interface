'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const Navigation = (props: any) => {
  const { speed } = props;

  const router = useRouter();

  const earthRef = useRef<any>(null);
  const [hoverIndex, setHoverIndex] = useState<any>();

  const handleEntryHover = (item: any) => {
    setHoverIndex(item);
    if (earthRef.current) {
      earthRef.current.style.animationPlayState = "paused";
    }
  };

  const handleEntryLeave = (item: any) => {
    setHoverIndex(void 0);
    if (earthRef.current) {
      earthRef.current.style.animationPlayState = "running";
    }
  };

  const handleNavigation = (item: any) => {
    if (item.disabled) return;
    router.push(item.path);
  };

  return (
    <div
      ref={earthRef}
      className="will-change-transform animate-rotate-reverse w-[3000px] h-[3000px] absolute z-[3] border border-[#5A6F2F] bg-[#B6DF5D] rounded-full top-[24.5dvh] flex justify-center items-center"
      style={{
        animationDuration: `${speed}s`,
      }}
    >
      {
        [...new Array(4)].map((_, idx) => (
          ENTRIES.map((item, i) => (
            <motion.div
              key={i}
              className="absolute -top-[0px] flex justify-center"
              style={{
                width: item.iconWidth,
                height: item.iconHeight,
                transform: `rotate(${90 * idx}deg) translateY(${item.y}px) translateX(${item.x}px)`,
                transformOrigin: 'center 1500px',
              }}
              onHoverStart={() => handleEntryHover(item)}
              onHoverEnd={() => handleEntryLeave(item)}
              onClick={() => handleNavigation(item)}
            >
              <img
                src={item.icon}
                alt=""
                className={clsx('w-full h-full transition-transform duration-150 ease-in-out', item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer')}
                style={{
                  transform: `rotate(${item.rotate}deg) scale(${(hoverIndex?.name === item.name && !item.disabled) ? 1.1 : 1})`,
                  transformOrigin: 'center',
                }}
              />
              <AnimatePresence mode="wait">
                {
                  hoverIndex?.name === item.name && (
                    <motion.img
                      src={item.signpost}
                      alt=""
                      className="absolute"
                      style={{
                        width: item.signpostWidth,
                        height: item.signpostHeight,
                        // transform: `rotate(${item.rotate}deg) translateY(${item.signpostY}px) translateX(${item.signpostX}px)`,
                      }}
                      variants={{
                        visible: {
                          opacity: 1,
                          scale: 1,
                          y: item.signpostY,
                          x: item.signpostX,
                          rotate: item.rotate,
                        },
                        invisible: {
                          opacity: 0,
                          scale: 0.5,
                          y: 0,
                          x: 0,
                          rotate: item.rotate,
                        },
                      }}
                      exit="invisible"
                      initial="invisible"
                      animate="visible"
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                    />
                  )
                }
              </AnimatePresence>
            </motion.div>
          ))
        ))
      }
    </div>
  );
};

export default Navigation;

export const ENTRIES = [
  {
    name: 'DApp Tree',
    disabled: false,
    icon: '/images/home-earth/entry-dapp.svg',
    iconWidth: 209,
    iconHeight: 200,
    signpost: '/images/home-earth/signpost-dapp.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: -90,
    signpostY: -20,
    x: -910,
    y: 180,
    rotate: -36,
    path: '/dapps',
  },
  {
    name: 'Token Marketplace',
    disabled: false,
    icon: '/images/home-earth/entry-marketplace.svg',
    iconWidth: 214,
    iconHeight: 138,
    signpost: '/images/home-earth/signpost-marketplace.svg',
    signpostWidth: 170,
    signpostHeight: 72,
    signpostX: -50,
    signpostY: -90,
    x: -500,
    y: 0,
    rotate: -18,
    path: '/marketplace',
  },
  {
    name: 'Portfolio',
    disabled: true,
    icon: '/images/home-earth/entry-dashboard.svg',
    iconWidth: 279,
    iconHeight: 170,
    signpost: '/images/home-earth/signpost-dashboard.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 4,
    signpostY: -60,
    x: -50,
    y: -100,
    rotate: 0,
    path: '/dashboard',
  },
  {
    name: 'Earn Yield',
    disabled: false,
    icon: '/images/home-earth/entry-earn.svg',
    iconWidth: 203,
    iconHeight: 122,
    signpost: '/images/home-earth/signpost-earn.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 50,
    signpostY: -90,
    x: 350,
    y: -20,
    rotate: 18,
    path: '/earn',
  },
  {
    name: 'Bridge',
    disabled: false,
    icon: '/images/home-earth/entry-bridge.svg',
    iconWidth: 459,
    iconHeight: 150,
    signpost: '/images/home-earth/signpost-bridge.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 20,
    signpostY: -120,
    x: 800,
    y: 220,
    rotate: 36,
    path: '/bridge',
  },
];
