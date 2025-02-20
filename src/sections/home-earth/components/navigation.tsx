'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { HomeEarthContext } from '../context';
import { useActivityStore } from '@/stores/useActivityStore';

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
        'will-change-transform absolute z-[3] border rounded-full top-[24.5dvh] flex justify-center items-center border-[#5A6F2F]',
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
        [...new Array(4)].map((_, idx) => (
          (isDefaultTheme() ? ENTRIES : BADDIES_ENTRIES).sort((a: any, b: any) => a.sort - b.sort).map((item: any, i: number) => (
            <motion.div
              key={i}
              className={clsx(
                'absolute -top-[0px] flex justify-center',
                item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              )}
              style={{
                width: item.iconWidth,
                height: item.iconHeight,
                transform: `rotate(${90 * idx}deg) translateY(${item.y}px) translateX(${item.x}px)`,
                transformOrigin: `center ${size/2}px`,
              }}
              onHoverStart={() => handleEntryHover(item)}
              onHoverEnd={() => handleEntryLeave(item)}
              onClick={() => handleNavigation(item)}
            >
              <img
                src={item.disabled && item?.disabledIcon ? item?.disabledIcon : item.icon}
                alt=""
                className={clsx(
                  'w-full h-full transition-transform duration-150 ease-in-out pointer-events-none',
                  item.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                  isDefaultTheme() && item.disabled ? 'opacity-50' : '',
                )}
                style={{
                  transform: `rotate(${item.rotate}deg) scale(${(hoverIndex?.name === item.name && !item.disabled) ? 1.1 : 1})`,
                  transformOrigin: 'center',
                }}
              />
              <AnimatePresence mode="wait">
                {
                  hoverIndex?.name === item.name && (
                    <motion.img
                      src={item.signpost || ''}
                      alt=""
                      className="absolute pointer-events-none"
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
    </motion.div>
  );
};

export default Navigation;

export const ENTRIES: any = [
  {
    sort: 2,
    name: 'DApp Tree',
    disabled: false,
    icon: '/images/home-earth/entry-dapp.svg',
    iconWidth: 209,
    iconHeight: 200,
    signpost: '/images/home-earth/signpost-dapp.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: -130,
    signpostY: -10,
    x: -1150,
    y: 400,
    rotate: -50,
    path: '/dapps',
  },
  {
    sort: 3,
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
    x: -890,
    y: 220,
    rotate: -35,
    path: '/marketplace',
  },
  {
    sort: 5,
    name: 'Portfolio',
    disabled: false,
    icon: '/images/home-earth/entry-dashboard.svg',
    iconWidth: 279,
    iconHeight: 170,
    signpost: '/images/home-earth/signpost-dashboard.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 14,
    signpostY: -60,
    x: -150,
    y: -90,
    rotate: 0,
    path: '/dashboard',
  },
  {
    sort: 4,
    name: 'Earn Yield',
    disabled: false,
    icon: '/images/home-earth/entry-earn.svg',
    iconWidth: 203,
    iconHeight: 122,
    signpost: '/images/home-earth/signpost-earn.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: -20,
    signpostY: -70,
    x: -550,
    y: 40,
    rotate: -20,
    path: '/earn',
  },
  {
    sort: 1,
    name: 'Bridge',
    disabled: false,
    icon: '/images/home-earth/entry-bridge.svg',
    iconWidth: 459,
    iconHeight: 150,
    signpost: '/images/home-earth/signpost-bridge.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: -40,
    signpostY: -120,
    x: 620,
    y: 103,
    rotate: 21,
    path: '/bridge',
  },
  {
    sort: 6,
    name: 'Cave',
    disabled: false,
    icon: '/images/home-earth/entry-cave.svg',
    iconWidth: 285,
    iconHeight: 163,
    signpost: '/images/home-earth/signpost-cave.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 40,
    signpostY: -70,
    x: 200,
    y: -30,
    rotate: 6,
    path: '/cave',
  },
];

export const BADDIES_ENTRIES: any = [
  {
    sort: 1,
    name: 'Bridge',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-bridge.svg',
    iconWidth: 326,
    iconHeight: 303,
    signpost: '/images/home-earth/signpost-bridge.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 80,
    signpostY: 10,
    x: 1270,
    y: 320,
    rotate: 46,
    path: '/bridge',
  },
  {
    sort: 2,
    name: 'DApp Tree',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-dapp.svg',
    iconWidth: 365,
    iconHeight: 226,
    signpost: '/images/home-earth/signpost-dapp.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: -90,
    signpostY: -30,
    x: -912,
    y: 76,
    rotate: -30,
    path: '/dapps',
  },
  {
    sort: 3,
    name: 'Token Marketplace',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-marketplace.svg',
    iconWidth: 352,
    iconHeight: 232,
    signpost: '/images/home-earth/signpost-marketplace.svg',
    signpostWidth: 170,
    signpostHeight: 72,
    signpostX: -50,
    signpostY: -70,
    x: -460,
    y: -86,
    rotate: -18,
    path: '/marketplace',
  },
  {
    sort: 4,
    name: 'Earn Yield',
    disabled: false,
    icon: '/images/home-earth/baddies/baddies-earn.svg',
    iconWidth: 349,
    iconHeight: 155,
    signpost: '/images/home-earth/signpost-earn.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 0,
    signpostY: -60,
    x: 20,
    y: -119,
    rotate: 0,
    path: '/earn',
  },
  {
    sort: 5,
    name: 'Portfolio',
    disabled: true,
    icon: '/images/home-earth/baddies/baddies-dashboard.svg',
    disabledIcon: '/images/home-earth/baddies/baddies-dashboard-lock.svg',
    iconWidth: 364,
    iconHeight: 208,
    signpost: '/images/home-earth/signpost-dashboard.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 40,
    signpostY: -30,
    x: 460,
    y: -80,
    rotate: 18,
    path: '/dashboard',
  },
  {
    sort: 6,
    name: 'Cave',
    disabled: true,
    icon: '/images/home-earth/baddies/baddies-cave.svg',
    disabledIcon: '/images/home-earth/baddies/baddies-cave-lock.svg',
    iconWidth: 365,
    iconHeight: 226,
    signpost: '/images/home-earth/signpost-cave.svg',
    signpostWidth: 170,
    signpostHeight: 59,
    signpostX: 50,
    signpostY: -40,
    x: 882,
    y: 82,
    rotate: 30,
    path: '/cave',
  }
]
