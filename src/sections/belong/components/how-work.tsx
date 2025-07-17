import clsx from "clsx";
import BelongTitle from "./title";
import useIsMobile from "@/hooks/use-isMobile";

const Steps = [
  {
    key: 1,
    title: "ONE CLICK ZAP TO wgBERA-iBERA",
    content: "Zap your bags and they will be automatically deposited directly into the wgBERA-iBERA on Kodiak, the best BERA stable performing pool.",
    banner: "/images/belong/v2/banner-zap.png",
    icon: "/images/belong/v2/icon-plus-black.svg",
  },
  {
    key: 2,
    title: "LP TOKEN IS LOCKED TO BORROW NECT",
    content: "NECT, one of the major stablecoins within Berachain, is automatically minted in background as soon as you click the button \"Deposit\" above.",
    banner: "/images/belong/v2/banner-nect.png",
    icon: "/images/belong/v2/icon-plus-primary.svg",
  },
  {
    key: 3,
    title: "EXPOSURE INCREASE BY LOOPING UP TO 5x",
    content: "NECT is being sold to buy more wgBERA and iBERA, compouding your position within the pool and the exposition to BERA. Watch out for liquidations, check more details here: BERABORROW LINK TO WGBERA-IBERA LP VAULT",
    banner: "/images/belong/v2/banner-leverage.png",
    icon: "/images/belong/v2/icon-plus-black.svg",
  },
];

const HowWork = (props: any) => {
  const { className, style } = props;

  const isMobile = useIsMobile();

  return (
    <div className={clsx("", className)} style={style}>
      <BelongTitle>
        How does it work?
      </BelongTitle>
      <div className="relative w-full mt-[67px] md:mt-[30px] flex flex-col gap-[40px] md:gap-[20px] md:px-[15px]">
        {
          Steps.map((item, index) => {
            return (
              <div
                key={item.key}
                className={clsx(
                  "relative w-full h-[380px] md:h-[unset] p-[20px] md:p-[15px] flex md:flex-col justify-between items-center gap-[12px] md:gap-[16px] rounded-[20px] border border-black backdrop-blur-[10px] text-black font-Montserrat text-[16px] md:text-[14px] font-[400] leading-[120%]",
                  index % 2 === 0 ? "flex-row bg-[#FFDC50]" : "flex-row-reverse bg-[#FFFDEB]"
                )}
              >
                <div className="h-full flex flex-col justify-between p-[40px] md:p-[0px]">
                  {
                    isMobile && (
                      <img
                        src={item.banner}
                        alt=""
                        className="w-[317px] object-contain object-center shrink-0 pointer-events-none"
                      />
                    )
                  }
                  <div className="flex justify-between items-start">
                    <div
                      className={clsx(
                        "text-[#471C1C] font-CherryBomb text-[30px] font-[400] leading-[80%] uppercase md:absolute md:top-[26px] md:left-[30px]",
                        index > 0 ? "md:text-white" : ""
                      )}
                    >
                      {item.key}.
                    </div>
                    {
                      !isMobile && (
                        <img
                          src={item.icon}
                          alt=""
                          className={clsx(
                            "w-[10px] h-[10px] object-contain object-center shrink-0",
                            index % 2 !== 0 && "translate-x-[-220px]"
                          )}
                        />
                      )
                    }
                  </div>
                  <div className="md:mt-[10px]">
                    <div className="text-[#471C1C] font-CherryBomb text-[30px] md:text-[22px] font-normal leading-[80%] uppercase md:w-[270px]">
                      {item.title}
                    </div>
                    <div className="mt-[20px] md:mt-[10px] md:text-[12px]">
                      {item.content}
                    </div>
                  </div>
                </div>
                {
                  !isMobile && (
                    <img
                      src={item.banner}
                      alt=""
                      className="w-[454px] h-full object-contain object-center shrink-0 pointer-events-none"
                    />
                  )
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default HowWork;
