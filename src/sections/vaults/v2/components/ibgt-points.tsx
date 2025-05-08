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
