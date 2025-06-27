import Card from "@/components/card";
import Loading from "@/components/loading";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import Switch from "@/components/switch";
import { numberFormatter } from "@/utils/number-formatter";
import { useShares } from "./hooks/use-shares";
import Big from "big.js";

const Baults = (props: any) => {
  const { data, autoCompound, setAutoCompound, lpAmount } = props;

  const { tokenLp, baults } = data ?? {};

  if (!baults || !baults.length) {
    return null;
  }

  const {
    exitFee,
    depositFee,
    baultTokenShareAmount,
    baultTokenShareAmountLoading,
  } = useShares({
    data,
    lpAmount
  });

  return (
    <div className="mt-[15px]">
      <div className="rounded-[12px] border-[#373A53] border p-[14px] text-[14px] text-[#000] font-medium flex items-center justify-between gap-[10px]">
        <div className="flex-1 flex items-center gap-[5px] whitespace-nowrap">
          <Popover
            content={(
              <Card className="w-[250px] !p-[5px_5px] !rounded-[4px] text-[12px]">
                Auto-compounding automatically reinvests your rewards. This Bault does not have an associated Kodiak Farm for additional staking.
              </Card>
            )}
            placement={PopoverPlacement.TopLeft}
            trigger={PopoverTrigger.Hover}
            closeDelayDuration={0}
          >
            <img src="/images/icon-tips-primary.svg" alt="" className="w-[16px] h-[16px] object-contain object-center shrink-0" />
          </Popover>
          <div>Auto-Compound Rewards</div>
        </div>
        <Switch
          className="shrink-0 ml-[10px]"
          value={autoCompound}
          onChange={() => {
            setAutoCompound(!autoCompound);
          }}
        />
      </div>
      {
        autoCompound && (
          <div className="rounded-[12px] border-[#373A53] border p-[14px] mt-[10px] text-[14px] text-[#000] font-medium leading-[1.5]">
            <div className="">
              You will receive:
            </div>
            <div className="flex items-center justify-between gap-[10px] mt-[10px]">
              <div className="flex items-center gap-[5px] font-[600]">
                <div className="w-[16px] h-[16px] rounded-full shrink-0 bg-[#FFDC50] bg-[url('/images/icon-flash.svg')] bg-center bg-no-repeat bg-[length:10px_auto]"></div>
                <div className="">
                  Bault-{tokenLp?.symbol}
                </div>
              </div>
              <div className="font-[700]">
                {
                  baultTokenShareAmountLoading ? (
                    <Loading size={14} />
                  ) : (
                    `~${numberFormatter(baultTokenShareAmount?.amount, 6, true, { isShort: true, isShortUppercase: true })}`
                  )
                }
              </div>
            </div>
            <div className="text-[0.8em] leading-[1.2] mt-[10px]">
              These shares represent your position in the auto-compounding vault (Bault).
            </div>
            <div className="w-full h-[1px] bg-black/20 my-[10px]"></div>
            <div className="">
              With Auto-Compound
            </div>
            <div className="flex justify-between items-center gap-[10px] whitespace-nowrap mt-[10px] text-[#3D405A]">
              <div className="">
                Deposit Fee:
              </div>
              <div className="">
                {
                  baultTokenShareAmountLoading ? (
                    <Loading size={14} />
                  ) : numberFormatter(
                    (lpAmount && Big(lpAmount).gt(0)) ? depositFee / 100 : 0,
                    3,
                    true,
                    { isShort: true, isShortUppercase: true, isZeroPrecision: true }
                  ) + "%"
                }
              </div>
            </div>
            <div className="flex justify-between items-center gap-[10px] whitespace-nowrap text-[#3D405A]">
              <div className="">
                Exit Fee:
              </div>
              <div className="">
                {
                  baultTokenShareAmountLoading ? (
                    <Loading size={14} />
                  ) : numberFormatter(
                    (lpAmount && Big(lpAmount).gt(0)) ? exitFee / 100 : 0,
                    3,
                    true,
                    { isShort: true, isShortUppercase: true, isZeroPrecision: true }
                  ) + "%"
                }
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Baults;
