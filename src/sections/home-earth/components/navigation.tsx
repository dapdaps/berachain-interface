'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { HomeEarthContext } from '../context';
import { useActivityStore } from '@/stores/useActivityStore';

const SPLIT_PIECES = 4;

const Navigation = (props: any) => {
  const {} = props;
  const {
    isRainyDay,
    isDragging,
    navigationRef,
    navigationControls,
    setIsDragging,
    navigationRotation,
    navigationStartRotationRef,
    navigationEndRotationRef,
    navigationDragStartedRef,
    navigationDragEndedTimesRef,
    navigationStartPointPositionRef,
    hoverIndex,
    setHoverIndex,
    speed,
    size,
    navigationRotateAnimation,
    cloudRotateAnimation,
    cloudControls,
    cloudStartRotationRef,
    cloudEndRotationRef,
    cloudRotation,
    mountainRotateAnimation,
    mountainControls,
    mountainStartRotationRef,
    mountainEndRotationRef,
    mountainRotation,
  } = useContext(HomeEarthContext);
  const router = useRouter();
  const { isDefaultTheme, themeConfig } = useActivityStore();
  const entries = isDefaultTheme() ? ENTRIES : BADDIES_ENTRIES;

  const handleEntryHover = (item: any) => {
    setHoverIndex(item);
  };

  const handleEntryLeave = (item: any) => {
    setHoverIndex(void 0);
  };

  const handleNavigation = (item: any) => {
    if (item.disabled) return;
    router.push(item.path);
  };

  const handleDragStart = (event: MouseEvent, info: any) => {
    setIsDragging(true);
    navigationDragStartedRef.current = true;
    navigationStartRotationRef.current = navigationRotation.get();
    cloudStartRotationRef.current = cloudRotation.get();
    mountainStartRotationRef.current = mountainRotation.get();
    navigationStartPointPositionRef.current = { x: info.point.x, y: info.point.y };
    navigationControls.current?.stop?.();
    cloudControls.current?.stop?.();
    mountainControls.current?.stop?.();

    // console.log('%cStart rotate - navigation: %o', 'background: #5B913B;color:#fff;', navigationRotation.get());
    // console.log('%cStart info.point.x - navigation: %o', 'background: #5B913B;color:#fff;', info.point.x);
    // console.log('%cStart rotate - mountain: %o', 'background: #4635B1;color:#fff;', mountainRotation.get());
    // console.log('%cStart rotate - cloud: %o', 'background: #F39E60;color:#fff;', cloudRotation.get());
  };

  const handleDragEnd = (event: MouseEvent, info: any) => {
    setIsDragging(false);
    navigationDragEndedTimesRef.current = navigationDragEndedTimesRef.current + 1;
    navigationDragStartedRef.current = false;
    navigationEndRotationRef.current = navigationRotation.get();
    cloudEndRotationRef.current = cloudRotation.get();
    mountainEndRotationRef.current = mountainRotation.get();
    navigationRotateAnimation();
    cloudRotateAnimation();
    mountainRotateAnimation();

    // console.log('%cEnd rotate - navigation: %o', 'background: #5B913B;color:#fff;', navigationRotation.get());
    // console.log('%cEnd rotate - mountain: %o', 'background: #4635B1;color:#fff;', mountainRotation.get());
    // console.log('%cEnd rotate - cloud: %o', 'background: #F39E60;color:#fff;', cloudRotation.get());
  };

  const handleDrag = (event: MouseEvent, info: any) => {
    if (!navigationDragStartedRef.current) return;
    const sensitivity = 0.05;
    const navigationRotate = navigationStartRotationRef.current + (info.point.x - navigationStartPointPositionRef.current.x) * sensitivity;
    const mountainRotate = mountainStartRotationRef.current + (info.point.x - navigationStartPointPositionRef.current.x) * (sensitivity * 0.5);
    const cloudRotate = cloudStartRotationRef.current + (info.point.x - navigationStartPointPositionRef.current.x) * (sensitivity * 0.5 * 0.5);
    navigationRotation.set(navigationRotate);
    mountainRotation.set(mountainRotate);
    cloudRotation.set(cloudRotate);

    // console.log('%cCurrent rotate - navigation: %o', 'background: #5B913B;color:#fff;', navigationRotation.get());
    // console.log('%cCurrent info.point.x - navigation: %o', 'background: #5B913B;color:#fff;', info.point.x);
    // console.log('%cCurrent lastRotate - navigation: %o', 'background: #5B913B;color:#fff;', navigationStartRotationRef.current);
    // console.log('%cCurrent rotate - mountain: %o', 'background: #4635B1;color:#fff;', mountainRotation.get());
    // console.log('%cCurrent rotate - cloud: %o', 'background: #F39E60;color:#fff;', cloudRotation.get());
  }

  useEffect(() => {
    navigationRotateAnimation();

    return () => {
      navigationControls.current?.stop?.();
    };
  }, []);

  return (
    <motion.div
      ref={navigationRef}
      className={clsx(
        'will-change-transform absolute z-[3] border rounded-full top-[24.8dvh] flex justify-center items-center border-[#5A6F2F]',
        isDragging ? 'cursor-grabbing' : '',
      )}
      style={{
        rotate: navigationRotation,
        animationDuration: `${speed}s`,
        width: size,
        height: size,
        backgroundColor: isRainyDay ? '#90AF4E' : themeConfig.earthBackgroundColor
      }}
      drag
      dragElastic={0}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      onDrag={handleDrag}
    >
      {
        [...new Array(SPLIT_PIECES)].map((_, idx) => (
          entries.sort((a: any, b: any) => a.sort - b.sort).map((item: any, i: number) => (
            <div
              key={idx + "-" + i}
              className={`flex justify-center items-center w-[300px] top-0 absolute origin-bottom`}
              style={{
                left: "50%",
                height: size / 2,
                transform: `translateX(-50%) rotate(${(360 / SPLIT_PIECES) * idx + (360 / (entries.length * SPLIT_PIECES)) * i}deg)`,
                // backgroundColor: "rgba(0, 0, 0, 0.1)",
                ...(item.width && { width: item.width }),
              }}
            >
              <motion.img
                className={clsx("absolute left-1/2 top-[-80px] z-[1] object-center object-contain", item.disabled ? 'cursor-not-allowed' : 'cursor-pointer', isDefaultTheme() ? 'w-[220px]' : 'w-[300px]')}
                src={item.disabled && item?.disabledIcon ? item?.disabledIcon : item.icon}
                alt=""
                style={{
                  y: item.y,
                  x: "-50%",
                 ...(item.width && { width: item.width }),
                }}
                whileHover={{
                  scale: 1.1,
                }}
                onHoverStart={() => handleEntryHover(item)}
                onHoverEnd={() => handleEntryLeave(item)}
                onClick={() => handleNavigation(item)}
              />
              <AnimatePresence mode="wait">
                {
                  hoverIndex?.name === item.name && (
                    <motion.img
                      src={item.signpost || ''}
                      alt=""
                      className="absolute z-[2] pointer-events-none left-1/2 -top-[140px]"
                      style={{
                        x: "-50%",
                      }}
                      variants={{
                        visible: {
                          opacity: 1,
                          scale: 1,
                        },
                        invisible: {
                          opacity: 0,
                          scale: 0.5,
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
            </div>
          ))
        ))
      }
    </motion.div>
  );
};

export default Navigation;

export const ENTRIES: any = [
  {
    sort: 1,
    name: 'Bridge',
    disabled: false,
    icon: '/images/home-earth/entry-bridge.svg',
    signpost: '/images/home-earth/signpost-bridge.svg',
    path: '/bridge',
    y: 32,
    width: '360px',
  },
  {
    sort: 2,
    name: 'DApp Tree',
    disabled: false,
    icon: '/images/home-earth/entry-dapp.svg',
    signpost: '/images/home-earth/signpost-dapp.svg',
    path: '/dapps',
    y: -68,
  },
  {
    sort: 3,
    name: 'Token Marketplace',
    disabled: false,
    icon: '/images/home-earth/entry-marketplace.svg',
    signpost: '/images/home-earth/signpost-marketplace.svg',
    path: '/marketplace',
  },
  {
    sort: 4,
    name: 'Bgt',
    disabled: false,
    icon: '/images/home-earth/entry-bgt.svg',
    signpost: '/images/home-earth/signpost-bgt.svg',
    path: '/hall',
  },
  {
    sort: 5,
    name: 'Portfolio',
    disabled: false,
    icon: '/images/home-earth/entry-dashboard.svg',
    signpost: '/images/home-earth/signpost-dashboard.svg',
    path: '/portfolio',
    width: '260px',
    y: -20,
  },
  {
    sort: 6,
    name: 'Earn Yield',
    disabled: false,
    icon: '/images/home-earth/entry-vaults.svg',
    signpost: '/images/home-earth/signpost-vaults.svg',
    path: '/vaults',
  },
  
  {
    sort: 7,
    name: 'Cave',
    disabled: true,
    disabledIcon: '/images/home-earth/cave-lock.svg',
    icon: '/images/home-earth/entry-cave.svg',
    signpost: '/images/home-earth/signpost-cave.svg',
    path: '/cave',
    y: 40,
    width: '280px',
  },
  
];

export const BADDIES_ENTRIES: any = [
  {
    sort: 1,
    name: 'Bridge',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-bridge.svg',
    signpost: '/images/home-earth/signpost-bridge.svg',
    path: '/bridge',
    y: -40
  },
  {
    sort: 2,
    name: 'DApp Tree',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-dapp.svg',
    signpost: '/images/home-earth/signpost-dapp.svg',
    path: '/dapps',
    y: -30
  },
  {
    sort: 3,
    name: 'Token Marketplace',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-marketplace.svg',
    signpost: '/images/home-earth/signpost-marketplace.svg',
    path: '/marketplace',
    y: -30
  },

  {
    sort: 4,
    name: 'Bgt',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-bgt.svg',
    signpost: '/images/home-earth/signpost-bgt.svg',
    path: '/hall',
    y: -20
  },
  {
    sort: 5,
    name: 'Portfolio',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-dashboard.svg',
    disabledIcon: '/images/home-earth/baddies/baddies-dashboard-lock.svg',
    signpost: '/images/home-earth/signpost-dashboard.svg',
    path: '/portfolio',
    y: -20
  },
  {
    sort: 6,
    name: 'Earn Yield',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-earn.svg',
    signpost: '/images/home-earth/signpost-earn.svg',
    path: '/earn',
  },
  
  {
    sort: 7,
    name: 'Cave',
    disabled: true,
    icon: '/images/home-earth/baddies/baddies-cave.svg',
    disabledIcon: '/images/home-earth/baddies/baddies-cave-lock.svg',
    signpost: '/images/home-earth/signpost-cave.svg',
    path: '/cave',
    y: -20
  },
  
]
