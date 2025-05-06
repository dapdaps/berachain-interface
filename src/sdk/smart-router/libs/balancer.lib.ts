import { Contract, providers } from "ethers";
import BigNumber from "bignumber.js";
import { nativeToWNative } from "../utils/token";
import chains from "../config/chains";
import routerAbi from "../config/abi/router-balancer";
import formatRoutes from "../utils/format-routes";
import weth from "../config/weth";
import { multicall } from "../utils/multicall";
import { multicallAddresses } from "@/utils/multicall";

export class BalancerLib {
  private pools: any = [];
  private routerAddress: string = "";

  constructor({ pools, routerAddress }: any) {
    this.pools = pools;
    this.routerAddress = routerAddress;
  }
  public setPools(pools: any) {
    this.pools = pools;
  }
  public async bestTrade({
    inputCurrency,
    outputCurrency,
    inputAmount,
    account,
    slippage
  }: any) {
    const _inputCurrency = nativeToWNative(inputCurrency);
    const _outputCurrency = nativeToWNative(outputCurrency);
    const _amount = BigNumber(inputAmount)
      .multipliedBy(10 ** inputCurrency.decimals)
      .toFixed(0);

    const paths: any[] = [];

    const visited = new Set();
    const findPaths = (
      currentNode: string,
      currentPath: any[],
      depth: number = 0
    ) => {
      // Limit recursion depth to prevent stack overflow
      if (depth > 3) return;

      // Mark current node as visited in this path
      visited.add(currentNode);

      // If we found the output currency, add this path to our results
      if (currentNode.toLowerCase() === _outputCurrency.address.toLowerCase()) {
        paths.push([...currentPath]);
      } else {
        // Find all pools that contain the current token
        const connectedPools = this.pools?.filter((poolData: any) =>
          poolData[0].includes(currentNode.toLowerCase())
        );

        // For each connected pool, explore all tokens in that pool
        for (const pool of connectedPools) {
          const poolId = pool[1];
          const poolTokens = pool[0];

          // For each token in the pool
          for (const token of poolTokens) {
            // Skip if it's the current token or already visited
            if (
              token.toLowerCase() === currentNode.toLowerCase() ||
              visited.has(token)
            )
              continue;

            // Add this step to the path and continue searching
            currentPath.push({ poolId, tokenIn: currentNode, tokenOut: token });
            findPaths(token, currentPath, depth + 1);
            currentPath.pop(); // Backtrack
          }
        }
      }

      // Remove from visited when backtracking
      visited.delete(currentNode);
    };

    // Start the search from the input currency
    findPaths(_inputCurrency.address.toLowerCase(), []);

    // If no paths found, return no pair
    if (paths.length === 0) {
      return {
        outputCurrencyAmount: "",
        noPair: true
      };
    }

    // Use multicall to query each path using queryBatchSwap
    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const routerContract = new Contract(
      this.routerAddress,
      routerAbi,
      provider
    );

    // Prepare multicall queries for each path
    const multicallCalls = paths.map((path) => {
      // Format the swaps for queryBatchSwap
      const swaps = path.map((hop: any, i: number) => {
        const tokenInIndex = i === 0 ? 0 : i;
        const tokenOutIndex = i === 0 ? 1 : i + 1;

        return {
          poolId: hop.poolId,
          assetInIndex: tokenInIndex,
          assetOutIndex: tokenOutIndex,
          amount: i === 0 ? _amount : 0,
          userData: "0x"
        };
      });

      // Collect unique tokens in the path
      const assets = [_inputCurrency.address];
      path.forEach((hop: any) => {
        if (!assets.includes(hop.tokenOut)) {
          assets.push(hop.tokenOut);
        }
      });

      return {
        address: this.routerAddress,
        name: "queryBatchSwap",
        params: [0, swaps, assets, [account, false, account, false]]
      };
    });
    const multicallResults = await multicall({
      abi: routerAbi,
      calls: multicallCalls,
      options: {
        requireSuccess: false
      },
      multicallAddress: multicallAddresses[inputCurrency.chainId],
      provider
    });

    // Find the best path (the one with the highest output amount)
    let bestPathIndex = 0;
    let bestOutputAmount = new BigNumber(0);

    multicallResults
      .filter((result: any) => result)
      .forEach((result: any, index: number) => {
        // The last element in the result array is the output amount (negative value)
        const outputAmount = new BigNumber(
          result[0][result[0].length - 1].toString()
        ).multipliedBy(-1);

        if (outputAmount.gt(bestOutputAmount)) {
          bestOutputAmount = outputAmount;
          bestPathIndex = index;
        }
      });

    // If no valid path found
    if (bestOutputAmount.isZero()) {
      return {
        outputCurrencyAmount: "",
        noPair: true
      };
    }

    // Format the best path for return
    const bestPath = paths[bestPathIndex];

    const formattedRoutes = await formatRoutes({
      tokenAddresses: [
        _inputCurrency.address,
        ...bestPath.map((hop: any) => hop.tokenOut)
      ],
      inputCurrency,
      outputCurrency
    });

    // Prepare the return data
    const outputCurrencyAmount = bestOutputAmount
      .div(10 ** outputCurrency.decimals)
      .toFixed(outputCurrency.decimals)
      .replace(/\.?0+$/, "");

    const returnData = {
      outputCurrencyAmount,
      noPair: false,
      routerAddress: this.routerAddress,
      routes: [{ percentage: 100, routes: formattedRoutes }]
    };

    // If no account provided, return just the quote
    if (!account) return returnData;

    // Prepare transaction data for batchSwap
    const RouterContract = new Contract(
      this.routerAddress,
      routerAbi,
      provider.getSigner(account)
    );

    // Determine if we should use swap or batchSwap based on path length
    const method = bestPath.length > 1 ? "batchSwap" : "swap";
    let params: any = [];
    const funds = [account, false, account, false];
    const deadline = Math.ceil(Date.now() / 1000) + 300;

    if (method === "batchSwap") {
      // Collect unique tokens in the path
      const assets = [_inputCurrency.address];

      // Merge consecutive hops with the same poolId
      const mergedPath = [];
      let currentHop = null;

      for (let i = 0; i < bestPath.length; i++) {
        if (!currentHop) {
          currentHop = { ...bestPath[i] };
        } else if (currentHop.poolId === bestPath[i].poolId) {
          // If same poolId, update the tokenOut to the latest one
          currentHop.tokenOut = bestPath[i].tokenOut;
        } else {
          // Different poolId, add the current hop to merged path and start a new one
          mergedPath.push(currentHop);
          currentHop = { ...bestPath[i] };
        }

        // Add the last hop
        if (i === bestPath.length - 1 && currentHop) {
          mergedPath.push(currentHop);
        }
      }

      // Format the swaps for batchSwap using the merged path
      const swaps = mergedPath.map((hop: any, i: number) => {
        const tokenInIndex = i === 0 ? 0 : i;
        const tokenOutIndex = i === 0 ? 1 : i + 1;

        if (!assets.includes(hop.tokenOut)) {
          assets.push(hop.tokenOut);
        }

        return {
          poolId: hop.poolId,
          assetInIndex: tokenInIndex,
          assetOutIndex: tokenOutIndex,
          amount: i === 0 ? _amount : 0,
          userData: "0x"
        };
      });

      // Calculate limits (amount in for first token, minimum amount out for last token)
      const limits = Array(assets.length).fill("0");
      limits[0] = _amount; // Amount in
      limits[assets.length - 1] = bestOutputAmount
        .multipliedBy(1 - slippage)
        .multipliedBy(-1)
        .toFixed(0); // Minimum amount out with slippage

      params = [
        0,
        swaps,
        assets.map((address: any) =>
          inputCurrency.isNative &&
          address.toLowerCase() === weth[inputCurrency.chainId].toLowerCase()
            ? "0x0000000000000000000000000000000000000000"
            : address
        ),
        funds,
        limits,
        deadline.toFixed(0)
      ];
    } else {
      // For single hop, use swap method
      const hop = bestPath[0];
      const swap = {
        poolId: hop.poolId,
        kind: 0,
        assetIn:
          inputCurrency.isNative &&
          hop.tokenIn.toLowerCase() ===
            weth[inputCurrency.chainId].toLowerCase()
            ? "0x0000000000000000000000000000000000000000"
            : hop.tokenIn,
        assetOut:
          inputCurrency.isNative &&
          hop.tokenOut.toLowerCase() ===
            weth[inputCurrency.chainId].toLowerCase()
            ? "0x0000000000000000000000000000000000000000"
            : hop.tokenOut,
        amount: _amount,
        userData: "0x"
      };

      const minAmountOut = bestOutputAmount
        .multipliedBy(1 - slippage)
        .toFixed(0);

      params = [swap, funds, minAmountOut, deadline.toFixed(0)];
    }

    const options = {
      value: inputCurrency.isNative ? _amount : "0"
    };

    // Estimate gas
    let estimateGas;
    try {
      estimateGas = await RouterContract.estimateGas[method](
        ...params,
        options
      );
    } catch (err) {
      console.log("estimateGas err", err);
    }
    console.log(`${method} estimateGas:`, estimateGas?.toString());

    // Populate transaction
    const txn = await RouterContract.populateTransaction[method](...params, {
      ...options,
      gasLimit: estimateGas
        ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
        : 5000000
    });

    return { ...returnData, txn };
  }
}
