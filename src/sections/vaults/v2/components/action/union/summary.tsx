import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import ActionSummaryItem from "@/sections/vaults/v2/components/action/union/summary-item";
import { numberFormatter } from "@/utils/number-formatter";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { APYContent } from "@/sections/vaults/v2/components/vaults-table/columns";

const ActionSummary = (props: any) => {
  const { className } = props;

  const { currentProtocol } = useVaultsV2Context();

  return (
    <div
      className={clsx(
        "bg-[#FFDC50] rounded-[10px] p-[16px_30px_18px] md:p-[8px_15px_9px]",
        className
      )}
    >
      <div className="flex items-center gap-[14px]">
        <div className="flex items-center shrink-0">
          {currentProtocol?.tokens?.map((token: any, index: number) => (
            <LazyImage
              src={token.icon}
              alt=""
              key={index}
              containerClassName={clsx(
                "!w-[48px] !h-[48px] md:!w-[34px] md:!h-[34px] border border-black rounded-[50%] overflow-hidden",
                index > 0 && "ml-[-16px] md:ml-[-10px]"
              )}
              fallbackSrc="/assets/tokens/default_icon.png"
            />
          ))}
        </div>
        <div className="text-black font-Montserrat text-[26px] md:text-[20px] font-semibold leading-[26px] whitespace-nowrap">
          {currentProtocol?.tokens
            ?.map((token: any, index: number) => token.symbol)
            .join("-")}
        </div>
      </div>
      <div className="flex items-start md:grid md:grid-cols-2 gap-[60px] md:gap-x-[30px] md:gap-y-[20px] mt-[17px]">
        <ActionSummaryItem label="TVL">
          {numberFormatter(currentProtocol?.tvl, 2, true, {
            prefix: "$",
            isShort: true,
            isShortUppercase: true
          })}
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
              {numberFormatter(currentProtocol?.totalApy, 2, true, {
                isShort: true,
                isShortUppercase: true
              })}
              %
            </button>
          </Popover>
        </ActionSummaryItem>
        {currentProtocol?.extra_data?.pp_multiplier && (
          <ActionSummaryItem label="Points">
            <Popover
              trigger={PopoverTrigger.Hover}
              placement={PopoverPlacement.Bottom}
              triggerContainerClassName="inline-block"
              contentClassName="!z-[101]"
              closeDelayDuration={0}
              content={
                <div className="rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[5px_10px] max-w-[280px] text-center">{`This vault earns ${
                  currentProtocol?.extra_data?.pp_multiplier + "x"
                } points per iBGT claimed.`}</div>
              }
            >
              <button
                type="button"
                className="underline underline-offset-4 decoration-dashed"
              >
                {currentProtocol?.extra_data?.pp_multiplier}x
              </button>
            </Popover>
          </ActionSummaryItem>
        )}
        <ActionSummaryItem
          label="Protocol"
          valueClassName="flex items-center gap-[4px]"
        >
          <div className="flex-1 whitespace-nowrap">
            {currentProtocol.pool_project}
          </div>
        </ActionSummaryItem>
        <ActionSummaryItem
          label="Vaults"
          valueClassName="flex items-center gap-[4px]"
        >
          <LazyImage
            src={currentProtocol.protocolIcon}
            width={18}
            height={18}
            containerClassName="shrink-0 rounded-[4px] border border-[#FFFDEB] overflow-hidden"
            fallbackSrc="/assets/tokens/default_icon.png"
          />
          <div className="flex-1 whitespace-nowrap">
            {/^(Hub|Bex)$/i.test(currentProtocol.protocol)
              ? "Bex"
              : currentProtocol.protocol}
          </div>
        </ActionSummaryItem>
      </div>
    </div>
  );
};

export default ActionSummary;
