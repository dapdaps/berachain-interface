import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import Card from '@/components/card';
import LazyImage from '@/components/layz-image';
import { numberFormatter } from '@/utils/number-formatter';
import clsx from 'clsx';
import useIsMobile from '@/hooks/use-isMobile';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { useEffect, useMemo, useRef } from 'react';

const RewardIcon = (props: any) => {
  const { reward, className } = props;

  const isMobile = useIsMobile();
  const { containerRef } = useVaultsV2Context();

  const popoverRef = useRef<any>();

  useEffect(() => {
    const handleScroll = () => {
      popoverRef.current?.onClose();
    };

    containerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Popover
      ref={popoverRef}
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
  const { reward, className, isNumber = true, record } = props;

  const { toggleClaimVisible, setCurrentProtocol } = useVaultsV2Context();

  const [claimRecord, claimToken] = useMemo(() => {
    if (!record) return [];
    let _claimToken: any;
    const _claimRecord = record.list.find((it: any) => it.user_reward?.some((_it: any) => {
      if (_it.address.toLowerCase() === reward.address.toLowerCase()) {
        _claimToken = _it;
        return true;
      }
      return false;
    }));
    return [_claimRecord, _claimToken];
  }, [record, reward]);

  return (
    <>
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
        {
          isNumber && (
            <div className="flex items-center justify-end shrink-0">
              {numberFormatter(reward.amount, 6, true, { isShort: true, isShortUppercase: true })}
            </div>
          )
        }
      </div>
      {
        (claimRecord && claimToken) && (
          <div className="flex items-center justify-between gap-[10px] shrink-0">
            <div className="flex items-center justify-end shrink-0 text-[#6CA200] text-[16px] font-[500]">
              +{numberFormatter(claimToken.amount, 6, true, { isShort: true, isShortUppercase: true })}
            </div>
            <button
              type="button"
              className="shrink-0 w-[53px] h-[25px] rounded-[6px] bg-[#FFDC50] border border-black text-[14px] font-[500] flex justify-center items-center"
              onClick={() => {
                setCurrentProtocol(claimRecord);
                toggleClaimVisible(true, claimRecord.user_reward);
              }}
            >
              Claim
            </button>
          </div>
        )
      }
    </>
  );
};
