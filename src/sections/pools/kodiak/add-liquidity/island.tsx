"use client";

import { useState, useMemo } from "react";
import Big from "big.js";
import Input from "@/sections/pools/components/deposit-amounts/input";
import Button from "../../components/button/increase-button";
import Loading from "@/components/loading";
import { balanceFormated } from "@/utils/balance";
import { useDebounceFn } from "ahooks";
import useDeposit from "../island/hooks/use-deposit";
import useDepositAmount from "../island/hooks/use-deposit-amount";
import kodiak from "@/configs/pools/kodiak";

export default function AddLiquidity({
  onSuccess,
  // id,
  defaultToken0: token0,
  defaultToken1: token1,
  ...rest
}: any) {
  const [amount0, setAmount0] = useState<any>("");
  const [amount1, setAmount1] = useState<any>("");
  const [balance0, setBalance0] = useState("");
  const [balance1, setBalance1] = useState("");
  const [receives, setReceives] = useState<any>();
  const { querying, queryAmounts } = useDepositAmount({
    islandContract: rest?.id,
    token0,
    token1
  });
  const { loading, onDeposit } = useDeposit({
    data: {
      router: kodiak.stakingRouter,
      token0,
      token1,
      id: rest?.id
    },
    amount0,
    amount1,
    received: receives?.received,
    onSuccess: () => {
      onSuccess?.();
    }
  });

  const { run: runQuoter } = useDebounceFn(
    () => {
      queryAmounts({
        amount0,
        amount1,
        cb(amounts: any) {
          setAmount0(amounts.amount0);
          setAmount1(amounts.amount1);
          setReceives({
            received: amounts.received,
            miniReceived: amounts.miniReceived
          });
        }
      });
    },
    {
      wait: 500
    }
  );

  const errorTips = useMemo(() => {
    if (!amount0 || !amount1) return "Enter an amount";
    if (Big(balance0 || 0).lt(amount0) || Big(balance1 || 0).lt(amount1))
      return "Insufficient Balance";
    return "";
  }, [amount0, amount1, balance0, balance1]);

  return (
    <>
      <Input
        value={amount0}
        readOnly
        token={token0}
        className="mt-[16px]"
        setValue={(val: any) => {
          setAmount0(val);
          setAmount1("");
          runQuoter();
        }}
        onLoad={setBalance0}
      />
      <Input
        value={amount1}
        readOnly
        token={token1}
        className="mt-[16px]"
        setValue={(val: any) => {
          setAmount1(val);
          setAmount0("");
          runQuoter();
        }}
        onLoad={setBalance1}
      />
      <div className="rounded-[12px] border-[#373A53] border p-[14px] mt-[10px] text-[14px] text-[#3D405A] font-medium">
        <div className="flex justify-between items-start">
          <div>Estimated Received</div>
          {querying ? (
            <Loading />
          ) : (
            <div className="text-right">
              <div>
                {receives?.received
                  ? balanceFormated(receives.received, 5)
                  : "-"}{" "}
                {rest?.symbol}
              </div>
              <div>
                (${" "}
                {receives?.received && rest?.price
                  ? balanceFormated(
                      Big(receives.received).mul(rest?.price).toString(),
                      5
                    )
                  : "-"}{" "}
                )
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-start mt-[12px]">
          <div>Minimum Received</div>
          {querying ? (
            <Loading />
          ) : (
            <div className="text-right">
              <div>
                {receives?.miniReceived
                  ? balanceFormated(receives.miniReceived, 5)
                  : "-"}{" "}
                {rest?.symbol}
              </div>
              {receives?.miniReceived && rest?.price && (
                <div>
                  (${" "}
                  {balanceFormated(
                    Big(receives.miniReceived)
                      .mul(rest.price)
                      .toString(),
                    5
                  )}
                  )
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Button
        text="Add Liquidity"
        errorTips={errorTips}
        loading={querying || loading}
        onClick={onDeposit}
        value0={amount0}
        value1={amount1}
        token0={token0}
        token1={token1}
        spender={kodiak.stakingRouter}
      />
    </>
  );
}
