import Loading from "@/components/loading";
import { numberFormatter } from "@/utils/number-formatter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const Lootbox = (props: any) => {
  const {
    product_id,
    category,
    name,
    price,
    reward_balance,
    end_time,
    imgBox,
    onBuy,
    loading,
    buyBox,
  } = props;

  return (
    <div className="flex items-center justify-center">
      <div
        className="w-[206px] h-[164px] md:w-[100px] md:h-[80px] bg-no-repeat bg-center bg-contain shrink-0 translate-x-[10px] relative z-[2]"
        style={{ backgroundImage: `url("${imgBox}")` }}
      >
      </div>
      <div className="w-[248px] p-[10px_10px_22px_15px] md:w-[200px] md:p-[5px_5px_11px_8px] md:rounded-[10px] rounded-[18px] border border-black bg-[#FFE5B8] shadow-shadow1 shrink-0 relative z-[1]">
        <div className="text-black font-[600] text-[20px] md:text-[14px] font-CherryBomb text-center mb-[7px] leading-[100%] whitespace-nowrap">
          {name}’s Lootbox
        </div>
        <LabelValue label="Price">
          {numberFormatter(price, 6, true)} Bera
        </LabelValue>
        <LabelValue label="NFT remaining">
          {numberFormatter(reward_balance, 0, true)}
        </LabelValue>
        <LabelValue label="Expiring date">
          {dayjs(end_time * 1000).utc().format("YYYY-MM-DD")} UTC
        </LabelValue>
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
      </div>
    </div>
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
