import clsx from "clsx";
import { motion } from "framer-motion";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { ACTION_TYPE, ActionTypes } from "@/sections/vaults/v2/config";
import ActionUnionForm from "@/sections/vaults/v2/components/action/union/form";
import KodiakUnstake from "@/sections/vaults/v2/components/action/kodiak-unstake";
import Berapaw from '@/sections/vaults/v2/components/action/union/berapaw';
import { useVaultsV2ActionContext } from '@/sections/vaults/v2/components/action/context';

const ActionUnionRight = (props: any) => {
  const { className } = props;

  const {
    isBeraPaw,
    actionType,
    formType,
    toggleActionType,
    currentProtocol,
    toggleActionVisible,
    getListData,
    currentDepositTab,
  } = useVaultsV2Context();
  const { beraPawRef, updateBalance } = useVaultsV2ActionContext();

  return (
    <div
      className={clsx(
        "w-full bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[24px_20px_20px_20px]",
        className
      )}
    >
      {/*#region 👇Switch Header*/}
      {
        formType !== "zap" && (
          <div
            className={clsx(
              "relative grid  h-[56px] flex-shrink-0 w-full rounded-[12px] border border-[#373A53] bg-white p-[5px_4px] text-center text-[18px] font-[600] leading-[90%] font-Montserrat text-[#000]",
              currentProtocol.protocol === "Memeswap"
                ? "grid-cols-3"
                : "grid-cols-2"
            )}
          >
            <div
              className="relative z-[1] h-full rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={() => {
                toggleActionType(ActionTypes[ACTION_TYPE.DEPOSIT]);
                updateBalance?.();
              }}
            >
              Deposit
            </div>
            {currentProtocol.protocol === "Memeswap" && (
              <div
                className="relative z-[1] h-full rounded-[10px] flex justify-center items-center cursor-pointer"
                onClick={() => {
                  toggleActionType(ActionTypes[ACTION_TYPE.EXIT]);
                  updateBalance?.();
                }}
              >
                Exit
              </div>
            )}
            <div
              className="relative z-[1] h-full rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={() => {
                toggleActionType(ActionTypes[ACTION_TYPE.WITHDRAW]);
                updateBalance?.();
              }}
            >
              Withdraw
            </div>
            <motion.div
              className={clsx(
                "absolute z-[0] w-[calc((100%_-_8px)_/_2)] h-[calc(100%_-_10px)] rounded-[10px] border border-[#000] bg-[#FFDC50] left-[4px] top-[5px]",
                currentProtocol.protocol === "Memeswap"
                  ? "w-[calc((100%_-_8px)_/_3)]"
                  : "w-[calc((100%_-_8px)_/_2)]"
              )}
              animate={{
                x:
                  actionType.value === ActionTypes[ACTION_TYPE.DEPOSIT].value
                    ? 0
                    : actionType.value === ActionTypes[ACTION_TYPE.EXIT].value
                      ? "100%"
                      : currentProtocol.protocol === "Memeswap"
                        ? "200%"
                        : "100%"
              }}
            />
          </div>
        )
      }
      {/*#endregion 👆*/}

      {/*#region 👇Form*/}
      {
        (
          currentProtocol?.protocol === "Kodiak"
          && actionType.value === ACTION_TYPE.WITHDRAW
        ) ? (
          <KodiakUnstake />
        ) : (
          <>
            <ActionUnionForm className="mt-[17px]" />
            {
              (isBeraPaw && actionType.value === ACTION_TYPE.DEPOSIT && currentDepositTab === "deposit") && (
                <Berapaw
                  ref={beraPawRef}
                  currentProtocol={currentProtocol}
                  approveClassName="mt-[30px]"
                  mintClassName="mt-[30px]"
                  onClose={() => {
                    toggleActionVisible({ visible: false });
                    getListData();
                  }}
                />
              )
            }
          </>
        )
      }
      {/*#endregion 👆*/}
    </div>
  );
};

export default ActionUnionRight;
