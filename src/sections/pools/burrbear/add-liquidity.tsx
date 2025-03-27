"use client";

import { useMemo, useState } from "react";
import DepositAmounts from "../components/deposit-amounts/balancer";
import Button from "./button";
import usdAdd from "./use-add";
import Big from "big.js";

export default function AddLiquidity({ onSuccess, data }: any) {
  const [errorTips, setErrorTips] = useState("");
  const [values, setValues] = useState<any>(null);
  const tokens = useMemo(() => Object.values(data.tokens), [data]);

  const {
    loading: increasing,
    contracts,
    onIncrease
  } = usdAdd({
    poolIdx: data?.id,
    poolType: data?.poolType,
    tokens,
    values,
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
          if (Big(value || 0).eq(0)) {
            if (!values) return;
            delete values[token.address];
            setValues({ ...values });
          } else {
            setValues({ ...(values || {}), [token.address]: value });
          }
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
