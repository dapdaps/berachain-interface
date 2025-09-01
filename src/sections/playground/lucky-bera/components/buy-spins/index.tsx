import { bera } from "@/configs/tokens/bera";
import SpinGood from "./good";

const BuySpins = (props: any) => {
  const { } = props;

  const costToken = bera["bera"];

  return (
    <div className="w-full relative px-[20px] text-[16px] font-Montserrat font-[600] leading-[90%]">
      <div className="flex items-center justify-center gap-[7px] pt-[19px]">
        <img
          src="/images/playground/lucky-bera/icon-spins.png"
          alt=""
          className="w-[70px] h-[70px] shrink-0 object-center object-contain"
        />
        <div className="text-[26px] font-CherryBomb font-normal leading-normal capitalize text-center text-[#FDD54C] [text-shadow:0_2px_0_#000] [text-stroke:2px_#000] [webkit-text-stroke:2px_#000]" style={{ WebkitTextStrokeWidth: '2px', WebkitTextStrokeColor: '#000' }}>
          Buy Spin Times
        </div>
      </div>
      <div className="w-full mt-[20px] relative">
        <input
          type="text"
          className="w-full pl-[120px] h-[58px] bg-white border border-black rounded-[12px] text-right text-[26px] font-Montserrat font-[600] text-black px-[16px]"
        />
        <div className="absolute left-[16px] top-1/2 -translate-y-1/2">
          Spin Times
        </div>
      </div>
      <div className="mt-[20px] flex justify-between items-center gap-[10px]">
        <div className="flex items-center gap-[8px] shrink-0">
          <img
            src={costToken.icon}
            alt=""
            className="w-[26px] h-[26px] rounded-full object-center object-contain"
          />
          <div className="">
            {costToken.symbol}
          </div>
        </div>
        <div className="w-0 flex-1 border-t border-dashed border-black"></div>
        <div className="shrink-0">
          1
        </div>
      </div>
      <div className="mt-[34px]">
        <button
          type="button"
          className="disabled:opacity-30 disabled:!cursor-not-allowed hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] transition-all duration-150 rounded-[10px] border border-black bg-[#FFDC50] shadow-[6px_6px_0_0_rgba(0,0,0,0.25)] h-[50px] flex-shrink-0 text-black text-center font-Montserrat text-[16px] font-bold leading-[150%] w-full"
        >
          Buy
        </button>
      </div>
      <div className="grid grid-cols-3 gap-[12px] mt-[34px]">
        <SpinGood costToken={costToken} />
        <SpinGood costToken={costToken} />
        <SpinGood costToken={costToken} />
      </div>
    </div>
  );
};

export default BuySpins;
