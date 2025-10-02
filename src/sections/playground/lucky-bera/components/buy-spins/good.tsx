import { numberFormatter } from "@/utils/number-formatter";
import LightingButton from '@/components/button/lighting-button';
import Big from "big.js";
import clsx from "clsx";

const SpinGood = (props: any) => {
  const { className, costToken, data, onBuySpins, loading, isChainSupported } = props;

  return (
    <div
      className="w-full h-[153px] pt-[8px] flex flex-col items-center flex-shrink-0 font-CherryBomb rounded-[16px] border-[2px] border-[#D7C69D] bg-[#FFFAEA] text-[#FF7EC1] text-center text-[24px] leading-[100%] tracking-[-1px] uppercase [font-style:normal] [font-weight:400] "
    >
      <div className="text-center flex justify-center items-end gap-[2px] rotate-[-6deg]">
        <div className="relative">
          <div className="[text-shadow:0_4px_0_#4B371F] [-webkit-text-stroke-width:2px] [-webkit-text-stroke-color:#4B371F] [-webkit-text-stroke:2px_#4B371F]">
            {data.amount}
          </div>
          <div
            className="absolute right-[-20px] bottom-[-12px] px-[4px] h-[14px] bg-[#4B371F] flex justify-center items-center rounded-[8px] text-[#F7F9EA] text-center font-CherryBomb text-[12px] font-normal leading-[100%] tracking-[0px] uppercase [text-shadow:0_0px_0_#B42647] [-webkit-text-stroke-width:0px]"
          >
            +{numberFormatter(Big(data.add || 0).times(100), 2, true)}%
          </div>
        </div>
      </div>
      <img
        src="/images/playground/lucky-bera/ticket-spin.png"
        alt=""
        className="w-[70px] h-[70px] shrink-0 object-center object-contain mt-[5px]"
      />
      <LightingButton
        outerClassName={clsx(
          "w-full mt-auto !h-[50px]",
          (loading || !isChainSupported) ? "translate-y-[-4px]" : "",
        )}
        className="flex-col !gap-[0px] whitespace-nowrap !leading-[100%] relative"
        disabled={loading || !isChainSupported}
        onClick={() => {
          onBuySpins(data);
        }}
      >
        {
          data.isHot && (
            <img
              src="/images/playground/lucky-bera/hot.png"
              alt=""
              className="w-[66px] h-[34px] shrink-0 object-center object-contain absolute top-[-25px] left-[-20px]"
            />
          )
        }

        <div className="relative z-[1] text-[12px] line-through decoration-red-500 decoration-2 [-webkit-text-stroke-width:1px] [-webkit-text-stroke-color:#4B371F]">
          {data.delPrice} {costToken.symbol}
        </div>
        <div className="flex justify-center items-center gap-[4px] translate-y-[-2px]">
          <img
            src={costToken.icon}
            alt=""
            className="w-[20px] h-[20px] rounded-full object-center object-contain"
          />
          <div className="translate-y-[-1px] [-webkit-text-stroke-width:0px text-[#4B371F] text-[20px] tracking-[1px] font-[400]">
            {data.price}
          </div>
        </div>
      </LightingButton>
    </div>
  );
};

export default SpinGood;
