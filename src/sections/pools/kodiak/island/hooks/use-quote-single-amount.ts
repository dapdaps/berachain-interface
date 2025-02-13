import useCustomAccount from "@/hooks/use-account";
import { asyncFetch } from "@/utils/http";
import { useSettingsStore } from "@/stores/settings";
import { useState } from "react";

export default function useQuoteSingleAmount(data: any, query: Function) {
  const [loading, setLoading] = useState(false);
  const [swapData, setSwapData] = useState("");
  const { account } = useCustomAccount();
  const slippage = useSettingsStore((store: any) => store.slippage);

  const queryAmounts = async (amount: string, index: number, cb: Function) => {
    if (!amount || isNaN(Number(amount)) || Number(amount) === 0) return;
    try {
      setLoading(true);
      const [tokenIn, tokenOut] =
        index === 0 ? [data.token0, data.token1] : [data.token1, data.token0];
      const tokenInAddress = tokenIn.isNative
        ? "0x6969696969696969696969696969696969696969"
        : tokenIn.address;
      const tokenOutAddress = tokenOut.isNative
        ? "0x6969696969696969696969696969696969696969"
        : tokenOut.address;
      const quoteAmount = (Number(amount) / 2) * 10 ** tokenIn.decimals;
      const response = await asyncFetch(
        `https://ebey72gfe6.execute-api.us-east-1.amazonaws.com/prod/quote?protocols=v2%2Cv3%2Cmixed&tokenInAddress=${tokenInAddress}&tokenInChainId=80094&tokenOutAddress=${tokenOutAddress}&tokenOutChainId=80094&amount=${quoteAmount}&type=exactIn&slippageTolerance=${slippage}&deadline=1000&recipient=0x679a7C63FC83b6A4D9C1F931891d705483d4791F`
      );

      query({
        amount0: index === 0 ? Number(amount) / 2 : response.quoteDecimals,
        amount1: index === 1 ? Number(amount) / 2 : response.quoteDecimals,
        cb
      });
      setSwapData(response.methodParameters.calldata);
    } catch (err) {
      setSwapData("");
      query({
        amount0: 0,
        amount1: 0,
        cb
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, swapData, queryAmounts };
}
