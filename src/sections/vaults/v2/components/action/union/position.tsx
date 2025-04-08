import clsx from "clsx";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import LazyImage from "@/components/layz-image";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";

const ActionUnionPotions = (props: any) => {
  const { className } = props;

  const { currentProtocol, actionType, toggleOpenAddLp } = useVaultsV2Context();

  return (
    <div
      className={clsx(
        "w-full pl-[17px] pr-[2px] border-b border-[rgba(0,0,0,0.15)] pb-[46px]",
        className
      )}
    >
      <div className="text-[18px] font-Montserrat font-bold leading-[90%] text-black">
        Your Position
      </div>
      <div className="flex items-center gap-[10px] justify-between mt-[21px] h-[46px]">
        <div className="flex items-center gap-[10px] flex-1">
          <div className="flex items-center">
            {currentProtocol?.tokens?.map((token: any, index: number) => (
              <LazyImage
                key={index}
                src={token.icon}
                containerClassName={clsx(
                  "!w-[30px] !h-[30px] rounded-[50%] overflow-hidden shrink-0",
                  index > 0 && "ml-[-10px]"
                )}
                fallbackSrc="/assets/tokens/default_icon.png"
              />
            ))}
          </div>
          <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
            {currentProtocol?.tokens
              ?.map((token: any, index: number) => token.symbol)
              .join("-")}
          </div>
        </div>
        {["Bex", "Kodiak", "BurrBear"].includes(currentProtocol.lpProtocol) &&
          actionType.value === ACTION_TYPE.DEPOSIT && (
            <button
              type="button"
              className="flex justify-center items-center w-[148px] h-[46px] flex-shrink-0 rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[18px] font-semibold leading-[90%]"
              onClick={() => {
                toggleOpenAddLp(true);
              }}
            >
              Mint LP
            </button>
          )}
      </div>
    </div>
  );
};

export default ActionUnionPotions;
