import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import InputNumber from "@/components/input-number";
import ButtonWithApprove from "@/components/button/button-with-approve";
import { numberFormatter } from "@/utils/number-formatter";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import useAction from "../../hooks/use-action";
import { useMemo, useState } from "react";
import AddLiquidityModal from "@/sections/pools/add-liquidity-modal";
import Big from "big.js";
import Loading from "@/components/loading";
import Range from "@/components/range";
import { ACTION_TYPE } from "../../config";
import ActionInput from '@/sections/vaults/v2/components/action/input';
import ActionRangeDays from '@/sections/vaults/v2/components/action/range-days';
import ActionMintLP from '@/sections/vaults/v2/components/action/mint-lp';

const Action = (props: any) => {
  const { className } = props;
  const { actionType, currentRecord, openAddLp, toggleOpenAddLp } = useVaultsV2Context();
  const {
    loading,
    onAction,
    amount,
    handleAmountChange,
    inputError,
    inputErrorMessage,
    balance: depositBalance,
    updateBalance,
    balanceLoading,
    dappParams,
    setDappParams
  } = useAction();

  const balance = useMemo(() => {
    if (actionType.value === ACTION_TYPE.DEPOSIT) {
      return depositBalance;
    }
    return currentRecord.user_stake?.amount || "0";
  }, [actionType, depositBalance, currentRecord.user_stake]);

  const handleBalance = () => {
    handleAmountChange(balance);
  };

  return (
    <div
      className={clsx(
        "text-black font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      <div className="">{actionType.title}</div>
      <div className="mt-[30px] flex justify-between items-start gap-[10px]">
        <div
          className={clsx(
            "flex items-center w-0 flex-1",
            currentRecord.tokens?.length < 2 && "gap-[10px]"
          )}
        >
          <div className="flex items-center shrink-0">
            {currentRecord.tokens.map((token: any, idx: number) => (
              <LazyImage
                src={token.icon || "/assets/tokens/default_icon.png"}
                width={50}
                height={50}
                key={idx}
                containerClassName={clsx(
                  "shrink-0 rounded-full overflow-hidden",
                  idx !== 0 && "translate-x-[-20px]"
                )}
                fallbackSrc="/assets/tokens/default_icon.png"
              />
            ))}
          </div>
          <div className="flex-1 w-0 overflow-hidden">
            <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {currentRecord.tokens.map((tk: any) => tk.symbol).join("-")}
            </div>
            <div className="mt-[8px] flex items-center gap-[4px]">
              <LazyImage
                src={
                  currentRecord.protocolIcon ||
                  "/assets/tokens/default_icon.png"
                }
                width={16}
                height={16}
                containerClassName="shrink-0"
                fallbackSrc="/assets/tokens/default_icon.png"
              />
              <div className="text-[14px] font-medium leading-[100%]">
                {currentRecord.pool_project}
              </div>
            </div>
          </div>
        </div>
        {["Bex", "Kodiak"].includes(currentRecord.lpProtocol) &&
          actionType.value === ACTION_TYPE.DEPOSIT && (
            <button
              type="button"
              className="px-[15px] shrink-0 disabled:!cursor-not-allowed disabled:opacity-30 h-[26px] rounded-[6px] border border-[#373A53] bg-[#FFF] text-[#000] text-center font-Montserrat text-[14px] font-medium leading-normal"
              onClick={() => {
                toggleOpenAddLp(true);
              }}
            >
              Mint LP
            </button>
          )}
      </div>
      <ActionInput
        className="mt-[20px]"
        inputError={inputError}
        value={amount}
        onChange={handleAmountChange}
        record={currentRecord}
        actionType={actionType}
        balanceLoading={balanceLoading}
        balance={balance}
      />
      {currentRecord.protocol === "Kodiak" &&
        actionType.value === ACTION_TYPE.DEPOSIT && (
          <ActionRangeDays
            className="mt-[16px]"
            dappParams={dappParams}
            setDappParams={setDappParams}
          />
        )}
      {["Bex", "Kodiak"].includes(currentRecord.lpProtocol) &&
        actionType.value === ACTION_TYPE.DEPOSIT &&
        inputErrorMessage === "Insufficient Balance" && (
          <ActionMintLP
            className="mt-[15px]"
            toggleOpenAddLp={toggleOpenAddLp}
          />
        )}
      <div className="mt-[20px] flex justify-center">
        <ButtonWithApprove
          spender={
            actionType.value === ACTION_TYPE.DEPOSIT
              ? currentRecord.vaultAddress
              : ""
          }
          token={currentRecord.token}
          amount={amount}
          loading={loading}
          errorTips={inputErrorMessage}
          disabled={inputError || loading}
          onClick={onAction}
          buttonProps={{
            className: "w-full h-[50px] font-bold",
            type: "primary"
          }}
        >
          {actionType.button}
        </ButtonWithApprove>
      </div>

      {["Bex", "Kodiak"].includes(currentRecord.lpProtocol) && (
        <AddLiquidityModal
          dex={currentRecord.lpProtocol}
          data={currentRecord}
          open={openAddLp}
          onClose={() => {
            toggleOpenAddLp(false);
          }}
          onSuccess={updateBalance}
        />
      )}
    </div>
  );
};

export default Action;
