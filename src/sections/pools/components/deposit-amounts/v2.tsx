import Big from "big.js";
import { memo, useEffect, useState } from "react";
import { usePriceStore } from "@/stores//usePriceStore";
import { getAnotherAmountOutV2 } from "../../helpers";
import Input from "./input";
import SwapModal from "@/sections/swap/SwapModal";
import { StyledContainer, StyledSubtitle } from "./styles";
import { sortTokens } from "../../utils";

const DepositAmounts = ({
  label,
  token0,
  token1,
  value0,
  value1,
  setValue0,
  setValue1,
  reserve0,
  reserve1,
  onError,
  onSelectToken
}: any) => {
  const prices = usePriceStore((store) => store.price);
  const [balance0, setBalance0] = useState("");
  const [balance1, setBalance1] = useState("");
  const [selectedToken, setSelectedToken] = useState<any>(null);

  const handleValue = (value: any, type: 0 | 1) => {
    if (type === 0) {
      setValue0(value);
    } else {
      setValue1(value);
    }

    if (!reserve0 || !reserve1) return;

    if (type === 0) {
      setValue1("");
    } else {
      setValue0("");
    }
    const [_token0, _token1] = sortTokens(token0, token1);
    const isReversed =
      token0.address !== _token0.address && token1.address !== _token1.address;

    const isToken0 = (type === 0 && !isReversed) || (type === 1 && isReversed);

    const amountOut = new Big(value || 0).gt(0)
      ? getAnotherAmountOutV2({
          reserve0,
          reserve1,
          amount: value,
          isToken0
        })
      : "";

    if (type === 0) {
      const _amountOut = !amountOut
        ? ""
        : new Big(amountOut).toFixed(token1.decimals).replace(/\.?0+$/, "");
      setValue1(_amountOut);
    } else {
      const _amountOut = !amountOut
        ? ""
        : new Big(amountOut).toFixed(token0.decimals).replace(/\.?0+$/, "");
      setValue0(_amountOut);
    }
  };

  useEffect(() => {
    if (!reserve0 || !reserve1) {
      setValue0("");
      setValue1("");
      return;
    }
    if (value0) {
      handleValue(value0, 0);
    }
  }, [reserve0, reserve1]);

  useEffect(() => {
    if (!value0 || !value1) {
      onError("Enter Amount");
      return;
    }
    if (
      new Big(balance0 || 0).lt(value0 || 0) ||
      new Big(balance1 || 0).lt(value1 || 0)
    ) {
      onError("Insufficient Balance");
      return;
    }
    onError("");
  }, [value0, value1, balance0, balance1]);

  return (
    <StyledContainer>
      <StyledSubtitle>{label}</StyledSubtitle>
      <Input
        token={token0}
        value={value0}
        setValue={(val: any) => {
          handleValue(val, 0);
        }}
        prices={prices}
        disabled={!token0 || !token1}
        onLoad={(balance: string) => {
          setBalance0(balance);
        }}
        onSelectToken={() => {
          onSelectToken?.(0);
        }}
      />

      <Input
        token={token1}
        value={value1}
        setValue={(val: any) => {
          handleValue(val, 1);
        }}
        prices={prices}
        disabled={!token0 || !token1}
        onLoad={(balance: string) => {
          setBalance1(balance);
        }}
        onSelectToken={() => {
          onSelectToken?.(1);
        }}
      />
      <div className="text-[14px] text-black font-bold mt-[10px] flex justify-end gap-[4px]">
        Get{" "}
        {[token0, token1].map((token: any, idx: number) => (
          <span
            className="cursor-pointer underline"
            onClick={() => {
              setSelectedToken(token);
            }}
          >
            {token.symbol}
            {idx !== 1 && ","}
          </span>
        ))}
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
