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
    type: "dog-eared",
    content: "Infrared, Kodiak and Smilee are offering the most competitive points' multiplier exclusively for BeLong and those who provide liquidity in the pool.",
    style: {
      rotate: -4,
      translateX: 85,
      translateY: -30,
      zIndex: 2,
    },
  },
  {
    key: 2,
    title: "Leverage",
    icon: "/images/belong/v2/icon-chart.png",
    iconSize: 46,
    content: "Position yourself by leveraging your exposure to BERA by using Beraborrow's vault to lend your LP token and buying more BERA.",
    style: {
      rotate: 0.785,
      translateX: 25,
      zIndex: 1,
    },
  },
  {
    key: 3,
    title: "BGT Farm",
    icon: "/images/belong/v2/icon-farm.png",
    iconSize: 46,
    content: "The pool had the most consistent BGT APR in the whole Berachain space, thanks to permanent locked deal between Infrared and Smilee validators.",
    style: {
      rotate: -1.95,
      translateX: -25,
      translateY: -40,
      zIndex: 3,
    },
  },
  {
    key: 4,
    title: "Arbitrage",
    icon: "/images/belong/v2/icon-scale.png",
    iconSize: 33,
    type: "dog-eared",
    content: "wgBERA and iBERA are the two main BERA derivatives, and right now they offers incredible arbitrage opportunities.",
    style: {
      rotate: 7.752,
      translateX: -85,
      translateY: 20,
      zIndex: 4,
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
      <div className="mt-[80px] md:mt-[40px] flex justify-center items-center md:grid md:grid-cols-2 md:gap-[5px]">
        <AnimatePresence>
          {
            BENEFITS.map((item, index) => (
              <Card
                className="relative"
                key={item.key}
                title={item.title}
                icon={item.icon}
                type={item.type}
                iconSize={isMobile ? item.iconSize * 0.5 : item.iconSize}
                style={{
                  ...item.style,
                  translateX: isMobile ? 0 : item.style.translateX,
                  translateY: isMobile ? 0 : item.style.translateY,
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
  const { title, icon, iconSize = 46, className, children, type = "default", style } = props;

  return (
    <motion.div
      className={clsx(
        "w-[352px] h-[324px] md:w-[48vw] md:h-[44.15vw] bg-no-repeat bg-[length:100%_100%] bg-center shrink-0 flex flex-col justify-between items-stretch gap-[20px] md:gap-[10px] px-[50px] pt-[50px] pb-[40px] md:pl-[15px] md:pr-[15px] md:pt-[20px] md:pb-[20px]",
        type === "default" ? "bg-[url('/images/belong/v2/bg-sticky-note.png')]" : "bg-[url('/images/belong/v2/bg-sticky-note-dog-eared.png')]",
        className
      )}
      style={style}
      whileHover={{
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
        <div className="text-[#471C1C] font-CherryBomb text-[30px] md:text-[16px] font-[400] leading-[80%] uppercase">
          {title}
        </div>
        <img src={icon} alt="" className="w-[46px] h-[46px] object-contain object-center shrink-0" style={{ width: iconSize, height: iconSize }} />
      </div>
      <div className="text-black font-Montserrat text-[16px] md:text-[12px] font-[400] leading-[120%]">
        {children}
      </div>
    </motion.div>
  );
};
