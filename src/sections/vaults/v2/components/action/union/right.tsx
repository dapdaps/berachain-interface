import clsx from "clsx";
import { motion } from "framer-motion";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { ACTION_TYPE, ActionTypes } from "@/sections/vaults/v2/config";
import ActionUnionForm from "@/sections/vaults/v2/components/action/union/form";
import KodiakUnstake from "@/sections/vaults/v2/components/action/kodiak-unstake";

const ActionUnionRight = (props: any) => {
  const { className } = props;

  const { actionType, toggleActionType, currentProtocol } =
    useVaultsV2Context();

  return (
    <div
      className={clsx(
        "w-full bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[24px_20px_20px_20px]",
        className
      )}
    >
      <div className="relative grid grid-cols-2 h-[56px] flex-shrink-0 w-full rounded-[12px] border border-[#373A53] bg-white p-[5px_4px] text-center text-[18px] font-[600] leading-[90%] font-Montserrat text-[#000]">
        <div
          className="relative z-[1] h-full rounded-[10px] flex justify-center items-center cursor-pointer"
          onClick={() => toggleActionType(ActionTypes[ACTION_TYPE.DEPOSIT])}
        >
          Deposit
        </div>
        <div
          className="relative z-[1] h-full rounded-[10px] flex justify-center items-center cursor-pointer"
          onClick={() => toggleActionType(ActionTypes[ACTION_TYPE.WITHDRAW])}
        >
          Withdraw
        </div>
        <motion.div
          className="absolute z-[0] w-[calc((100%_-_8px)_/_2)] h-[calc(100%_-_10px)] rounded-[10px] border border-[#000] bg-[#FFDC50] left-[4px] top-[5px]"
          animate={{
            x:
              actionType.value === ActionTypes[ACTION_TYPE.DEPOSIT].value
                ? 0
                : "100%"
          }}
        />
      </div>
      {currentProtocol?.protocol === "Kodiak" &&
      actionType.value === ACTION_TYPE.WITHDRAW ? (
        <KodiakUnstake />
      ) : (
        <ActionUnionForm className="mt-[17px]" />
      )}
    </div>
  );
};

export default ActionUnionRight;
