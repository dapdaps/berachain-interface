'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dAppArrowIcon from '@public/images/map/arrow-dApps.svg';
import caveArrowIcon from '@public/images/map/arrow-cave.svg';
import BridgeArrowIcon from '@public/images/map/arrow-bridge.svg';
import MarketPlaceArrowIcon from '@public/images/map/arrow-marketplace.svg';
import { useRouter } from 'next/navigation';
import useMapModalStore from '@/stores/useMapModalStore';
import ReactDOM from 'react-dom';
import IconClose from '@public/images/modal/close.svg';

const dAppClipPath = 'M208.33 2.96745L11.5462 105.957C4.52793 109.63 0.338879 117.099 0.864137 125.003L9.08074 248.644C9.84853 260.197 20.2364 268.686 31.7113 267.138L216.435 242.211C217.477 242.071 218.506 241.848 219.512 241.546L391.686 189.845C393.552 189.285 395.49 189 397.438 189H500.561C507.102 189 513.229 185.802 516.969 180.436L537.25 151.337C542.176 144.269 542.023 134.841 536.87 127.938L472.504 41.7046C469.303 37.415 464.515 34.5878 459.212 33.8557L220.339 0.875262C216.216 0.305971 212.018 1.03735 208.33 2.96745Z';

const marketplaceClipPath = 'M146.955 19.7048L14.4841 65.3534C6.41543 68.1339 1 75.7279 1 84.2623V87.3487L13.8078 235.691C14.5249 243.997 20.3191 250.987 28.3481 253.232L302.812 329.974C312.171 332.591 322.056 328.101 326.245 319.333L358.052 252.74C359.076 250.597 360.473 248.654 362.178 247.001L477.007 135.673C483.257 129.614 484.87 120.208 480.996 112.413L450.394 50.836C447.912 45.8406 443.456 42.109 438.102 40.5421L306.902 2.14199C304.327 1.38837 301.627 1.16051 298.962 1.47198L151.149 18.7489C149.72 18.9158 148.314 19.2363 146.955 19.7048Z';

const bridgeClipPath = 'M167.651 28.237L58.901 132.098C56.8972 134.012 55.313 136.321 54.2487 138.879L2.43848 263.41C-2.74115 275.86 5.63204 289.763 19.0588 291.007L339.942 320.74C341.802 320.913 343.676 320.824 345.511 320.476L632.279 266.144C639.285 264.817 645.055 259.86 647.422 253.134L684.452 147.922C687.193 140.133 684.866 131.461 678.594 126.09L563.257 27.3329C560.335 24.8308 556.753 23.2246 552.941 22.7068L395.493 1.32007C393.928 1.10744 392.343 1.08102 390.771 1.24137L179.435 22.8038C175.012 23.255 170.866 25.1668 167.651 28.237Z';

const dashboardClipPath = 'M10.1413 181.205L93.257 130.184C95.074 129.068 97.0576 128.251 99.1328 127.762L257.728 90.3888C260.22 89.8017 262.575 88.7419 264.667 87.2668L381.191 5.09615C384.949 2.44656 389.504 1.17239 394.091 1.48814L507.472 9.29335C517.498 9.98353 525.454 18.0064 526.062 28.0376L537.679 219.944C538.175 228.127 533.626 235.784 526.203 239.263L424.386 286.976C420.871 288.623 416.954 289.212 413.11 288.671L247.178 265.307C245.73 265.103 244.265 265.058 242.808 265.174L50.8983 280.397C42.5472 281.06 34.6681 276.448 31.1575 268.841L2.4452 206.631C-1.80147 197.43 1.50482 186.507 10.1413 181.205Z';

const caveClipPath = 'M214 67.5L214.225 70.0986M214.225 70.0986L227.5 223.5L303.5 281.5L308 306L372.5 325.5L343 428L63 408.5L1 30.5L207.5 1L214.225 70.0986Z';

const PartList = [
  {
    clipPath: dAppClipPath,
    className: 'origin-top-left absolute top-[5.5%] left-[4%] w-[545px] h-[270px]',
    src:'dApps.svg',
    maskSrc:'mask-dApps.svg',
    indicatorClass:"absolute right-[60px] top-[20px] z-10",
    buttonClass: 'rotate-[2.58deg] mb-[8px]',
    arrowClass: 'relative left-[calc(50%-34px)]',
    btnText: 'dApps',
    link: '/dapps',
    ArrowIcon: dAppArrowIcon
  },
  {
    className: 'origin-top-left absolute top-[33.5%] left-[21%] w-[486px] h-[333px]',
    clipPath: marketplaceClipPath,
    src: 'marketplace.svg',
    maskSrc: 'mask-marketplace.svg',
    indicatorClass:"absolute left-[7%] bottom-[22%] z-10 flex items-center",
    buttonClass: 'rotate-[-5deg] mr-[10px]',
    arrowClass: 'relative top-[-20px]',
    btnText: 'Marketplace',
    link: '/marketplace',
    ArrowIcon: MarketPlaceArrowIcon
  },
  {
    className: 'origin-bottom-right absolute bottom-[5.5%] right-[8.5%] w-[687px] h-[322px]',
    clipPath: bridgeClipPath,
    src: 'bridge.svg',
    maskSrc: 'mask-bridge.svg',
    indicatorClass:"absolute left-[23%] top-[5%] z-10",
    buttonClass: 'rotate-[2.58deg] mb-[8px]',
    arrowClass: 'relative left-[calc(50%)]',
    btnText: 'Bridge',
    link: '/bridge',
    ArrowIcon: BridgeArrowIcon
  },
  {
    className: 'origin-top-right absolute top-[13%] right-[7.2%] w-[539px] h-[290px]',
    clipPath: dashboardClipPath,
    src: 'dashboard.svg',
    maskSrc: 'mask-dashboard.svg',
    indicatorClass:"absolute right-[-4%] top-[20%] z-10",
    buttonClass: 'rotate-[2.58deg] mb-[8px]',
    arrowClass: 'relative left-[calc(50%-34px)]',
    btnText: 'Dashboard',
    link: '/dashboard',
    ArrowIcon: dAppArrowIcon
  },
  {
    className: 'origin-top-right absolute left-[-1.3%] bottom-[-4.1%] w-[314px] h-[340px]',
    clipPath: 'unset',
    src: 'cave.svg',
    maskSrc: 'mask-cave.svg',
    indicatorClass:"absolute left-[2%] top-[25%] right-[unset] top-[unset] z-10",
    buttonClass: 'rotate-[-10deg] mb-[8px]',
    arrowClass: 'relative left-[50%]',
    btnText: 'Bear Cave',
    link: '/cave',
    ArrowIcon: caveArrowIcon
  },
]

const MapItem = ({
  className = '',
  clipPath = '',
  src = '',
  maskSrc = '',
  styles = {},
  indicatorClass = '',
  buttonClass = '',
  arrowClass = '',
  ArrowIcon,
  onNavigateTo = () => {},
  btnText = ''
}: any) => {

  const [isHovered, setIsHovered] = useState(false);

  const IndicatorButton = () => {

    return (
      <motion.div
        className={indicatorClass}
        animate={{
          y: isHovered ? -5 : 0
        }}
      >
        <div className={buttonClass}>
          <button
            className="rounded-[4px] before:rounded-[4px] before:content-[''] before:absolute before:top-[4px] before:left-[4px] before:z-[-1] before:w-full before:h-full before:bg-[#866224] before:border-black before:border relative bg-[#E9B965] border border-black font-CherryBomb text-[30px] leading-[0.9] px-[16px] py-[6px]">
            {btnText}
          </button>
        </div>
        <div className={arrowClass}>
          <ArrowIcon />
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`${className}`} style={styles}>
      <IndicatorButton />
      <motion.div
        style={{ clipPath: `path("${clipPath}")` }}
        className="w-full h-full"
        whileHover="animate"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial="default"
        variants={{
          animate: {
            y: -5,
          },
          default: {
            y: 0
          }
        }}
        onClick={onNavigateTo}
      >
        <motion.img
          className="absolute top-0 left-0 z-[1] w-full"
          src={`/images/map/${src}`}
          alt=""
        />
        <motion.img
          variants={{
            animate: {
              display: 'none',
              opacity: 0.1,
            },
            default: {
              display: 'block',
              opacity: 1
            }
          }}
          className="absolute top-0 left-0 z-[2] w-full"
          src={`/images/map/${maskSrc}`}
          alt=""
        />
      </motion.div>
    </div>
  )
}

const MapModal = () => {

  const store: any = useMapModalStore();

  const modalRef = useRef<any>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const router  = useRouter();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const onNavigateTo = (link?: string) => {
    if (!link) {
      return;
    }
    store.setOpen(false);
    router.push(link);
  }

  useEffect(() => {
    setVisible(store.open);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [store.open]);

  const realWidth = useMemo(() => {
    if (windowWidth * 0.8 >= 1470) {
      return 1470;
    }
    if (windowWidth <=768) {
      return 768;
    }
    return windowWidth * 0.8;
  }, [windowWidth]);

  const onClose = () => {
    setVisible(false);
    const timer = setTimeout(() => {
      clearTimeout(timer);
      store.setOpen(false);
    }, 100);
  };

  return ReactDOM.createPortal((
    <AnimatePresence mode="wait">
      {
        store.open ? (
          <motion.div
            className="cursor-pointer fixed z-[50] w-full h-full left-0 top-0 bg-[rgba(0,_0,_0,_.5)] backdrop-blur-md"
            onClick={(e) => {
              if (modalRef.current.contains(e.target)) {
                return;
              }
              onClose();
            }}
            variants={{
              closed: {
                opacity: 0,
              },
              open: {
                opacity: 1,
              },
            }}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div
              ref={modalRef}
              className="absolute rounded-[0] z-[51] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
            >
              <AnimatePresence mode="wait">
                {
                  visible ? (
                    <motion.div
                      className="relative w-[80vw] min-w-[768px] max-w-[1470px] bg-[url(/images/map/background.svg)] bg-no-repeat bg-center bg-contain overflow-hidden origin-top mt-[20px]"
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={{
                        closed: {
                          scaleY: 0,
                          opacity: 0,
                        },
                        open: {
                          scaleY: 1,
                          opacity: 1,
                          transition: {
                            delay: 0.1,
                          },
                        },
                      }}
                      style={{
                        height: (realWidth ?? 1470) * 0.53,
                      }}
                    >
                      <div className="absolute right-[10px] top-0" onClick={onClose}>
                        <IconClose />
                      </div>
                      {
                        PartList.map(item => (
                          <MapItem
                            key={item.src}
                            onNavigateTo={() => onNavigateTo(item.link)}
                            {...item}
                            styles={{ scale: (realWidth ?? 1470) / 1470 }}
                          />))
                      }
                    </motion.div>
                  ) : null
                }
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null
      }
    </AnimatePresence>
  ), document.body)
}

export default MapModal;
