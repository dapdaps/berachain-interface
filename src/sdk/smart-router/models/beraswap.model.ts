import axios from "axios";
import { Contract, providers } from "ethers";
import { nativeToWNative } from "../utils/token";
import weth from "../config/weth";
import chains from "../config/chains";
import routerAbi from "../config/abi/router-balancer";
import formatRoutes from "../utils/format-routes";
import BigNumber from "bignumber.js";

type QuoterProps = {
  inputCurrency: any;
  outputCurrency: any;
  inputAmount: string;
  slippage: number;
  account: string;
};

export class BeraSwap {
  private ROUTER_ADDRESS: { [key: number]: string } = {
    80094: "0x4Be03f781C497A489E3cB0287833452cA9B9E80B"
  };

  constructor(chainId: number) {}
  public async quoter({
    inputAmount,
    inputCurrency,
    outputCurrency,
    account,
    slippage
  }: QuoterProps): Promise<any> {
    const _inputCurrency = nativeToWNative(inputCurrency);
    const _outputCurrency = nativeToWNative(outputCurrency);
    const poolsResponse = await axios.post(
      "https://chgbtcc9ffu7rbdw2kmu4urwy.stellate.sh/",
      {
        query:
          "#graphql\n  query MyQuery($chain: GqlChain!, $swapType: GqlSorSwapType!, $swapAmount: AmountHumanReadable!, $tokenIn: String!, $tokenOut: String!) {\n    sorGetSwapPaths(\n      swapAmount: $swapAmount\n      chain: $chain\n      swapType: $swapType\n      tokenIn: $tokenIn\n      tokenOut: $tokenOut\n    ) {\n      tokenInAmount\n      tokenOutAmount\n      returnAmount\n      priceImpact {\n        error\n        priceImpact\n      }\n      swapAmount\n      paths {\n        inputAmountRaw\n        outputAmountRaw\n        pools\n        protocolVersion\n        tokens {\n          address\n          decimals\n        }\n      }\n      routes {\n        share\n        tokenInAmount\n        tokenOut\n        tokenOutAmount\n        hops {\n          poolId\n          tokenIn\n          tokenInAmount\n          tokenOut\n          tokenOutAmount\n          pool {\n            symbol\n          }\n        }\n      }\n    }\n  }\n",
        variables: {
          chain: "BERACHAIN",
          swapAmount: inputAmount,
          swapType: "EXACT_IN",
          tokenIn: _inputCurrency.address.toLowerCase(),
          tokenOut: _outputCurrency.address.toLowerCase()
        }
      }
    );

    if (!poolsResponse?.data?.data?.sorGetSwapPaths) {
      return {
        outputCurrencyAmount: "",
        noPair: true
      };
    }

    const { paths, routes, returnAmount, tokenInAmount, tokenOutAmount } =
      poolsResponse.data.data.sorGetSwapPaths;

    const tokenAddresses = paths[0]?.tokens.map((token: any) => token.address);

    const { routes: formatedRoutes, symbols: midTokenSymbols = [] } =
      await formatRoutes({
        tokenAddresses,
        inputCurrency,
        outputCurrency
      });

    const routerAddress = this.ROUTER_ADDRESS[inputCurrency.chainId];

    const returnData = {
      outputCurrencyAmount: returnAmount,
      noPair: false,
      routerAddress,
      routes: [{ percentage: 100, routes: formatedRoutes }]
    };

    if (!account) return returnData;

    const tokenSymbols = {
      [_inputCurrency.address]: _inputCurrency.symbol,
      [_outputCurrency.address]: _outputCurrency.symbol
    };

    midTokenSymbols.forEach((symbol: string, i: number) => {
      tokenSymbols[tokenAddresses[i + 1]] = symbol[0];
    });

    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const RouterContract = new Contract(
      routerAddress,
      routerAbi,
      provider.getSigner(account)
    );

    const funds = [account, false, account, false];
    const limits = [tokenInAmount];
    const deadline = Math.ceil(Date.now() / 1000) + 120;

    const swaps = routes[0]?.hops.map((hop: any, i: number) => {
      if (i === routes[0]?.hops.length - 1) {
        limits.push(
          BigNumber(-tokenOutAmount)
            .multipliedBy(1 - slippage)
            .toFixed(0)
        );
      } else {
        limits.push(0);
      }
      const poolSymbol = hop.pool.symbol.split("-");
      const assetInSymbol = tokenSymbols[hop.tokenIn].toLowerCase();
      const assetOutSymbol = tokenSymbols[hop.tokenOut].toLowerCase();
      const assetInIndex = poolSymbol.findIndex((symbol: any) =>
        symbol.toLowerCase().includes(assetInSymbol)
      );
      const assetOutIndex = poolSymbol.findIndex((symbol: any) =>
        symbol.toLowerCase().includes(assetOutSymbol)
      );

      return {
        poolId: hop.poolId,
        userData: "0x",
        assetInIndex,
        assetOutIndex,
        amount:
          i === 0
            ? tokenInAmount
            : i === routes[0]?.hops.length - 1
            ? tokenOutAmount
            : 0
      };
    });
    const assets = tokenAddresses.map((address: any) =>
      address.toLowerCase() === weth[inputCurrency.chainId].toLowerCase()
        ? "0x0000000000000000000000000000000000000000"
        : address
    );
    const params = [0, swaps, assets, funds, limits, deadline.toFixed(0)];

    const options = {
      value: inputCurrency.isNative ? tokenInAmount : "0"
    };
    let estimateGas;
    try {
      estimateGas = await RouterContract.estimateGas.batchSwap(
        ...params,
        options
      );
    } catch (err) {
      // console.log("estimateGas err", err);
    }
    console.log("estimateGas", estimateGas?.toString());
    const txn = await RouterContract.populateTransaction.batchSwap(...params, {
      ...options,
      gasLimit: estimateGas
        ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
        : 5000000
    });

    return { ...returnData, txn };
  }
}
