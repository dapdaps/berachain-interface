import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import BelongTitle from "./title";
import useIsMobile from "@/hooks/use-isMobile";

const BENEFITS = [
  {
    key: 1,
    title: "Points",
    icon: "/images/belong/v2/icon-heart.png",
    iconSize: 46,
    banner: {
      src: "/images/belong/v2/banner-points.png",
      width: 220,
      height: 107,
    },
    type: "dog-eared",
    content: "Infrared, Kodiak, and Smilee are offering an exclusive and competitive points multiplier to those who provide liquidity.",
    style: {
      rotate: -4,
      rotateMobile: -4,
      translateX: 85,
      translateXMobile: 5,
      translateY: -30,
      translateYMobile: -20,
      zIndex: 2,
      zIndexMobile: 4,
    },
  },
  {
    key: 2,
    title: "Leverage",
    icon: "/images/belong/v2/icon-chart.png",
    iconSize: 46,
    banner: {
      src: "/images/belong/v2/banner-chart.png",
      width: 208,
      height: 96,
    },
    content: "Leverage your exposure to BERA using Beraborrow’s looping to lend your LP token and long more BERA.",
    style: {
      rotate: 0.785,
      rotateMobile: 7.28,
      translateX: 25,
      translateXMobile: 0,
      translateYMobile: 10,
      zIndex: 1,
      zIndexMobile: 2,
    },
  },
  {
    key: 3,
    title: "Farm BGT",
    icon: "/images/belong/v2/icon-farm.png",
    iconSize: 46,
    banner: {
      src: "/images/belong/v2/banner-farm.png",
      width: 130,
      height: 88,
    },
    content: "Earn some of the most consistent BGT APR thanks to a long-term deal between Infrared and Smilee validators.",
    style: {
      rotate: -1.95,
      rotateMobile: -1.95,
      translateX: -25,
      translateXMobile: 5,
      translateY: -40,
      translateYMobile: -35,
      zIndex: 3,
      zIndexMobile: 3,
    },
  },
  {
    key: 4,
    title: "Arbitrage",
    icon: "/images/belong/v2/icon-scale.png",
    iconSize: 33,
    banner: {
      src: "/images/belong/v2/banner-arbitrage.png",
      width: 203,
      height: 113,
    },
    type: "dog-eared",
    content: "Both wgBERA and iBERA are considered two main BERA derivatives, featuring them in BeLong offers unprecedented arbitrage opportunities.",
    style: {
      rotate: 7.752,
      rotateMobile: 3.566,
      translateX: -85,
      translateXMobile: 0,
      translateY: 20,
      translateYMobile: 20,
      zIndex: 4,
      zIndexMobile: 1,
    },
  },
];

const Benefits = (props: any) => {
  const { className, style } = props;

  const isMobile = useIsMobile();

  return (
    <div className={clsx("", className)} style={style}>
      <BelongTitle>
        The benefits
      </BelongTitle>
      <div className="mt-[80px] md:mt-[40px] flex justify-center items-center md:grid md:grid-cols-2 md:gap-[0px] md:place-items-center md:pb-[50px]">
        <AnimatePresence>
          {
            BENEFITS.map((item, index) => (
              <Card
                className="relative"
                key={item.key}
                title={item.title}
                icon={item.icon}
                type={item.type}
                banner={item.banner}
                iconSize={isMobile ? item.iconSize * 0.5 : item.iconSize}
                style={{
                  ...item.style,
                  zIndex: isMobile ? item.style.zIndexMobile : item.style.zIndex,
                  rotate: isMobile ? item.style.rotateMobile : item.style.rotateMobile,
                  translateX: isMobile ? item.style.translateXMobile : item.style.translateX,
                  translateY: isMobile ? item.style.translateYMobile : item.style.translateY,
                }}
              >
                {item.content}
              </Card>
            ))
          }
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Benefits;

const Card = (props: any) => {
  const { title, icon, iconSize = 46, className, children, type = "default", style, banner } = props;

  const isMobile = useIsMobile();

  return (
    <motion.div
      className={clsx(
        "w-[352px] h-[324px] md:w-[55vw] md:h-[50.59vw] bg-no-repeat bg-[length:100%_100%] bg-center shrink-0 flex flex-col justify-between items-stretch gap-[0px] px-[50px] pt-[40px] pb-[40px] md:pl-[6vw] md:pr-[5vw] md:pt-[5vw] md:pb-[10vw]",
        type === "default" ? "bg-[url('/images/belong/v2/bg-sticky-note.png')]" : "bg-[url('/images/belong/v2/bg-sticky-note-dog-eared.png')]",
        className
      )}
      style={style}
      whileHover={isMobile ? undefined : {
        scale: 1.05,
        zIndex: 5,
        rotate: [style.rotate, -style.rotate, 0],
        transition: {
          scale: { duration: 0.2 },
          rotate: { duration: 0.3, ease: "easeInOut" }
        }
      }}
    >
      <div className="flex justify-between items-center gap-[8px]">
        <div className="text-[#471C1C] font-CherryBomb text-[30px] md:text-[24px] font-[400] leading-[80%] uppercase">
          {title}
        </div>
        <img src={icon} alt="" className="w-[46px] h-[46px] object-contain object-center shrink-0" style={{ width: iconSize, height: iconSize }} />
      </div>
      <img
        src={banner.src}
        alt=""
        className="object-contain object-center shrink-0 mx-auto md:scale-[1.15]"
        style={{ width: isMobile ? "50%" : banner.width, height: isMobile ? "auto" : banner.height }}
      />
      <div className="text-black font-Montserrat text-[16px] md:text-[12px] font-[400] leading-[120%]">
        {children}
      </div>
    </motion.div>
  );
};
