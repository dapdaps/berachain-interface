import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import clsx from 'clsx';
import useIsMobile from '@/hooks/use-isMobile';

const RewardIcon = (props: any) => {
  const { reward, className } = props;

  const isMobile = useIsMobile();

  return (
    <Popover
      trigger={isMobile ? PopoverTrigger.Click : PopoverTrigger.Hover}
      placement={PopoverPlacement.Bottom}
      content={(
        <Card className="!rounded-[10px] !p-[10px] w-[200px] flex flex-col items-stretch gap-[10px_5px]">
          <RewardIconContent reward={reward} />
        </Card>
      )}
    >
      <LazyImage
        src={reward.icon}
        width={26}
        height={26}
        containerClassName={clsx("relative shrink-0 rounded-full overflow-hidden cursor-pointer", className)}
        fallbackSrc="/assets/tokens/default_icon.png"
        variants={{
          focus: {
            scale: 1.1,
            zIndex: 1,
          },
        }}
        whileHover="focus"
        whileTap="focus"
      />
    </Popover>
  );
};

export default RewardIcon;

export const RewardIconContent = (props: any) => {
  const { reward, className } = props;

  return (
    <div className={clsx("w-full flex justify-between items-center gap-[10px] text-[#000] font-Montserrat text-[14px] font-[500] leading-[100%]", className)}>
      <div className="flex items-center gap-[5px] flex-1 w-0">
        <LazyImage
          src={reward.icon}
          width={26}
          height={26}
          containerClassName="shrink-0 rounded-full overflow-hidden"
          fallbackSrc="/assets/tokens/default_icon.png"
        />
        <a
          href={reward.link}
          target="_blank"
          rel="noreferrer nofollow"
          className="flex-1 w-0 flex items-center"
        >
          <div className="whitespace-nowrap overflow-hidden text-ellipsis relative">
            {reward.symbol}
            <div className="absolute bottom-0 left-0 w-full h-[1px] border-b border-dashed border-black"></div>
          </div>
          <img src="/images/vaults/v2/open-link.svg" alt="" className="w-[20px] h-[20px] object-center object-cover shrink-0" />
        </a>
      </div>
      <div className="flex items-center justify-end shrink-0">
        {numberFormatter(reward.amount, 6, true, { isShort: true, isShortUppercase: true })}
      </div>
    </div>
  );
};
