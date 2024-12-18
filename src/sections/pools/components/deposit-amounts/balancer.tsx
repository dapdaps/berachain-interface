import Big from "big.js";
import { memo, useEffect, useState } from "react";
import { usePriceStore } from "@/stores//usePriceStore";
import useTokensBalance from "@/hooks/use-tokens-balance";
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
  const { loading, balances, queryBalance } = useTokensBalance(
    Object.values(tokens)
  );

  useEffect(() => {
    if (!values) {
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
      {Object.values(tokens).map((token: any) => (
        <Input
          token={token}
          value={values[token.address]}
          setValue={(val: any) => {
            onValueChange(token, val);
          }}
          prices={prices}
          isLoading={loading}
          balance={balances[token.address]}
          onError={(error: boolean) => {
            setIsError(error);
          }}
        />
      ))}
    </StyledContainer>
  );
};

export default memo(DepositAmounts);
