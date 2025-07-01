import IconCheck from "@public/images/icon-check.svg";
import { useShares } from "./hooks/use-shares";
import { numberFormatter } from "@/utils/number-formatter";

const BaultsInfo = (props: any) => {
  const { data, lpAmount } = props;

  const { tokenLp, baults } = data ?? {};

  const {
    baultTokenShareAmount,
    baultTokenShareAmountLoading,
  } = useShares({
    data,
    lpAmount
  });

  if (!baults || !baults.length) {
    return null;
  }

  return (
    <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px] text-[14px] text-[#000] font-medium">
      <div className="flex justify-between items-start gap-[10px]">
        <div className="w-[200px] shrink-0">Auto-Compound Enabled</div>
        <div className="text-[#7EA82B] flex items-center gap-[4px] justify-end">
          <IconCheck className="w-[16px] h-[16px] object-contain object-center shrink-0 translate-y-[4px]" />
          <div className="">Active</div>
        </div>
      </div>
      <div className="flex justify-between items-start gap-[10px]">
        <div className="w-[200px] shrink-0">
          Expected Bault Shares
        </div>
        <div className="">
          {numberFormatter(baultTokenShareAmount?.amount, 9, true, { isShort: true, isShortUppercase: true })} Bault-{tokenLp?.symbol}
        </div>
      </div>
      <div className="w-full h-[1px] bg-black/20 my-[10px]"></div>
      <div className="text-[#3D405A] leading-[1.2] font-[400]">
        Your LP tokens will be automatically staked in the Bault, where rewards are harvested and reinvested to maximize your yield.
      </div>
    </div>
  );
};

export default BaultsInfo;
