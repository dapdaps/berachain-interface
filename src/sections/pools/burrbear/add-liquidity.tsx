"use client";

import { useMemo, useState } from "react";
import DepositAmounts from "../components/deposit-amounts/balancer";
import Button from "./button";
import usdAdd from "./use-add";

export default function AddLiquidity({ onSuccess, info }: any) {
  const [errorTips, setErrorTips] = useState("");
  const [values, setValues] = useState<any>(null);
  const tokens = useMemo(() => Object.values(info.tokens), [info]);
  const {
    loading: increasing,
    contracts,
    onIncrease
  } = usdAdd({
    poolIdx: info?.poolIdx,
    tokens,
    onSuccess: () => {
      onSuccess?.();
    }
  });

  return (
    <>
      <DepositAmounts
        label="Deposit Amounts"
        tokens={tokens}
        values={values}
        onValueChange={(token: any, value: string) => {
          setValues({ ...(values || {}), [token.address]: value });
        }}
        onError={(tips: string) => {
          setErrorTips(tips);
        }}
      />

      <Button
        text="Add Liquidity"
        errorTips={errorTips}
        loading={increasing}
        onClick={onIncrease}
        tokens={tokens}
        values={values}
        spender={contracts.Vault}
      />
    </>
  );
}
