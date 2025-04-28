import Big from "big.js";
import React, { memo, useEffect, useImperativeHandle, useMemo } from 'react';
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
import LazyImage from '@/components/layz-image';

const Input = ({
  value,
  token,
  setValue,
  prices,
  disabled,
  onLoad,
  onSelectToken,
  className
}: any, ref: any) => {
  const { tokenBalance: balance, isLoading, update: updateBalance } = useTokenBalance(
    token?.isNative ? "native" : token?.address,
    token?.decimals
  );

  const isError = useMemo(() => {
    if (!value || !token || value === "NaN") return false;

    if (!balance) return false;

    return new Big(value || 0).gt(balance);
  }, [value, balance]);

  const refs = {
    updateBalance,
  };
  useImperativeHandle(ref, () => refs);

  useEffect(() => {
    onLoad?.(balance);
  }, [balance]);

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
        {token ? (
          token.icons ? (
            <div className="flex items-center relative shrink-0">
              {token.icons.map((icon: string, idx: number) => (
                <img
                  className={`${idx === 0 && "mr-[-8px]"} rounded-full`}
                  src={icon || "/assets/tokens/default_icon.png"}
                  width={30}
                  height={30}
                  alt="Token"
                  key={idx}
                />
              ))}
            </div>
          ) : (
            <StyledToken className="shrink-0">
              <LazyImage
                src={token?.icon}
                fallbackSrc="/assets/tokens/default_icon.png"
                containerClassName="!w-[26px] !h-[26px] !shrink-0 !rounded-full !overflow-hidden"
                className="!w-[26px] !h-[26px]"
              />
              <StyledSymbol>{token.symbol}</StyledSymbol>
            </StyledToken>
          )
        ) : (
          <StyledEmptyToken onClick={onSelectToken}>
            Select token
          </StyledEmptyToken>
        )}
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

export default memo(React.forwardRef(Input));
