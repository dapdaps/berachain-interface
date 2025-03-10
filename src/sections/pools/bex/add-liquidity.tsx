"use client";

import { useRef, useState } from "react";
import DepositAmounts from "../components/deposit-amounts/balancer";
import Button from "./button";
import usdAdd from "./use-add";
import Big from "big.js";
import usePoolInfo from "./use-pool-info";

export default function AddLiquidity({ onSuccess, data }: any) {
  const [errorTips, setErrorTips] = useState("");
  const [values, setValues] = useState<any>(null);

  const [tokens, setTokens] = useState<any>(Object.values(data?.tokens ?? []));
  const { info } = usePoolInfo(data?.id);
  const [isProportional, setIsProportional] = useState(false);
  const inputTokenRef = useRef<any>(null);

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

  const onValueChange = (
    token: any,
    value: string,
    _isProportional: boolean
  ) => {
    if (Big(value || 0).eq(0)) {
      if (!values) return;
      delete values[token.address];
      setValues({ ...values });
      return;
    }
    inputTokenRef.current = {
      token,
      value
    };
    let temp = values || {};
    if (_isProportional && info) {
      let currentBalance = "0";
      info.tokens.some((asset: any) => {
        if (asset.address.toLowerCase() === token.address.toLowerCase()) {
          currentBalance = asset.balance;
          return true;
        }
        return false;
      });

      if (Big(currentBalance).gt(0)) {
        info.tokens.forEach((asset: any) => {
          if (asset.address.toLowerCase() === token.address.toLowerCase())
            return;
          temp[asset.address] = Big(asset.balance)
            .div(currentBalance)
            .mul(value)
            .toString();
        });
      }
    }

    setValues({ ...temp, [token.address]: value });
  };

  return (
    <>
      <DepositAmounts
        label="Deposit Amounts"
        tokens={tokens}
        values={values}
        onValueChange={(token: any, value: any) => {
          onValueChange(token, value, isProportional);
        }}
        onError={(tips: string) => {
          setErrorTips(tips);
        }}
        onUpdateTokens={setTokens}
        isProportional={isProportional}
        onChangeProportional={() => {
          setIsProportional(!isProportional);
          if (!inputTokenRef.current) return;
          if (!isProportional) {
            onValueChange(
              inputTokenRef.current.token,
              inputTokenRef.current.value,
              true
            );
            return;
          }
          Object.keys(values).forEach((key) => {
            if (key !== inputTokenRef.current.token.address) {
              delete values[key];
            }
          });

          setValues({ ...values });
        }}
        info={info}
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
