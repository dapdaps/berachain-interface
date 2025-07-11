import Card from "@/components/card";
import Popover, { PopoverPlacement, PopoverTrigger } from "@/components/popover";
import clsx from "clsx";

const BelongTips = (props: any) => {
  const { cardClassName, className, children, placement = PopoverPlacement.Top, trigger = PopoverTrigger.Hover, closeDelayDuration = 0 } = props;

  return (
    <Popover
      content={(
        <Card className={clsx("!rounded-[10px] w-[220px] !p-[5px_10px] text-[12px] font-[400] text-[#3D405A] leading-[1.2]", cardClassName)}>
          {children}
        </Card>
      )}
      placement={placement}
      trigger={trigger}
      closeDelayDuration={closeDelayDuration}
      triggerContainerClassName={clsx("w-[12px] h-[12px] shrink-0 cursor-pointer", className)}
    >
      <img src="/images/icon-info.svg" alt="" className="w-full h-full cursor-pointer object-center object-contain" />
    </Popover>
  );
};

export default BelongTips;
