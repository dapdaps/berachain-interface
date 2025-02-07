"use client";

import { useState, useRef } from "react";
import DepositAmounts from "../../components/deposit-amounts/v2";
import Result from "../../bex/result";
import Button from "../../components/button/increase-button";
import TokenSelector from "@/sections/swap/TokenSelector";
import useData from "../../hooks/use-data-v2";
import usdAdd from "../../hooks/use-add-v2";
import kodiak from "@/configs/pools/kodiak";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function AddLiquidity({
  tokenSelectable,
  onSuccess,
  defaultToken0,
  defaultToken1
}: any) {
  const [errorTips, setErrorTips] = useState("");
  const [showSelectTokens, setShowSelectTokens] = useState(false);
  const [selectedToken, setSelectedToken] = useState<any>({});
  const inputType = useRef<0 | 1>(0);
  const {
    token0,
    token1,
    value0,
    value1,
    info,
    onSelectToken,
    setValue0,
    setValue1
  } = useData({
    defaultToken0,
    defaultToken1,
    dex: kodiak
  });

  const { loading: increasing, onIncrease } = usdAdd({
    token0,
    token1,
    value0,
    value1,
    dex: kodiak,
    onSuccess: () => {
      onSuccess?.();
    }
  });
  return (
    <>
      <DepositAmounts
        label="Deposit Amounts"
        token0={token0}
        token1={token1}
        value0={value0}
        value1={value1}
        setValue0={setValue0}
        setValue1={setValue1}
        reserve0={info?.reserve0 || 0}
        reserve1={info?.reserve1 || 0}
        onError={(tips: string) => {
          setErrorTips(tips);
        }}
        onSelectToken={(type: 0 | 1) => {
          inputType.current = type;
          setShowSelectTokens(true);
        }}
      />
      <Result
        price={value0 ? value1 / value0 : ""}
        token0={token0}
        token1={token1}
      />
      <Button
        text="Add Liquidity"
        errorTips={errorTips}
        loading={increasing}
        onClick={onIncrease}
        value0={value0}
        value1={value1}
        token0={token0}
        token1={token1}
        spender={kodiak.contracts[DEFAULT_CHAIN_ID].RouterV2}
      />
      {tokenSelectable && (
        <TokenSelector
          display={showSelectTokens}
          selectedTokenAddress={selectedToken}
          onClose={() => {
            setShowSelectTokens(false);
          }}
          onSelectToken={(token: any) => {
            setSelectedToken(token);
            onSelectToken(token, inputType.current);
            setShowSelectTokens(false);
          }}
        />
      )}
    </>
  );
}
