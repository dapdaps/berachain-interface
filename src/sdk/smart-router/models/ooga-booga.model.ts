import axios from "axios";
import BigNumber from "bignumber.js";
import { providers } from "ethers";
import chains from "../config/chains";
import type { QuoterProps } from "../types";

export class OogaBooga {
  private getTokenAddress(token: any) {
    return token.isNative
      ? "0x0000000000000000000000000000000000000000"
      : token.address;
  }
  public async quoter({
    inputCurrency,
    outputCurrency,
    inputAmount,
    slippage,
    account
  }: QuoterProps): Promise<any> {
    const _amount = BigNumber(inputAmount)
      .multipliedBy(10 ** inputCurrency.decimals)
      .toFixed(0);
    const result = await axios.get(
      `https://bartio.internal.oogabooga.io/route/swap/v1?tokenIn=${this.getTokenAddress(
        inputCurrency
      )}&tokenOut=${this.getTokenAddress(
        outputCurrency
      )}&amount=${_amount}&to=${
        account || "0x0c30Bd3A42E8DfDa2c599035c9D8360cCCBAEd9a"
      }&maxSlippage=${slippage}`
    );
    const data = result.data;

    if (!data) {
      return {
        inputAmount,
        outputAmount: "",
        inputCurrency,
        outputCurrency,
        noPair: true
      };
    }

    const outputCurrencyAmount = new BigNumber(data.assumedAmountOut.toString())
      .div(10 ** outputCurrency.decimals)
      .toFixed(outputCurrency.decimals)
      .replace(/\.?0+$/, "");

    const txn = {
      value: data.routerArgs.value,
      data: data.routerArgs.txdata,
      to: data.routerAddr
    };
    let estimateGas = new BigNumber(5000000);
    try {
      const provider = new providers.JsonRpcProvider(
        chains[inputCurrency.chainId].rpcUrls[0]
      );
      const estimateRes = await provider.estimateGas(txn);
      estimateGas = new BigNumber(estimateRes.toString()).multipliedBy(1.5);
    } catch (err) {
      console.log("estimate gas err", err);
    }
    console.log("estimateGas", estimateGas.toString());
    const returnData = {
      outputCurrencyAmount,
      noPair: false,
      routerAddress: data.routerAddr,
      routes: [
        {
          percentage: 100,
          routes: [
            {
              token0: { symbol: inputCurrency.symbol },
              token1: { symbol: outputCurrency.symbol }
            }
          ]
        }
      ],
      txn: { ...txn, gasLimit: estimateGas.toFixed(0) }
    };

    return returnData;
  }
}
