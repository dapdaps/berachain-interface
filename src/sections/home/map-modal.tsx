"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import dAppArrowIcon from "@public/images/map/arrow-dApps.svg";
import caveArrowIcon from "@public/images/map/arrow-cave.svg";
import BridgeArrowIcon from "@public/images/map/arrow-bridge.svg";
import MarketPlaceArrowIcon from "@public/images/map/arrow-marketplace.svg";
import beramasArrowIcon from "@public/images/map/arrow-beramas.svg";
import { useRouter } from "next/navigation";
import useMapModalStore from "@/stores/useMapModalStore";
import ReactDOM from "react-dom";
import IconClose from "@public/images/modal/close.svg";
import useClickTracking from "@/hooks/use-click-tracking";
import { useChristmas } from "@/hooks/use-christmas";

<svg width="431" height="255" viewBox="0 0 431 255" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M121.632 34.6059C122.92 34.614 124.34 34.5917 125.803 34.5687C131.807 34.4744 138.561 34.3683 140.098 36.2994C141.866 38.5201 147.893 37.8385 152.19 37.3525C153.18 37.2406 154.078 37.139 154.811 37.0857V42.5677L240.247 0.694336L278.822 20.0435L316.851 11.9956C320.854 11.1485 325.02 11.5493 328.788 13.144L387.227 37.8788C388.635 37.7761 390.041 37.6153 391.302 37.4709L391.302 37.4709C392.321 37.3543 393.245 37.2485 394 37.193V40.7455L418.296 51.0288C425.693 54.16 430.5 61.4136 430.5 69.4469V181.527C430.5 189.768 425.445 197.166 417.767 200.16L284.005 252.327C281.689 253.231 279.224 253.694 276.738 253.694H80.0101C72.6185 253.694 65.8296 249.618 62.3561 243.093L3.54148 132.617C-1.70469 122.763 2.13213 110.521 12.0645 105.424L105.623 57.414C107.201 56.6045 108.879 56.0083 110.613 55.6412L118.77 53.9151V34.3692C117.764 34.0026 117.045 33.0374 117.045 31.9042C117.045 30.4558 118.219 29.2816 119.668 29.2816C121.116 29.2816 122.29 30.4558 122.29 31.9042C122.29 32.5708 122.042 33.1792 121.632 33.6419V34.6059Z" fill="black" fill-opacity="0.15"/>
<path d="" fill="black"/>
</svg>



const dAppClipPath =
  "M208.33 2.96745L11.5462 105.957C4.52793 109.63 0.338879 117.099 0.864137 125.003L9.08074 248.644C9.84853 260.197 20.2364 268.686 31.7113 267.138L216.435 242.211C217.477 242.071 218.506 241.848 219.512 241.546L391.686 189.845C393.552 189.285 395.49 189 397.438 189H500.561C507.102 189 513.229 185.802 516.969 180.436L537.25 151.337C542.176 144.269 542.023 134.841 536.87 127.938L472.504 41.7046C469.303 37.415 464.515 34.5878 459.212 33.8557L220.339 0.875262C216.216 0.305971 212.018 1.03735 208.33 2.96745Z";

const marketplaceClipPath =
  "M146.955 19.3991L14.4841 65.0478C6.41543 67.8282 1 75.4223 1 83.9566V87.0431L13.8078 235.386C14.5249 243.692 20.3191 250.682 28.3481 252.927L306.249 330.629C313.979 332.791 322.253 330.121 327.262 323.848L426.491 199.596C431.111 193.811 432.158 185.948 429.211 179.156L363.22 27.0378C360.92 21.7367 356.44 17.6893 350.933 15.938L307.105 1.99976C304.399 1.13934 301.542 0.864801 298.722 1.1944L151.149 18.4432C149.72 18.6101 148.314 18.9306 146.955 19.3991Z";

const bridgeClipPathChristmas =
  "M167.651 28.237L58.901 132.098C56.8972 134.012 55.313 136.321 54.2487 138.879L2.43848 263.41C-2.74115 275.86 5.63204 289.763 19.0588 291.007L339.942 320.74C341.802 320.913 343.676 320.824 345.511 320.476L610.736 270.226C625.596 267.411 632.075 249.756 622.562 237.997L517.867 108.579C512.308 101.708 511.919 92.0024 516.909 84.7078L540.482 50.2482C548.883 37.9677 541.411 21.1406 526.667 19.1379L395.493 1.32007C393.928 1.10744 392.343 1.08102 390.771 1.24137L179.435 22.8038C175.012 23.255 170.866 25.1668 167.651 28.237Z";
const bridgeClipPath =
  "M149.803 3.51947L53.8179 60.793C50.1307 62.9931 47.2495 66.3214 45.6003 70.2856L2.43802 174.034C-2.74142 186.484 5.63179 200.387 19.0584 201.631L297.434 227.426C299.356 227.604 301.292 227.503 303.185 227.126L419.763 203.918C432.192 201.443 439.215 188.181 434.278 176.51L365.061 12.9018C361.931 5.50224 354.676 0.694336 346.642 0.694336H285.765H160.051C156.443 0.694336 152.902 1.67053 149.803 3.51947Z";

const dashboardClipPath =
  "M10.1413 181.205L93.257 130.184C95.074 129.068 97.0576 128.251 99.1328 127.762L257.728 90.3888C260.22 89.8017 262.575 88.7419 264.667 87.2668L381.191 5.09615C384.949 2.44656 389.504 1.17239 394.091 1.48814L507.472 9.29335C517.498 9.98353 525.454 18.0064 526.062 28.0376L537.679 219.944C538.175 228.127 533.626 235.784 526.203 239.263L424.386 286.976C420.871 288.623 416.954 289.212 413.11 288.671L247.178 265.307C245.73 265.103 244.265 265.058 242.808 265.174L50.8983 280.397C42.5472 281.06 34.6681 276.448 31.1575 268.841L2.4452 206.631C-1.80147 197.43 1.50482 186.507 10.1413 181.205Z";

 const bgtClipPath = "M125.803 34.5687L125.795 34.0688L125.803 34.5687ZM121.632 34.6059H121.132V35.1028L121.629 35.1059L121.632 34.6059ZM140.098 36.2994L139.707 36.6108V36.6108L140.098 36.2994ZM152.19 37.3525L152.246 37.8494L152.19 37.3525ZM154.811 37.0857H155.311V36.548L154.775 36.587L154.811 37.0857ZM154.811 42.5677H154.311V43.3695L155.031 43.0166L154.811 42.5677ZM240.247 0.694336L240.472 0.247409L240.25 0.136251L240.027 0.245361L240.247 0.694336ZM278.822 20.0435L278.598 20.4905L278.755 20.5689L278.926 20.5327L278.822 20.0435ZM316.851 11.9956L316.955 12.4847L316.851 11.9956ZM328.788 13.144L328.983 12.6836L328.788 13.144ZM387.227 37.8788L387.032 38.3392L387.143 38.3862L387.263 38.3775L387.227 37.8788ZM391.302 37.4709L391.358 37.9677L391.364 37.9671L391.302 37.4709ZM391.302 37.4709L391.245 36.9741L391.24 36.9748L391.302 37.4709ZM394 37.193H394.5V36.6549L393.963 36.6943L394 37.193ZM394 40.7455H393.5V41.0768L393.805 41.206L394 40.7455ZM418.296 51.0288L418.101 51.4892L418.296 51.0288ZM417.767 200.16L417.949 200.626L417.767 200.16ZM284.005 252.327L283.823 251.862L284.005 252.327ZM62.3561 243.093L62.7974 242.858L62.3561 243.093ZM3.54148 132.617L3.10013 132.852L3.54148 132.617ZM12.0645 105.424L11.8362 104.98L12.0645 105.424ZM105.623 57.414L105.395 56.9691L105.623 57.414ZM110.613 55.6412L110.51 55.1521L110.613 55.6412ZM118.77 53.9151L118.873 54.4043L119.27 54.3204V53.9151H118.77ZM118.77 34.3692H119.27V34.0192L118.941 33.8994L118.77 34.3692ZM121.632 33.6419L121.258 33.3105L121.132 33.4524V33.6419H121.632ZM125.795 34.0688C124.33 34.0918 122.917 34.1139 121.635 34.1059L121.629 35.1059C122.924 35.114 124.349 35.0916 125.811 35.0686L125.795 34.0688ZM140.489 35.988C140.003 35.3772 139.163 34.9865 138.193 34.719C137.206 34.4466 135.993 34.2786 134.664 34.176C132.005 33.9708 128.791 34.0217 125.795 34.0688L125.811 35.0686C128.82 35.0214 131.984 34.9721 134.587 35.173C135.889 35.2735 137.029 35.4352 137.927 35.683C138.844 35.9358 139.424 36.256 139.707 36.6108L140.489 35.988ZM152.134 36.8557C149.978 37.0995 147.431 37.3867 145.206 37.341C144.094 37.3182 143.086 37.2124 142.261 36.9868C141.43 36.7598 140.838 36.4261 140.489 35.988L139.707 36.6108C140.242 37.2831 141.066 37.6969 141.997 37.9514C142.933 38.2074 144.032 38.3172 145.185 38.3408C147.49 38.3881 150.105 38.0915 152.246 37.8494L152.134 36.8557ZM154.775 36.587C154.03 36.6412 153.12 36.7441 152.134 36.8557L152.246 37.8494C153.24 37.737 154.127 37.6368 154.847 37.5844L154.775 36.587ZM155.311 42.5677V37.0857H154.311V42.5677H155.311ZM240.027 0.245361L154.591 42.1187L155.031 43.0166L240.467 1.14331L240.027 0.245361ZM279.047 19.5966L240.472 0.247409L240.023 1.14126L278.598 20.4905L279.047 19.5966ZM316.748 11.5064L278.719 19.5544L278.926 20.5327L316.955 12.4847L316.748 11.5064ZM328.983 12.6836C325.121 11.049 320.85 10.6382 316.748 11.5064L316.955 12.4847C320.857 11.6588 324.919 12.0497 328.593 13.6045L328.983 12.6836ZM387.422 37.4183L328.983 12.6836L328.593 13.6045L387.032 38.3392L387.422 37.4183ZM391.245 36.9742C389.982 37.1187 388.586 37.2783 387.191 37.3801L387.263 38.3775C388.683 38.2739 390.099 38.1118 391.358 37.9677L391.245 36.9742ZM391.24 36.9748L391.24 36.9748L391.364 37.9671L391.364 37.967L391.24 36.9748ZM393.963 36.6943C393.196 36.7508 392.261 36.8579 391.245 36.9741L391.359 37.9677C392.381 37.8507 393.294 37.7463 394.037 37.6917L393.963 36.6943ZM394.5 40.7455V37.193H393.5V40.7455H394.5ZM418.49 50.5683L394.195 40.285L393.805 41.206L418.101 51.4892L418.49 50.5683ZM431 69.4469C431 61.2128 426.073 53.7778 418.49 50.5683L418.101 51.4892C425.314 54.5421 430 61.6145 430 69.4469H431ZM431 181.527V69.4469H430V181.527H431ZM417.949 200.626C425.818 197.557 431 189.974 431 181.527H430C430 189.562 425.071 196.775 417.585 199.694L417.949 200.626ZM284.187 252.793L417.949 200.626L417.585 199.694L283.823 251.862L284.187 252.793ZM276.738 254.194C279.286 254.194 281.812 253.719 284.187 252.793L283.823 251.862C281.565 252.742 279.162 253.194 276.738 253.194V254.194ZM80.0101 254.194H276.738V253.194H80.0101V254.194ZM61.9147 243.328C65.4751 250.016 72.4337 254.194 80.0101 254.194V253.194C72.8033 253.194 66.1841 249.219 62.7974 242.858L61.9147 243.328ZM3.10013 132.852L61.9147 243.328L62.7974 242.858L3.98283 132.382L3.10013 132.852ZM11.8362 104.98C1.65554 110.204 -2.27719 122.751 3.10013 132.852L3.98283 132.382C-1.13218 122.774 2.60872 110.839 12.2927 105.869L11.8362 104.98ZM105.395 56.9691L11.8362 104.98L12.2927 105.869L105.852 57.8588L105.395 56.9691ZM110.51 55.1521C108.732 55.5284 107.012 56.1394 105.395 56.9691L105.852 57.8588C107.39 57.0696 109.026 56.4883 110.717 56.1304L110.51 55.1521ZM118.666 53.426L110.51 55.1521L110.717 56.1304L118.873 54.4043L118.666 53.426ZM118.27 34.3692V53.9151H119.27V34.3692H118.27ZM118.941 33.8994C118.126 33.6025 117.545 32.8205 117.545 31.9042H116.545C116.545 33.2542 117.401 34.4028 118.599 34.839L118.941 33.8994ZM117.545 31.9042C117.545 30.7319 118.495 29.7816 119.668 29.7816V28.7816C117.943 28.7816 116.545 30.1796 116.545 31.9042H117.545ZM119.668 29.7816C120.84 29.7816 121.79 30.7319 121.79 31.9042H122.79C122.79 30.1796 121.392 28.7816 119.668 28.7816V29.7816ZM121.79 31.9042C121.79 32.444 121.589 32.9357 121.258 33.3105L122.006 33.9734C122.494 33.4228 122.79 32.6975 122.79 31.9042H121.79ZM122.132 34.6059V33.6419H121.132V34.6059H122.132Z" 

const PartList = [
  {
    clipPath: dAppClipPath,
    className:
      "origin-top-left absolute top-[5.5%] left-[4%] w-[545px] h-[270px]",
    src: "dApps.svg",
    maskSrc: "mask-dApps.svg",
    indicatorClass: "absolute right-[60px] top-[20px] z-10",
    buttonClass: "rotate-[2.58deg] mb-[8px]",
    arrowClass: "relative left-[calc(50%-34px)]",
    btnText: "dApps",
    link: "/dapps",
    ArrowIcon: dAppArrowIcon
  },
  {
    clipPath: "unset",
    className:
      "origin-top-left absolute top-[1%] left-[42%] w-[478px] h-[235px]",
    src: "earn.svg",
    maskSrc: "mask-earn.svg",
    indicatorClass: "absolute right-[164px] top-[12px] z-10",
    buttonClass: "rotate-[2.58deg] mb-[8px]",
    arrowClass: "relative left-[calc(50%-34px)]",
    btnText: "Earn",
    link: "/earn",
    ArrowIcon: dAppArrowIcon
  },
  {
    className:
      "origin-top-left absolute top-[33.5%] left-[21%] w-[486px] h-[333px]",
    clipPath: marketplaceClipPath,
    src: "marketplace.svg",
    maskSrc: "mask-marketplace.svg",
    indicatorClass: "absolute left-[7%] bottom-[22%] z-10 flex items-center",
    buttonClass: "rotate-[-5deg] mr-[10px]",
    arrowClass: "relative top-[-20px]",
    btnText: "Token Marketplace",
    link: "/marketplace",
    ArrowIcon: MarketPlaceArrowIcon
  },
  {
    classNameChristmas:
      "origin-bottom-right absolute bottom-[5.5%] right-[12.5%] w-[628px] h-[322px]",
    className:
      "origin-bottom-right absolute bottom-[5.5%] right-[8.5%] w-[687px] h-[322px]",
    clipPath: bridgeClipPath,
    srcChristmas: "bridge-christmas.svg",
    src: "bridge.svg",
    maskSrcChristmas: "mask-bridge-christmas.svg",
    maskSrc: "mask-bridge.svg",
    indicatorClass: "absolute left-[23%] top-[5%] z-10",
    buttonClass: "rotate-[2.58deg] mb-[8px]",
    arrowClass: "relative left-[calc(50%)]",
    btnText: "Bridge",
    link: "/bridge",
    ArrowIcon: BridgeArrowIcon
  },
  {
    className:
      "origin-top-right absolute top-[13%] right-[7.2%] w-[539px] h-[290px]",
    clipPath: dashboardClipPath,
    src: "dashboard.svg",
    maskSrc: "mask-dashboard.svg",
    indicatorClass: "absolute right-[-4%] top-[20%] z-10",
    buttonClass: "rotate-[2.58deg] mb-[8px]",
    arrowClass: "relative left-[calc(50%-34px)]",
    btnText: "Portfolio",
    link: "/portfolio",
    ArrowIcon: dAppArrowIcon,
    disabled: false
  },
  {
    className:
      'origin-bottom-left absolute left-[6.3%] bottom-[10.8%] w-[314px] h-[340px]',
    clipPath: 'unset',
    src: 'cave.svg',
    maskSrc: 'mask-cave.svg',
    indicatorClass: 'absolute left-[2%] top-[25%] z-10',
    buttonClass: 'rotate-[-10deg] mb-[8px]',
    arrowClass: 'relative left-[50%]',
    btnText: 'Bera Cave',
    link: '/cave',
    ArrowIcon: caveArrowIcon,
    disabled: true
  },
  {
    // bgt
    className:
      "origin-bottom-right absolute right-[6.3%] bottom-[20%] w-[149px] h-[269px]",
    clipPath: bgtClipPath,
    src: "beramas.svg",
  }
];

const MapItem = ({
  className = "",
  clipPath = "",
  src = "",
  maskSrc = "",
  styles = {},
  indicatorClass = "",
  buttonClass = "",
  arrowClass = "",
  ArrowIcon,
  onNavigateTo = () => {},
  btnText = "",
  link,
  disabled
}: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const IndicatorButton = () => {
    return (
      <motion.div
        className={indicatorClass}
        animate={{
          y: !disabled && isHovered ? -5 : 0
        }}
      >
        <div className={buttonClass}>
          <button className="rounded-[4px] before:rounded-[4px] before:content-[''] before:absolute before:top-[4px] before:left-[4px] before:z-[-1] before:w-full before:h-full before:bg-[#866224] before:border-black before:border relative bg-[#E9B965] border border-black font-CherryBomb text-[30px] leading-[0.9] px-[16px] py-[6px]">
            {btnText}
          </button>
        </div>
        <div className={arrowClass}>
          <ArrowIcon />
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`${className}`} style={styles}>
      {btnText && <IndicatorButton />}
      <motion.div
        style={{ clipPath: `path("${clipPath}")` }}
        className="w-full h-full"
        whileHover={link && !disabled ? "animate" : "default"}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial="default"
        variants={{
          animate: {
            y: -5
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
              display: "none",
              opacity: 0.1
            },
            default: {
              display: "block",
              opacity: 1
            }
          }}
          className="absolute top-0 left-0 z-[2] w-full"
          src={`/images/map/${maskSrc}`}
          alt=""
        />
      </motion.div>
    </div>
  );
};

const MapModal = () => {
  const store: any = useMapModalStore();
  const { handleReport } = useClickTracking();
  const christmas = useChristmas();

  const modalRef = useRef<any>(null);
  const [visible, setVisible] = useState<boolean>(false);

  const router = useRouter();

  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  const entries = useMemo(() => {
    if (!christmas?.isChristmas) {
      return PartList;
    }
    return [
      ...PartList
      // {
      //   className:
      //     "origin-bottom-right absolute right-[6.3%] bottom-[20%] w-[149px] h-[269px]",
      //   clipPath: "unset",
      //   src: "beramas.svg",
      //   maskSrc: "mask-beramas.svg",
      //   indicatorClass: "absolute left-[2%] bottom-[-32.5%] z-10",
      //   buttonClass: "rotate-[-10deg] mb-[8px]",
      //   arrowClass:
      //     "relative left-[50%] translate-x-[50px] translate-y-[-150px]",
      //   btnText: "Bera's Wonderland",
      //   link: christmas.path,
      //   ArrowIcon: beramasArrowIcon
      // }
    ];
  }, [PartList, christmas]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);

      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const onNavigateTo = (link?: string) => {
    if (!link) {
      return;
    }
    switch (link) {
      case "/dapps":
        handleReport("1010-001-001");
        break;
      case "/marketplace":
        handleReport("1010-001-003");
        break;
      case "/bridge":
        handleReport("1010-001-004");
        break;
      case "/portfolio":
        handleReport("1010-001-005");
        break;
      case "/cave":
        handleReport("1010-001-002");
        break;
      case "/earn":
        handleReport("1010-001-006");
        break;
      default:
        break;
    }
    store.setOpen(false);
    router.push(link);
  };

  useEffect(() => {
    setVisible(store.open);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [store.open]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const realWidth = useMemo(() => {
    // @ts-ignore
    if (windowWidth * 0.8 >= 1470) {
      return 1470;
    }
    // @ts-ignore
    if (windowWidth <= 768) {
      return 768;
    }
    // @ts-ignore
    return windowWidth * 0.8;
  }, [windowWidth]);

  const onClose = () => {
    setVisible(false);
    const timer = setTimeout(() => {
      clearTimeout(timer);
      store.setOpen(false);
    }, 100);
  };

  if (!isClient) {
    return null;
  }

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {store.open ? (
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
              opacity: 0
            },
            open: {
              opacity: 1
            }
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
              {visible ? (
                <motion.div
                  className='relative w-[80vw] min-w-[768px] max-w-[1470px] bg-[url("/images/map/background.svg")] bg-no-repeat bg-center bg-contain overflow-hidden origin-top mt-[20px]'
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    closed: {
                      scaleY: 0,
                      opacity: 0
                    },
                    open: {
                      scaleY: 1,
                      opacity: 1,
                      transition: {
                        delay: 0.1
                      }
                    }
                  }}
                  style={{
                    height: (realWidth ?? 1470) * 0.53
                  }}
                >
                  <div
                    className="absolute right-[10px] top-0"
                    onClick={onClose}
                  >
                    <IconClose />
                  </div>
                  {entries.map((item) => (
                    <MapItem
                      key={item.src}
                      onNavigateTo={() =>
                        !item.disabled && onNavigateTo(item.link)
                      }
                      {...item}
                      styles={{
                        scale: (realWidth ?? 1470) / 1470,
                        opacity: item.disabled ? 0.5 : 1
                      }}
                    />
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
};

export default MapModal;
