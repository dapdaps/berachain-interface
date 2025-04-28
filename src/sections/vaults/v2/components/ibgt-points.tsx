import clsx from "clsx";
import Card from '@/components/card';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';

const IBGTPoints = (props: any) => {
  const { className, cardClassName, contentClassName, placement } = props;

  return (
    <Popover
      content={(
        <Card className={clsx("text-[14px] font-[400] font-Montserrat !p-[10px] !rounded-[10px]", cardClassName)}>
          Earn points for staking iBGT over time
        </Card>
      )}
      placement={placement || PopoverPlacement.Right}
      trigger={PopoverTrigger.Hover}
      closeDelayDuration={0}
      contentClassName={contentClassName}
    >
      <div className={clsx("px-[10px] cursor-pointer h-[22px] rounded-[15px] bg-[#e642a0] text-black text-[16px] flex justify-center items-center", className)}>
        Points
      </div>
    </Popover>
  );
};

export default IBGTPoints;
