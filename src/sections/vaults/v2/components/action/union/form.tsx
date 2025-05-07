import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import ActionInput from "@/sections/vaults/v2/components/action/input";
import { useVaultsV2ActionContext } from "@/sections/vaults/v2/components/action/context";
import clsx from "clsx";
import { ACTION_TYPE } from "@/sections/vaults/v2/config";
import ActionRangeDays from "@/sections/vaults/v2/components/action/range-days";
import ButtonWithApprove from "@/components/button/button-with-approve";
import { useMemo } from "react";
import LazyImage from '@/components/layz-image';

const ActionUnionForm = (props: any) => {
  const { ...restProps } = props;

  const {
    actionType,
    currentProtocol,
    setCurrentProtocol,
    isBeraPaw,
  } = useVaultsV2Context();

  let _currentProtocol = currentProtocol;
  if (isBeraPaw) {
    _currentProtocol = currentProtocol.linkVault;
  }

  return (
    <ActionUnionFormWithoutVaultsV2Context
      {...restProps}
      isBeraPaw={isBeraPaw}
      actionType={actionType}
      currentProtocol={_currentProtocol}
      setCurrentProtocol={setCurrentProtocol}
    />
  );
};

export default ActionUnionForm;

const ActionUnionFormWithoutVaultsV2Context = (props: any) => {
  const {
    className,
    actionType,
    currentProtocol,
    setCurrentProtocol,
    isBeraPaw,
  } = props;

  const {
    amount,
    balanceShown,
    balanceLoading,
    inputError,
    handleAmountChange,
    dappParams,
    setDappParams,
    inputErrorMessage,
    loading,
    queuedAmount,
    onAction
  } = useVaultsV2ActionContext();

  const buttonDisabled = useMemo(() => {
    if (inputError) return true;
    if (loading) return true;
    if (
      currentProtocol.protocol === "Smilee" &&
      actionType.value === ACTION_TYPE.WITHDRAW
    )
      return true;

    if (currentProtocol.protocol === "D2 Finance") {
      if (
        actionType.value === ACTION_TYPE.DEPOSIT &&
        (currentProtocol.extra_data.fundingStart > Date.now() ||
          currentProtocol.extra_data.epochStart <= Date.now())
      ) {
        return true;
      }
      if (
        actionType.value === ACTION_TYPE.WITHDRAW &&
        (currentProtocol.extra_data.epochEnd > Date.now() ||
          currentProtocol.extra_data.epochStart <= Date.now()) &&
        currentProtocol.extra_data.custodied
      ) {
        return true;
      }
    }
    return false;
  }, [inputError, loading, currentProtocol.protocol]);

  return (
    <div className={clsx("", className)}>
      {
        (isBeraPaw && actionType.value === ACTION_TYPE.DEPOSIT) && (
          <>
            <div className="flex items-center gap-[10px] text-[18px] font-Montserrat font-bold leading-[90%] text-black">
              <div className="">Step 1. Deposit Vaults</div>
              <LazyImage
                src={currentProtocol.protocolIcon}
                width={24}
                height={24}
                containerClassName="shrink-0 rounded-[4px] border border-[#FFFDEB] overflow-hidden"
                fallbackSrc="/assets/tokens/default_icon.png"
              />
            </div>
            <div className="text-black font-Montserrat text-[12px] font-[500] leading-[100%] mt-[5px]">
              Your assets will be deposited in the {currentProtocol.project} Vaults.
            </div>
          </>
        )
      }
      <ActionInput
        className="mt-[20px]"
        inputError={inputError}
        value={amount}
        onChange={handleAmountChange}
        record={currentProtocol}
        actionType={actionType}
        balanceLoading={balanceLoading}
        balance={balanceShown}
        setCurrentProtocol={setCurrentProtocol}
        queuedAmount={queuedAmount}
      />
      {currentProtocol.protocol === "Kodiak" &&
        actionType.value === ACTION_TYPE.DEPOSIT && (
          <ActionRangeDays
            className="mt-[16px]"
            dappParams={dappParams}
            setDappParams={setDappParams}
          />
        )}
      <div className="mt-[20px] flex justify-center">
        <ButtonWithApprove
          spender={
            // 👇for WeBera
            currentProtocol.extra_data?.vault_router
              ? currentProtocol.extra_data?.vault_router
              : actionType.value === ACTION_TYPE.DEPOSIT
                ? currentProtocol.vaultAddress
                : ""
          }
          token={
            actionType.value === ACTION_TYPE.DEPOSIT
              ? currentProtocol.token
              : // 👇for WeBera
              currentProtocol.extra_data?.vault_router
                ? {
                  address: currentProtocol.vaultAddress,
                  decimals: currentProtocol.token.decimals
                }
                : currentProtocol.token
          }
          amount={amount}
          loading={loading}
          errorTips={inputErrorMessage}
          disabled={buttonDisabled}
          onClick={onAction}
          buttonProps={{
            className: "w-full h-[50px] font-bold",
            type: "primary"
          }}
        >
          {actionType.button}
        </ButtonWithApprove>
      </div>
    </div>
  );
};
