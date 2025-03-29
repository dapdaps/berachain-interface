import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import ActionInput from '@/sections/vaults/v2/components/action/input';
import { useVaultsV2ActionContext } from '@/sections/vaults/v2/components/action/context';
import clsx from 'clsx';
import { ACTION_TYPE } from '@/sections/vaults/v2/config';
import ActionRangeDays from '@/sections/vaults/v2/components/action/range-days';
import ActionMintLP from '@/sections/vaults/v2/components/action/mint-lp';
import ButtonWithApprove from '@/components/button/button-with-approve';

const ActionUnionForm = (props: any) => {
  const { className } = props;

  const { actionType, currentProtocol, toggleOpenAddLp, setCurrentProtocol } = useVaultsV2Context();
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
    onAction,
  } = useVaultsV2ActionContext();

  return (
    <div className={clsx("", className)}>
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
      />
      {currentProtocol.protocol === "Kodiak" &&
        actionType.value === ACTION_TYPE.DEPOSIT && (
          <ActionRangeDays
            className="mt-[16px]"
            dappParams={dappParams}
            setDappParams={setDappParams}
          />
        )}
      {["Bex", "Kodiak"].includes(currentProtocol.lpProtocol) &&
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
              ? currentProtocol.vaultAddress
              : ""
          }
          token={currentProtocol.token}
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
    </div>
  );
};

export default ActionUnionForm;
