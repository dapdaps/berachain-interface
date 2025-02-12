import { asyncFetch } from "@/utils/http";
import { useState } from "react";

export default function useQuoteSingleAmount(data: any, query: Function) {
  const [loading, setLoading] = useState(false);

  const queryAmounts = async (amount: string, index: number, cb: Function) => {
    if (!amount || isNaN(Number(amount))) return;
    try {
      setLoading(true);
      const [tokenIn, tokenOut] =
        index === 0 ? [data.token0, data.token1] : [data.token1, data.token0];
      const tokenInAddress = tokenIn.isNative
        ? "0x6969696969696969696969696969696969696969"
        : tokenIn.address;
      const tokenOutAddress = tokenIn.isNative
        ? "0x6969696969696969696969696969696969696969"
        : tokenOut.address;
      const quoteAmount = (Number(amount) / 2) * 10 ** tokenIn.decimals;
      const response = await asyncFetch(
        `https://ebey72gfe6.execute-api.us-east-1.amazonaws.com/prod/quote?protocols=v2%2Cv3%2Cmixed&tokenInAddress=${tokenInAddress}&tokenInChainId=80094&tokenOutAddress=${tokenOutAddress}&tokenOutChainId=80094&amount=${quoteAmount}&type=exactOut`
      );

      query({
        amount0: index === 0 ? Number(amount) / 2 : response.quoteDecimals,
        amount1: index === 1 ? Number(amount) / 2 : response.quoteDecimals,
        cb
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { loading, queryAmounts };
}
