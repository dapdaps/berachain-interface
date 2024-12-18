import Big from "big.js";
import { memo, useEffect, useMemo } from "react";
import Image from "next/image";
import Loading from "@/components/circle-loading";
import useTokenBalance from "@/hooks/use-token-balance";
import { balanceFormated, valueFormated } from "@/utils/balance";

import {
  StyledBalance,
  StyledDesc,
  StyledEmptyToken,
  StyledIcon,
  StyledInput,
  StyledInputInner,
  StyledInputTokenBox,
  StyledSymbol,
  StyledToken
} from "./styles";

const Input = ({
  value,
  token,
  setValue,
  prices,
  disabled,
  balance,
  isLoading,
  className,
  onError
}: any) => {
  const isError = useMemo(() => {
    if (!value || !token || value === "NaN") return false;

    if (!balance) return false;

    return new Big(value || 0).gt(balance);
  }, [value, balance]);

  useEffect(() => {
    onError(isError);
  }, [isError]);

  return (
    <StyledInput $error={isError} className={className}>
      <StyledInputTokenBox>
        <div className="grow">
          <StyledInputInner
            placeholder="0"
            value={value}
            onChange={(ev) => {
              if (isNaN(Number(ev.target.value))) return;
              setValue(ev.target.value);
            }}
            disabled={disabled}
          />
        </div>
        <StyledToken className="shrink-0">
          <StyledIcon src={token?.icon || "/assets/tokens/default_icon.png"} />
          <StyledSymbol>{token.symbol}</StyledSymbol>
        </StyledToken>
      </StyledInputTokenBox>
      <StyledDesc>
        <div>
          $
          {!isNaN(Number(value)) && prices
            ? valueFormated(value, prices[token?.priceKey || token?.symbol])
            : "-"}
        </div>
        <div className="flex items-center gap-[4px]">
          <div>Balance: </div>
          {isLoading ? (
            <Loading size={16} />
          ) : (
            <StyledBalance
              onClick={() => {
                if (isNaN(Number(balance))) return;
                setValue(balanceFormated(new Big(balance).toFixed(18), 18));
              }}
              className="cursor-pointer"
            >
              {!balance ? "-" : balanceFormated(balance, 4)}
            </StyledBalance>
          )}
        </div>
      </StyledDesc>
    </StyledInput>
  );
};

export default memo(Input);
