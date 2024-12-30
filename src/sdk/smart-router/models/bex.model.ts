import axios from "axios";
import BigNumber from "bignumber.js";
import { Contract, providers } from "ethers";
import formatRoutes from "../utils/format-routes";
import { nativeToWNative } from "../utils/token";
import routerAbi from "../config/abi/bex-abi";
import chains from "../config/chains";
import weth from "../config/weth";
import type { QuoterProps } from "../types";

export class Bex {
  private ROUTER: Record<number, string> = {
    80084: "0x21e2C0AFd058A89FCf7caf3aEA3cB84Ae977B73D"
  };
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
    const _inputCurrency = nativeToWNative(inputCurrency);
    const _outputCurrency = nativeToWNative(outputCurrency);
    const result = await axios.get(
      `https://bartio-bex-router.berachain.com/dex/route?fromAsset=${_inputCurrency.address}&toAsset=${_outputCurrency.address}&amount=${_amount}`
    );

    const steps = result.data.steps;

    if (!steps) {
      return {
        inputAmount,
        outputAmount: "",
        inputCurrency,
        outputCurrency,
        noPair: true
      };
    }

    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const routerAddress = this.ROUTER[inputCurrency.chainId];
    const routerContract = new Contract(routerAddress, routerAbi, provider);

    const params = [steps, _amount];

    const quoteResult = await routerContract.previewMultiSwap(...params);

    const outputCurrencyAmount = new BigNumber(quoteResult.out.toString())
      .div(10 ** outputCurrency.decimals)
      .toFixed(outputCurrency.decimals)
      .replace(/\.?0+$/, "");

    const minAmountOut = BigNumber(quoteResult.out.toString())
      .multipliedBy(1 - slippage)
      .toFixed(0);

    const options = {
      value: inputCurrency.isNative ? _amount : 0
    };

    const tokenAddresses: Record<string, boolean> = {};
    const swapSteps: any[] = [];

    const isNative = (address: string) =>
      address.toLowerCase() === weth[inputCurrency.chainId].toLowerCase();

    steps.forEach((step: any) => {
      tokenAddresses[step.base] = true;
      tokenAddresses[step.quote] = true;
      swapSteps.push({
        ...step,
        base: isNative(step.base)
          ? "0x0000000000000000000000000000000000000000"
          : step.base,
        quote: isNative(step.quote)
          ? "0x0000000000000000000000000000000000000000"
          : step.quote
      });
    });

    const routes = await formatRoutes({
      tokenAddresses: Object.keys(tokenAddresses),
      inputCurrency,
      outputCurrency
    });

    const returnData = {
      outputCurrencyAmount,
      noPair: false,
      routerAddress,
      routes: [{ percentage: 100, routes }]
    };

    const swapParams = [swapSteps, _amount, minAmountOut];

    let estimateGas;

    try {
      estimateGas = await routerContract.estimateGas.multiSwap(
        ...swapParams,
        options
      );
    } catch (err) {
      console.log("estimateGas err", err);
    }

    try {
      const txn = await routerContract.populateTransaction.multiSwap(
        ...swapParams,
        {
          ...options,
          gasLimit: estimateGas
            ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
            : 5000000
        }
      );

      return {
        ...returnData,
        txn
      };
    } catch (err: any) {
      return returnData;
    }
  }
}
