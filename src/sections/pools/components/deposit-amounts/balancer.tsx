import { memo, useEffect, useMemo, useState } from "react";
import { usePriceStore } from "@/stores/usePriceStore";
import Input from "./balancer-input";
import { StyledContainer, StyledSubtitle } from "./styles";
import { cloneDeep } from "lodash";

const DepositAmounts = ({
  label,
  tokens,
  values,
  onValueChange,
  onError,
  onUpdateTokens
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
    </StyledContainer>
  );
};

export default memo(DepositAmounts);
