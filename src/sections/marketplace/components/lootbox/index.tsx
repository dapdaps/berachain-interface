import Card from "@/components/card";
import Loading from "@/components/loading";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { motion } from "framer-motion";
import { useMemo } from "react";

dayjs.extend(utc);

const Lootbox = (props: any) => {
  const {
    product_id,
    category,
    name,
    title,
    price,
    reward_balance,
    end_time,
    isRaffle,
    imgBox,
    onBuy,
    loading,
    buyBox,
  } = props;

  const isSoldOut = useMemo(() => {
    return reward_balance <= 0;
  }, [reward_balance]);

  return (
    <Popover
      content={isRaffle ? (
        <Card className="w-[400px] !p-[10px_15px] !bg-[#FFE5B8] !rounded-[12px]">
          In the Mibera lootbox, users can earn a custom Mibera vending machine NFT, which acts as a raffle ticket to win a custom Mibera trait, hand-designed by Gumi. Winner will be announced once all tickets are won.
        </Card>
      ) : null}
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
    >
      <motion.div
        className="flex items-center justify-center"
        whileHover="rotate"
      >
        <motion.div
          className="w-[206px] h-[164px] md:w-[100px] md:h-[80px] bg-no-repeat bg-center bg-contain shrink-0 translate-x-[10px] relative z-[2]"
          style={{ backgroundImage: `url("${imgBox}")`, x: 10, }}
          variants={{
            rotate: {
              rotate: [1, 0, -1],
            },
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 10,
          }}
        >
          {
            isSoldOut && (
              <div className="w-full h-full flex justify-center items-center bg-[url('/images/playground/magician/lootbox/box-mask.png')] bg-no-repeat bg-center bg-contain">
                <div className="w-[110px] h-[40px] leading-[40px] bg-white/50 backdrop-blur-sm rotate-[-15deg] font-Montserrat rounded-[10px] uppercase text-white font-[800] text-16px text-center">
                  SOLD OUT
                </div>
              </div>
            )
          }
          {
            isRaffle && (
              <img
                src="/images/market-place/raffle-ticket.png"
                alt=""
                className="w-[73px] h-[58px] object-center object-contain absolute left-[0px] top-[-10px] rotate-[-2deg]"
              />
            )
          }
        </motion.div>
        <div className="w-[248px] p-[10px_10px_22px_15px] md:w-[200px] md:p-[5px_5px_11px_8px] md:rounded-[10px] rounded-[18px] border border-black bg-[#FFE5B8] shadow-shadow1 shrink-0 relative z-[1]">
          <div className={clsx(
            "text-black font-[600] md:text-[14px] font-CherryBomb text-center mb-[7px] leading-[100%] whitespace-nowrap",
            title?.length > 22 ? "text-[15px]" : "text-[20px]",
          )}>
            {title}
          </div>
          <LabelValue label="Price">
            {numberFormatter(price, 6, true)} Bera
          </LabelValue>
          <LabelValue label={isRaffle ? "Tickets" : "NFT remaining"}>
            {numberFormatter(reward_balance, 0, true)}
          </LabelValue>
          <LabelValue label="Expiring date">
            {dayjs(end_time * 1000).utc().format("YYYY-MM-DD")} UTC
          </LabelValue>
          {
            !isSoldOut && (
              <button
                type="button"
                className="absolute flex items-center justify-center gap-[5px] disabled:bg-[#f5e9b3] disabled:!cursor-not-allowed bottom-[-27px] left-1/2 translate-x-[-50%] z-[2] hover:scale-[1.1] ease-in-out duration-300 border border-black bg-[#FFDC50] rounded-[10px] px-[39px] py-[12px] leading-none font-Montserrat font-[600] text-[#000] text-[16px]"
                disabled={loading && buyBox?.product_id === product_id}
                onClick={onBuy}
              >
                {
                  (loading && buyBox?.product_id === product_id) && (
                    <Loading size={16} />
                  )
                }
                <div>Buy</div>
              </button>
            )
          }
        </div>
      </motion.div>
    </Popover>
  );
};

export default Lootbox;

const LabelValue = (props: any) => {
  const { label, children } = props;

  return (
    <div className="flex-shrink-0 leading-none mb-[7px] last:mb-0 flex items-start justify-between text-[14px] font-Montserrat">
      <div className="text-[#3D405A] font-[600] whitespace-nowrap text-[12px] leading-[100%]">
        {label}
      </div>
      <div className="font-[600] text-[12px] leading-[100%] mb-[2px]">
        {children}
      </div>
    </div>
  );
};
