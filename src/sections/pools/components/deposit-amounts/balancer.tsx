import { memo, useEffect, useState } from "react";
import { usePriceStore } from "@/stores/usePriceStore";
import Input from "./balancer-input";
import { StyledContainer, StyledSubtitle } from "./styles";
import { cloneDeep, remove } from "lodash";
import SwapModal from "@/sections/swap/SwapModal";
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
  const [insufficientTokens, setInsufficientTokens] = useState<any>([]);
  const [selectedToken, setSelectedToken] = useState<any>(null);

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
            if (error) {
              insufficientTokens.push(token);
            } else {
              remove(
                insufficientTokens,
                (t: any) => t.address === token.address
              );
            }
            setInsufficientTokens(cloneDeep(insufficientTokens));
          }}
          onSelectToken={(_token: any) => {
            tokens.splice(i, 1, _token);
            onUpdateTokens(cloneDeep(tokens));
          }}
        />
      ))}
      <div className="flex justify-between items-center mt-[10px]">
        {hasProportional ? (
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
        ) : (
          <div />
        )}
        {insufficientTokens?.length ? (
          <div className="text-[14px] text-black font-bold">
            Get{" "}
            {insufficientTokens.map((token: any, idx: number) => (
              <span
                className="cursor-pointer underline"
                onClick={() => {
                  setSelectedToken(token);
                }}
              >
                {idx > 0 && ", "}
                {token.symbol}
              </span>
            ))}
          </div>
        ) : (
          <div />
        )}
      </div>
      {selectedToken && (
        <SwapModal
          defaultOutputCurrency={selectedToken}
          outputCurrencyReadonly={true}
          show={!!selectedToken}
          onClose={() => {
            setSelectedToken(null);
          }}
          from="marketplace"
        />
      )}
    </StyledContainer>
  );
};

export default memo(DepositAmounts);
