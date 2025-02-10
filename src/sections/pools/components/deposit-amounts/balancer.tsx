import { memo, useEffect, useMemo, useState } from "react";
import { usePriceStore } from "@/stores/usePriceStore";
import Input from "./simple-input";
import { StyledContainer, StyledSubtitle } from "./styles";

const DepositAmounts = ({
  label,
  tokens,
  values,
  onValueChange,
  onError
}: any) => {
  const prices = usePriceStore((store) => store.price);
  const [isError, setIsError] = useState(false);
  const tokenList = useMemo(() => Object.values(tokens), [tokens]);

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
      {tokenList.map((token: any) => (
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
        />
      ))}
    </StyledContainer>
  );
};

export default memo(DepositAmounts);
