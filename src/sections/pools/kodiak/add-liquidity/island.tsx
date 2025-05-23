"use client";

import { useState, useMemo, useRef } from 'react';
import Big from "big.js";
import Input from "@/sections/pools/components/deposit-amounts/input";
import Button from "../../components/button/increase-button";
import Loading from "@/components/loading";
import SwapModal from "@/sections/swap/SwapModal";
import { balanceFormated } from "@/utils/balance";
import { useDebounceFn } from "ahooks";
import useDeposit from "../island/hooks/use-deposit";
import useDepositAmount from "../island/hooks/use-deposit-amount";
import kodiak from "@/configs/pools/kodiak";
import { usePriceStore } from "@/stores/usePriceStore";
import { sortTokens } from "../../utils";

export default function AddLiquidity({
  onSuccess,
  // id,
  defaultToken0,
  defaultToken1,
  ...rest
}: any) {
  const input0Ref = useRef<any>();
  const input1Ref = useRef<any>();

  const [amount0, setAmount0] = useState<any>("");
  const [amount1, setAmount1] = useState<any>("");
  const [balance0, setBalance0] = useState("");
  const [balance1, setBalance1] = useState("");
  const [receives, setReceives] = useState<any>();
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const prices = usePriceStore((state: any) => state.price);

  const [token0, token1] = useMemo(() => {
    return sortTokens(defaultToken0, defaultToken1);
  }, [defaultToken0, defaultToken1]);

  const { querying, queryAmounts } = useDepositAmount({
    id: rest?.id,
    islandContract: rest?.id || rest?.stakingToken?.address,
    token0,
    token1
  });
  const { loading, onDeposit } = useDeposit({
    data: {
      router: kodiak.stakingRouter,
      token0,
      token1,
      id: rest?.id || rest?.stakingToken?.address
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
    if (Big(balance0 || 0).lt(amount0) || Big(balance1 || 0).lt(amount1)) {
      return "Insufficient Balance";
    }
    return "";
  }, [amount0, amount1, balance0, balance1]);

  return (
    <>
      <Input
        ref={input0Ref}
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
        prices={prices}
      />
      <Input
        ref={input1Ref}
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
        prices={prices}
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
          onSuccess={() => {
            setSelectedToken(null);
            input0Ref.current?.updateBalance();
            input1Ref.current?.updateBalance();
          }}
          from="marketplace"
        />
      )}
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
                    Big(receives.miniReceived).mul(rest.price).toString(),
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
