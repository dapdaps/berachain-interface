import { memo, useEffect, useMemo, useState } from "react";
import { usePriceStore } from "@/stores/usePriceStore";
import Input from "./balancer-input";
import { StyledContainer, StyledSubtitle } from "./styles";
import { cloneDeep } from "lodash";
import CheckBox from "@/components/check-box";

const DepositAmounts = ({
  label,
  tokens,
  values,
  info,
  onValueChange,
  onError,
  onUpdateTokens,
  hasProportional = true,
  isProportional,
  onChangeProportional
}: any) => {
  const prices = usePriceStore((store) => store.price);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!values) {
      onError("Enter Amount");
      return;
    }
    if (Object.values(values).length === 0) {
      onError("Enter Amount");
      return;
    }
    if (isError) {
      onError("Insufficient Balance");
      return;
    }
    onError("");
    return;
  }, [values, isError]);

  return (
    <StyledContainer>
      <StyledSubtitle>{label}</StyledSubtitle>
      {tokens.map((token: any, i: number) => (
        <Input
          key={token.address}
          token={token}
          value={values?.[token.address] || ""}
          setValue={(val: any) => {
            onValueChange(token, val);
          }}
          prices={prices}
          onError={(error: boolean) => {
            setIsError(error);
          }}
          onSelectToken={(_token: any) => {
            tokens.splice(i, 1, _token);
            onUpdateTokens(cloneDeep(tokens));
          }}
        />
      ))}
      {hasProportional && (
        <div className="flex items-center gap-[4px] mt-[10px]">
          <CheckBox
            checked={isProportional}
            disabled={!info}
            onClick={onChangeProportional}
          />
          <div className="text-[rgb(151,154,190)] text-[14px]">
            Keep Amounts Proportional
          </div>
        </div>
      )}
    </StyledContainer>
  );
};

export default memo(DepositAmounts);
