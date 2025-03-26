import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import InputNumber from "@/components/input-number";
import ButtonWithApprove from "@/components/button/button-with-approve";
import { numberFormatter } from "@/utils/number-formatter";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import useAction from "../../hooks/use-action";
import { useState } from "react";
import AddLiquidityModal from "@/sections/pools/add-liquidity-modal";
import Big from "big.js";
import Loading from "@/components/loading";
import Range from "@/components/range";
import { ACTION_TYPE } from "../../config";

const Action = (props: any) => {
  const { className } = props;
  const [openAddLp, setOpenAddLp] = useState(false);
  const { actionType, currentRecord } = useVaultsV2Context();
  const {
    loading,
    onAction,
    amount,
    handleAmountChange,
    inputError,
    inputErrorMessage,
    balance,
    updateBalance,
    balanceLoading,
    dappParams,
    setDappParams
  } = useAction();

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
                {currentRecord.protocol}
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
                setOpenAddLp(true);
              }}
            >
              Get
            </button>
          )}
      </div>
      <div
        className={clsx(
          "mt-[20px] h-[90px] rounded-[12px] border flex flex-col items-stretch gap-[15px] pl-[13px] pr-[14px] pt-[20px] pb-[13px]",
          inputError
            ? "border-[#CE4314] bg-[#FFEFEF]"
            : "border-[#373A53] bg-[#FFF]"
        )}
      >
        <div className="flex justify-between items-center gap-[10px] w-full">
          <InputNumber
            value={amount}
            onNumberChange={handleAmountChange}
            placeholder="0"
            className={clsx(
              "flex-1 h-[26px] text-[20px] font-Montserrat !bg-[unset]",
              inputError ? "text-[#FF3F3F]" : "text-black"
            )}
          />
          <div
            className={clsx(
              "flex items-center justify-end shrink-0",
              currentRecord.tokens.length > 1 && "translate-x-[10px]"
            )}
          >
            {currentRecord.tokens.map((token: any, idx: number) => (
              <LazyImage
                src={token.icon || "/assets/tokens/default_icon.png"}
                width={26}
                height={26}
                key={idx}
                containerClassName={clsx(
                  "shrink-0 rounded-full overflow-hidden",
                  idx !== 0 && "translate-x-[-10px]"
                )}
                fallbackSrc="/assets/tokens/default_icon.png"
              />
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center gap-[10px] w-full text-[#3D405A] font-Montserrat text-[14px] font-normal leading-normal">
          <div className=""></div>
          <div className="flex items-center gap-[2px]">
            <div>balance:</div>
            {balanceLoading ? (
              <Loading size={14} />
            ) : (
              <button
                type="button"
                disabled={Big(balance || 0).lte(0) || balanceLoading}
                className="underline underline-offset-2 cursor-pointer disabled:opacity-30 disabled:!cursor-not-allowed"
                onClick={handleBalance}
              >
                {numberFormatter(balance, 2, true)}
              </button>
            )}
          </div>
        </div>
      </div>
      {currentRecord.protocol === "Kodiak" &&
        actionType.value === ACTION_TYPE.DEPOSIT && (
          <>
            <div className="flex items-center justify-between mt-[16px]">
              <div className="text-[14px] font-medium	text-[#3D405A]">
                Select lock-up period
              </div>
              <div className="font-semibold text-[16px]">
                {dappParams?.days || 0} days
              </div>
            </div>
            <Range
              value={Math.ceil((dappParams?.days || 0 / 30) * 100)}
              onChange={(e: any) => {
                setDappParams({ days: Math.ceil((e.target.value * 30) / 100) });
              }}
            />
          </>
        )}
      {["Bex", "Kodiak"].includes(currentRecord.lpProtocol) &&
        actionType.value === ACTION_TYPE.DEPOSIT &&
        inputErrorMessage === "Insufficient Balance" && (
          <div className="flex justify-center mt-[15px] items-center gap-[4px] text-[#000] text-right font-Montserrat text-[14px] font-semibold leading-normal">
            <button
              type="button"
              className="underline underline-offset-2"
              onClick={() => {
                setOpenAddLp(true);
              }}
            >
              Mint LP tokens
            </button>
            <div>first</div>
          </div>
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
            setOpenAddLp(false);
          }}
          onSuccess={updateBalance}
        />
      )}
    </div>
  );
};

export default Action;
