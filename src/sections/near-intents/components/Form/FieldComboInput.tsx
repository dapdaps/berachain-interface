import { Skeleton } from "@radix-ui/themes";
import clsx from "clsx";
import { useRef } from "react";
import type {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { formatUnits } from "viem";
import useMergedRef from "../../hooks/useMergedRef";
import type { BaseTokenInfo, UnifiedTokenInfo } from "../../types/base";
import {
  BlockMultiBalances,
  type BlockMultiBalancesProps,
} from "../Block/BlockMultiBalances";
import { SelectAssets } from "../SelectAssets";
import IconDeposit from "@public/images/near-intents/icons/deposit-icon.svg";
import { ModalType } from "../../stores/modalStore";
import { useModalStore } from "../../providers/ModalStoreProvider";
import useIsMobile from "@/hooks/use-isMobile";
import useToast from "@/hooks/use-toast";

interface Props<T extends FieldValues>
  extends Omit<BlockMultiBalancesProps, "decimals" | "balance"> {
  fieldName: Path<T>;
  register?: UseFormRegister<T>;
  required?: boolean;
  min?: RegisterOptions["min"];
  max?: RegisterOptions["max"];
  placeholder?: string;
  balance?: bigint;
  selected?: BaseTokenInfo | UnifiedTokenInfo;
  handleSelect?: () => void;
  className?: string;
  errors?: FieldErrors;
  usdAmount?: string | null;
  disabled?: boolean;
  isLoading?: boolean;
  usedType?: "swap" | "withdraw" | "deposit";
}

export const FieldComboInputRegistryName = "FieldComboInput";

export const FieldComboInput = <T extends FieldValues>({
  fieldName,
  register,
  required,
  min,
  max,
  placeholder = "0",
  balance,
  selected,
  handleSelect,
  className,
  errors,
  usdAmount,
  disabled,
  isLoading,
  usedType = "swap",
}: Props<T>) => {
  if (!register) {
    return null;
  }

  const isMobile = useIsMobile();
  const toast = useToast();

  const { setModalType } = useModalStore(
    (state) => state
  )
  const inputRef = useRef<HTMLInputElement>(null);

  const setInputValue = (
    value: string | ((previousValue: string) => string)
  ) => {
    if (inputRef.current) {
      const lastValue = inputRef.current.value;

      inputRef.current.value =
        typeof value === "function" ? value(lastValue) : value;

      // @ts-expect-error React hack for emitting change event
      const tracker = inputRef.current._valueTracker;
      if (tracker) {
        tracker.setValue(lastValue);
      }

      const event = new Event("change", { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const handleSetMaxValue = () => {
    if (!disabled && balance != null && selected && inputRef.current) {
      setInputValue(formatUnits(balance, selected.decimals));
    }
  };

  // react-hook-form specific props
  console.log('=====fieldName', fieldName)
  const reactHookFormRegisterProps = register(fieldName, {
    min,
    max,
    pattern: {
      value: /^[0-9]*[,.]?[0-9]*$/,
      message: "Please enter a valid number",
    },
    required: required ? "This field is required" : false,
  });

  const allInputRefs = useMergedRef(inputRef, reactHookFormRegisterProps.ref);
  const fieldError = errors?.[fieldName];
  
  const handleInputValidation = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      e.currentTarget.value = value.replace(/[^\d.]/g, '').replace(/(\..*?)\..*/g, '$1');
    }
  };
  
  return (
    <div
      className={clsx(
        "relative flex flex-col px-5 pt-5 pb-6 w-full bg-white",
        className
      )}
    >
      <div className="w-full flex justify-between items-center gap-2 h-15">
        {selected && (
          <SelectAssets selected={selected} handleSelect={handleSelect} />
        )}
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[,.]?[0-9]*"
          {...reactHookFormRegisterProps}
          ref={allInputRefs}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onInput={handleInputValidation}
          className={clsx(
            "w-full text-3xl font-medium placeholder-black border-transparent focus:border-transparent focus:ring-0 px-0 text-right",
            disabled &&
            "text-black-200 pointer-events-none placeholder-black-200",
            {
              hidden: isLoading,
            }
          )}
        />
        {isLoading && <Skeleton className="w-full" height="40px" />}
      </div>

      <div className="flex justify-between mt-[10px] items-center min-h-5 w-full max-w-[calc(100vw-106px)]">
        <div className="flex items-center gap-2">
          <BlockMultiBalances
            balance={balance ?? BigInt(0)}
            decimals={selected?.decimals ?? 0}
            handleClick={handleSetMaxValue}
            disabled={disabled}
          />
          {fieldName === "amountIn" && usedType === "swap" && (
            <div className="flex items-center gap-1 rounded-[6px] p-[5px] bg-[#FFDC50] border border-black cursor-pointer hover:opacity-60" onClick={() => {
              if (isMobile) {
                toast.info({
                  title: "Please visit the desktop version for a better experience."
                })
                return
              }
              setModalType(ModalType.MODAL_REVIEW_DEPOSIT, {
                fieldName,
                selected,
                modalType: ModalType.MODAL_REVIEW_DEPOSIT,
              })
            }}>
              <IconDeposit />
              <span className="text-[10px] font-Montserrat font-[500]">
                Deposit
              </span>
            </div>
          )}
        </div>
        {usdAmount ? (
          <span className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap overflow-hidden">
            {usdAmount}
          </span>
        ) : null}

        {/* {fieldError ? (
          <span className="text-xs sm:text-sm font-medium text-red-400  whitespace-nowrap overflow-hidden">
            {(fieldError as FieldError).message}
          </span>
        ) : usdAmount ? (
          <span className="text-xs sm:text-sm font-medium text-gray-400 whitespace-nowrap overflow-hidden">
            {usdAmount}
          </span>
        ) : null}
        {balance != null && (
          <BlockMultiBalances
            balance={balance ?? BigInt(0)}
            decimals={selected?.decimals ?? 0}
            handleClick={handleSetMaxValue}
            disabled={disabled}
            className="ml-auto"
          />
        )} */}
      </div>
    </div>
  );
};

FieldComboInput.displayName = FieldComboInputRegistryName;
