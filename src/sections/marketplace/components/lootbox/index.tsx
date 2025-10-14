import Loading from "@/components/loading";
import { numberFormatter } from "@/utils/number-formatter";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const Lootbox = (props: any) => {
  const {
    product_id,
    category,
    price,
    reward_balance,
    start_time,
    onBuy,
    loading,
    buyBox,
  } = props;

  return (
    <div className="flex items-center">
      <div className="w-[136px] h-[108px] shrink-0 bg-[url('/images/treasure-book/box.png')] bg-no-repeat bg-center bg-contain shrink-0 translate-x-[20px] relative z-[2]">
      </div>
      <div className="w-[182px] rounded-[18px] border border-black pl-[8px] bg-[#B99C69] shadow-shadow1 shrink-0 relative z-[1]">
        <div className="w-full h-full rounded-[18px] border border-black bg-[#FFE5B8] py-[11px] pl-[8px] pr-[12px] relative">
          <div className="text-[#3D405A] font-[600] text-[14px] font-Montserrat pl-[16px] mb-[10px]">
            {category}
          </div>
          <LabelValue label="Price">
            {numberFormatter(price, 6, true)} BERA
          </LabelValue>
          <LabelValue label="NFT Remaining">
            {numberFormatter(reward_balance, 0, true)}
          </LabelValue>
          <LabelValue label="Sale time">
            {dayjs(start_time * 1000).utc().format("YYYY-MM-DD")}
          </LabelValue>
          <button
            type="button"
            className="absolute flex items-center justify-center gap-[5px] disabled:bg-[#f5e9b3] disabled:!cursor-not-allowed bottom-[-12px] left-1/2 translate-x-[-50%] z-[2] hover:scale-[1.1] ease-in-out duration-300 border border-black bg-[#FFDC50] rounded-[10px] px-[24px] py-[7px] leading-none font-Montserrat font-[600] text-[#000] text-[16px]"
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
    </div>
  );
};

export default Lootbox;

const LabelValue = (props: any) => {
  const { label, children } = props;

  return (
    <div className="flex-shrink-0 leading-none mb-[10px] last:mb-0 flex items-start justify-between text-[14px] font-Montserrat pl-[16px]">
      <div className="text-[#3D405A] font-[600] whitespace-nowrap text-[12px] leading-[100%]">
        {label}
      </div>
      <div className="font-[600] text-[12px] leading-[100%] mb-[2px]">
        {children}
      </div>
    </div>
  );
};
