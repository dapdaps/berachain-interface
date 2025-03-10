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

export class Bex {
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
          "query MyQuery($chain: GqlChain!, $swapType: GqlSorSwapType!, $swapAmount: AmountHumanReadable!, $tokenIn: String!, $tokenOut: String!) {\n  sorGetSwapPaths(\n    swapAmount: $swapAmount\n    chain: $chain     \n    swapType: $swapType\n    tokenIn: $tokenIn\n    tokenOut: $tokenOut\n  ) { \n    tokenInAmount\n    tokenOutAmount\n    returnAmount\n    swapAmount\n    tokenAddresses\n    paths {\n      inputAmountRaw\n      outputAmountRaw\n      pools\n      protocolVersion\n      tokens {\n        address\n        decimals\n      }\n    }\n    routes {\n      share\n      tokenInAmount\n      tokenOut\n      tokenOutAmount\n      hops {\n        poolId\n        tokenIn\n        tokenInAmount\n        tokenOut\n        tokenOutAmount\n      }\n    }\n  }\n}\n",
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

    const {
      paths,
      tokenAddresses,
      routes,
      returnAmount,
      tokenInAmount,
      tokenOutAmount
    } = poolsResponse.data.data.sorGetSwapPaths;

    const formatedRoutes = await formatRoutes({
      tokenAddresses: paths[0]?.tokens.map((token: any) => token.address),
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

    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const RouterContract = new Contract(
      routerAddress,
      routerAbi,
      provider.getSigner(account)
    );

    const method = routes[0]?.hops.length > 1 ? "batchSwap" : "swap";
    let params: any = {};
    const funds = [account, false, account, false];
    const deadline = Math.ceil(Date.now() / 1000) + 300;

    if (method === "batchSwap") {
      const limits = [tokenInAmount];

      const swaps = routes[0]?.hops.map((hop: any, i: number) => {
        let isLast = false;
        if (i === routes[0]?.hops.length - 1) {
          limits.push(
            BigNumber(-tokenOutAmount)
              .multipliedBy(1 - slippage)
              .toFixed(0)
          );
          isLast = true;
        } else {
          limits.push(0);
          isLast = false;
        }

        const assetInIndex = tokenAddresses.findIndex((address: any) =>
          address.includes(hop.tokenIn)
        );
        const assetOutIndex = tokenAddresses.findIndex((address: any) =>
          address.includes(hop.tokenOut)
        );

        return {
          poolId: hop.poolId,
          userData: "0x",
          assetInIndex,
          assetOutIndex,
          amount: i === 0 ? tokenInAmount : 0
        };
      });
      const assets = tokenAddresses.map(
        (address: any) =>
          // address.toLowerCase() === weth[inputCurrency.chainId].toLowerCase()
          //   ? "0x0000000000000000000000000000000000000000"
          //   : address
          address
      );
      params = [0, swaps, assets, funds, limits, deadline.toFixed(0)];
    } else {
      const swaps = routes[0]?.hops.map((hop: any, i: number) => {
        return {
          poolId: hop.poolId,
          kind: 0,
          // assetIn:
          //   hop.tokenIn.toLowerCase() ===
          //   weth[inputCurrency.chainId].toLowerCase()
          //     ? "0x0000000000000000000000000000000000000000"
          //     : hop.tokenIn,
          // assetOut:
          //   hop.tokenOut.toLowerCase() ===
          //   weth[inputCurrency.chainId].toLowerCase()
          //     ? "0x0000000000000000000000000000000000000000"
          //     : hop.tokenOut,
          assetIn: hop.assetIn,
          assetOut: hop.assetOut,
          amount: tokenInAmount,
          userData: "0x"
        };
      });
      params = [
        swaps[0],
        funds,
        BigNumber(tokenOutAmount)
          .multipliedBy(1 - slippage)
          .toFixed(0),
        deadline.toFixed(0)
      ];
    }

    const options = {
      value: inputCurrency.isNative ? tokenInAmount : "0"
    };
    let estimateGas;
    try {
      estimateGas = await RouterContract.estimateGas[method](
        ...params,
        options
      );
    } catch (err) {
      console.log("estimateGas err", err);
    }
    console.log("estimateGas", estimateGas?.toString());
    const txn = await RouterContract.populateTransaction[method](...params, {
      ...options,
      gasLimit: estimateGas
        ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
        : 5000000
    });

    return { ...returnData, txn };
  }
}
