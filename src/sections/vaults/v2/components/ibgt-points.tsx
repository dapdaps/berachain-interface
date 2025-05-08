import clsx from "clsx";
import Card from '@/components/card';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';

const IBGTPoints = (props: any) => {
  const { className, cardClassName, contentClassName, placement, isPopover = true } = props;

  return (
    <Popover
      content={isPopover ? (
        <Card className={clsx("w-[195px] text-[14px] !bg-white !leading-[120%] font-[500] font-Montserrat !p-[12px_14px] !rounded-[10px]", cardClassName)}>
          Earn infrared points for staking iBGT overtime.
        </Card>
      ) : null}
      placement={placement || PopoverPlacement.Top}
      trigger={PopoverTrigger.Hover}
      closeDelayDuration={0}
      contentClassName={contentClassName}
    >
      <div
        className={clsx(
          "pl-[2px] pr-[6px] h-[20px] rounded-[10px] bg-[#FF82B4] text-black text-[12px] font-Montserrat flex justify-center items-center gap-[3px] font-[600]",
          className,
          isPopover ? "cursor-pointer" : "cursor-default"
        )}
      >
        <img src="/images/dapps/infrared/infrared.svg" alt="" className="shrink-0 w-[18px] h-[18px] border border-white rounded-full object-center object-contain" />
        <div className="">Points</div>
      </div>
    </Popover>
  );
};

export default IBGTPoints;

export const IBGTPointsMultiplier = (props: any) => {
  const { className, contentClassName, placement, isPopover = true, cardClassName, triggerContainerClassName, record } = props;

  return (
    <Popover
      content={isPopover ? (
        <Card className={clsx("w-[227px] text-[14px] !bg-white !leading-[120%] font-[500] font-Montserrat !p-[12px_14px] !rounded-[10px]", cardClassName)}>
          This vault earn <strong>{record?.extra_data?.pp_multiplier}x</strong> infrared points per iBGT claimed.
        </Card>
      ) : null}
      placement={placement || PopoverPlacement.Bottom}
      trigger={PopoverTrigger.Hover}
      closeDelayDuration={0}
      contentClassName={contentClassName}
      triggerContainerClassName={triggerContainerClassName}
    >
      <div
        className={clsx(
          "pl-[2px] pr-[7px] w-[63px] h-[24px] shrink-0 rounded-[11px] bg-[#FF82B4] leading-[1] text-black font-Montserrat text-[12px] font-bold flex justify-center items-center gap-[3px]",
          isPopover && "cursor-pointer",
          className
        )}
      >
        <img src="/images/dapps/infrared/infrared.svg" alt="" className="shrink-0 w-[18px] h-[18px] border border-white rounded-full object-center object-contain" />
        <div className="">
          <div className="">{record?.extra_data?.pp_multiplier}<span className="text-[10px]">x</span></div>
          <div className="text-[10px]">Points</div>
        </div>
      </div>
    </Popover>
  );
}
