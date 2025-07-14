import clsx from "clsx";
import BelongTitle from "./title";

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

  return (
    <div className={clsx("", className)} style={style}>
      <BelongTitle>
        How does it work?
      </BelongTitle>
      <div className="relative w-full mt-[67px] flex flex-col gap-[40px]">
        {
          Steps.map((item, index) => {
            return (
              <div
                key={item.key}
                className={clsx(
                  "w-full h-[380px] p-[20px] flex justify-between items-center gap-[12px] rounded-[20px] border border-black backdrop-blur-[10px] text-black font-Montserrat text-[16px] font-[400] leading-[120%]",
                  index % 2 === 0 ? "flex-row bg-[#FFDC50]" : "flex-row-reverse bg-[#FFFDEB]"
                )}
              >
                <div className="h-full flex flex-col justify-between p-[40px]">
                  <div className="flex justify-between items-start">
                    <div className="text-[#471C1C] font-CherryBomb text-[30px] font-[400] leading-[80%] uppercase">
                      {item.key}.
                    </div>
                    <img
                      src={item.icon}
                      alt=""
                      className={clsx(
                        "w-[10px] h-[10px] object-contain object-center shrink-0",
                        index % 2 !== 0 && "translate-x-[-220px]"
                      )}
                    />
                  </div>
                  <div className="">
                    <div className="text-[#471C1C] font-CherryBomb text-[30px] font-normal leading-[80%] uppercase">
                      {item.title}
                    </div>
                    <div className="mt-[20px]">
                      {item.content}
                    </div>
                  </div>
                </div>
                <img src={item.banner} alt="" className="w-[454px] h-full object-contain object-center shrink-0 pointer-events-none" />
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

export default HowWork;
