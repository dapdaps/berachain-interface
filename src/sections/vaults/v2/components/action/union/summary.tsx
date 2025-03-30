import clsx from "clsx";
import LazyImage from '@/components/layz-image';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import ActionSummaryItem from '@/sections/vaults/v2/components/action/union/summary-item';
import { numberFormatter } from '@/utils/number-formatter';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import { APYContent } from '@/sections/vaults/v2/components/vaults-table/columns';

const ActionSummary = (props: any) => {
  const { className } = props;

  const { currentProtocol } = useVaultsV2Context();

  return (
    <div className={clsx("bg-[#FFDC50] rounded-[10px] p-[16px_30px_18px] md:p-[8px_15px_9px]", className)}>
      <div className="flex items-center gap-[14px]">
        <div className="flex items-center shrink-0">
          {
            currentProtocol?.tokens?.map((token: any, index: number) => (
              <LazyImage
                src={token.icon}
                alt=""
                key={index}
                containerClassName={clsx("!w-[48px] !h-[48px] md:!w-[34px] md:!h-[34px] border border-black rounded-full", index > 0 && "ml-[-16px] md:ml-[-10px]")}
                fallbackSrc="/assets/tokens/default_icon.png"
              />
            ))
          }
        </div>
        <div className="text-black font-Montserrat text-[26px] md:text-[20px] font-semibold leading-[26px] whitespace-nowrap">
          {currentProtocol?.tokens?.map((token: any, index: number) => token.symbol).join('-')}
        </div>
      </div>
      <div className="flex items-start gap-[60px] md:gap-[30px] mt-[17px]">
        <ActionSummaryItem label="TVL">
          {numberFormatter(currentProtocol?.tvl, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}
        </ActionSummaryItem>
        <ActionSummaryItem label="APY">
          <Popover
            triggerContainerClassName="inline-block"
            content={<APYContent record={currentProtocol} />}
            trigger={PopoverTrigger.Hover}
            placement={PopoverPlacement.Bottom}
            contentClassName="!z-[101]"
            closeDelayDuration={0}
          >
            <button
              type="button"
              className="underline underline-offset-4 decoration-dashed"
            >
              {numberFormatter(currentProtocol?.totalApy, 2, true, { isShort: true, isShortUppercase: true })}%
            </button>
          </Popover>
        </ActionSummaryItem>
        <ActionSummaryItem label="Protocol" valueClassName="flex items-center gap-[4px]">
          <LazyImage
            src={currentProtocol.protocolIcon}
            width={16}
            height={16}
            containerClassName="shrink-0"
            fallbackSrc="/assets/tokens/default_icon.png"
          />
          <div className="flex-1 whitespace-nowrap">
            {currentProtocol.pool_project}
          </div>
        </ActionSummaryItem>
      </div>
    </div>
  );
};

export default ActionSummary;
