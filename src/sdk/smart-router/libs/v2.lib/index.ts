import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { providers } from "ethers";
import chains from "../../config/chains";
import { multicall } from "../../utils/multicall";
import multicallAddresses from "../../config/multicall";
import { nativeToWNative } from "../../utils/token";
import getStableAmountOut from "./get-stable-amountout";

export class V2 {
  private midTokens: any[] = [];
  private factoryAddress: string;
  private initCodeHash: string;
  private hasStable: boolean = false;
  private includeStable: boolean = false;
  private maxHops: number = 5;
  private fee: number = 3;
  private stableFee: number = 0.5;
  private computablePairAddress = false;
  private amountOutType: number = 1;
  private feeIn = false;
  private getPoolMethod = "getPair";

  constructor({
    midTokens,
    factoryAddress,
    initCodeHash,
    hasStable,
    includeStable,
    fee,
    computablePairAddress,
    amountOutType,
    feeIn,
    getPoolMethod,
    stableFee
  }: any) {
    this.midTokens = midTokens;
    this.factoryAddress = factoryAddress;
    this.initCodeHash = initCodeHash;
    this.hasStable = hasStable ?? false;
    this.includeStable = includeStable ?? false;
    this.fee = fee || 3;
    this.computablePairAddress = computablePairAddress ?? true;
    this.amountOutType = amountOutType ?? 1;
    this.feeIn = feeIn ?? false;
    this.getPoolMethod = getPoolMethod ?? "getPair";
    this.stableFee = stableFee ?? 0.5;
  }
  private getPairAddress([tokenA, tokenB, stable]: any) {
    const [token0, token1] =
      tokenA.toLowerCase() < tokenB.toLowerCase()
        ? [tokenA, tokenB]
        : [tokenB, tokenA];
    const salt = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        this.hasStable
          ? ["address", "address", "bool"]
          : ["address", "address"],
        this.hasStable ? [token0, token1, stable] : [token0, token1]
      )
    );

    return {
      address: ethers.utils.getCreate2Address(
        this.factoryAddress,
        salt,
        this.initCodeHash
      ),
      isReserved: tokenA.toLowerCase() > tokenB.toLowerCase()
    };
  }

  private async queryPairAddress(pairs: any, chainId: number) {
    const rpcUrl = chains[chainId].rpcUrls[0];
    const provider = new providers.JsonRpcProvider(rpcUrl);
    const calls = pairs.map((pair: any) => {
      return {
        address: this.factoryAddress,
        name: this.getPoolMethod,
        params: this.hasStable
          ? [pair.tokenA.address, pair.tokenB.address, pair.stable]
          : [pair.tokenA.address, pair.tokenB.address]
      };
    });

    const inputs = [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ];
    if (this.hasStable) {
      inputs.push({
        internalType: "bool",
        name: "",
        type: "bool"
      });
    }

    const multicallResults = await multicall({
      abi: [
        {
          inputs,
          name: this.getPoolMethod,
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address"
            }
          ],
          stateMutability: "view",
          type: "function"
        }
      ],
      calls,
      options: { requireSuccess: false },
      multicallAddress: multicallAddresses[chainId],
      provider
    });

    const _pairs: any = [];

    pairs.forEach((pair: any, i: number) => {
      if (!multicallResults[i]) return;
      const address = multicallResults[i][0];
      if (address === "0x0000000000000000000000000000000000000000") return;
      _pairs.push({
        ...pair,
        address,
        isReserved:
          pair.tokenA.address.toLowerCase() > pair.tokenB.address.toLowerCase()
      });
    });

    return _pairs;
  }

  private async getPairs({ inputCurrency, outputCurrency }: any) {
    const tokens = [inputCurrency, ...this.midTokens, outputCurrency];
    const pairs = [];
    const existsPairs: { [key: string]: boolean } = {};
    while (tokens.length) {
      const token = tokens.shift();
      for (let i = 0; i < tokens.length; i++) {
        if (token.address === tokens[i].address) continue;
        if (
          existsPairs[`${token.address}-${tokens[i].address}`] ||
          existsPairs[`${tokens[i].address}-${token.address}`]
        )
          continue;
        if (!this.hasStable) {
          pairs.push({
            tokenA: token,
            tokenB: tokens[i]
          });
        } else {
          if (this.includeStable) {
            pairs.push({
              tokenA: token,
              tokenB: tokens[i],
              stable: true
            });
          }
          pairs.push({
            tokenA: token,
            tokenB: tokens[i],
            stable: false
          });
        }
        existsPairs[`${token.address}-${tokens[i].address}`] = true;
        existsPairs[`${tokens[i].address}-${token.address}`] = true;
      }
    }

    if (!this.computablePairAddress) {
      return this.queryPairAddress(pairs, inputCurrency.chainId);
    } else {
      return pairs.map((pair) => ({
        ...pair,
        ...this.getPairAddress([
          pair.tokenA.address,
          pair.tokenB.address,
          pair.stable
        ])
      }));
    }
  }

  private async getPools({ inputCurrency, outputCurrency }: any) {
    const pairs = await this.getPairs({
      inputCurrency,
      outputCurrency
    });
    const calls = pairs.map((pair: any) => ({
      address: pair.address,
      name: "getReserves",
      params: []
    }));

    const rpcUrl = chains[inputCurrency.chainId].rpcUrls[0];
    const provider = new providers.JsonRpcProvider(rpcUrl);

    let multicallResults = [];

    try {
      multicallResults = await multicall({
        abi: [
          {
            inputs: [],
            name: "getReserves",
            outputs: [
              {
                internalType: "uint256",
                name: "_reserve0",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "_reserve1",
                type: "uint256"
              },
              {
                internalType: "uint256",
                name: "_blockTimestampLast",
                type: "uint256"
              }
            ],
            stateMutability: "view",
            type: "function"
          }
        ],
        calls,
        options: { requireSuccess: false },
        multicallAddress: multicallAddresses[inputCurrency.chainId],
        provider
      });
    } catch (err) {
      console.error("get reserves failed");
    }

    const _pools: any = [];

    multicallResults.forEach((result: any, i: number) => {
      const pair = pairs[i];
      if (!result) return;
      _pools.push({
        ...pair,
        reserve0: BigNumber(result._reserve0.toString()),
        reserve1: BigNumber(result._reserve1.toString())
      });
    });
    return _pools;
  }

  public async bestTrade({ inputCurrency, outputCurrency, inputAmount }: any) {
    const _inputCurrency = nativeToWNative(inputCurrency);
    const _outputCurrency = nativeToWNative(outputCurrency);
    const pools = await this.getPools({
      inputCurrency: _inputCurrency,
      outputCurrency: _outputCurrency,
      inputAmount
    });
    const paths = this.getPaths({
      inputCurrency: _inputCurrency,
      outputCurrency: _outputCurrency,
      pools,
      inputAmount
    });

    if (paths.length === 0) return null;
    let bestTrade: any = null;

    while (paths.length) {
      const path = paths.shift();

      for (let i = 0, len = path.length; i < len; i++) {
        const pair = path[i];
        let _inputAmount =
          i === 0 ? BigNumber(inputAmount) : path[i - 1].amountOut;
        pair.amountOut = this.getAmountOut({ pair, inputAmount: _inputAmount });

        if (
          i === path.length - 1 &&
          pair.amountOut.gt(bestTrade?.amountOut || 0)
        ) {
          bestTrade = {
            pairs: path,
            amountOut: pair.amountOut
          };
        }
      }
    }

    if (!bestTrade) return null;
    const routes: any = [];

    bestTrade.pairs.forEach((pair: any) => {
      routes.push({
        token0: {
          ...pair.tokenA
        },
        token1: {
          ...pair.tokenB
        },
        stable: pair.stable
      });
    });

    if (!this.feeIn)
      bestTrade.amountOut = bestTrade.amountOut.multipliedBy(
        1 - this.fee / 1000
      );
    bestTrade.routes = [{ percentage: 100, routes }];

    return bestTrade;
  }

  public updateMidTokens(midTokens: any) {
    this.midTokens = midTokens;
  }

  private getPaths({ inputCurrency, outputCurrency, pools }: any) {
    const paths: any = [];
    const cachedPairs: { [key: string]: boolean } = {};

    const reverseTokens = (pool: any) => {
      const [tokenA, tokenB] = [pool.tokenB, pool.tokenA];
      return { ...pool, tokenA, tokenB, isReserved: !pool.isReserved };
    };
    const loop = (pairs: any, currentPairs: any, bestTrades: any) => {
      for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        if (
          ((pair.tokenA.address === inputCurrency.address &&
            pair.tokenB.address === outputCurrency.address) ||
            (pair.tokenA.address === outputCurrency.address &&
              pair.tokenB.address === inputCurrency.address)) &&
          !cachedPairs[pair.address]
        ) {
          bestTrades.push([
            pair.tokenB.address === outputCurrency.address
              ? pair
              : reverseTokens(pair)
          ]);
          cachedPairs[pair.address] = true;
          continue;
        }

        if (pair.reserve0.eq(0) || pair.reserve1.eq(0)) continue;

        if (currentPairs.length > this.maxHops) continue;

        const len = currentPairs.length;

        if (
          len &&
          (pair.tokenA.address === inputCurrency.address ||
            pair.tokenB.address === inputCurrency.address)
        )
          continue;

        const prevToken = len
          ? currentPairs[len - 1].tokenB.address
          : inputCurrency.address;

        if (prevToken === inputCurrency.address && len) continue;

        if (
          (pair.tokenA.address === outputCurrency.address ||
            pair.tokenB.address === outputCurrency.address) &&
          ((len &&
            (prevToken === pair.tokenB.address ||
              prevToken === pair.tokenA.address)) ||
            pair.tokenB.address === inputCurrency.address ||
            pair.tokenA.address === inputCurrency.address)
        ) {
          bestTrades.push([
            ...currentPairs,
            pair.tokenB.address === outputCurrency.address
              ? pair
              : reverseTokens(pair)
          ]);
          continue;
        }

        if (
          pair.tokenA.address === prevToken ||
          pair.tokenB.address === prevToken
        ) {
          const pairsExcludingThisPair = pairs
            .slice(0, i)
            .concat(pairs.slice(i + 1, pairs.length));
          loop(
            pairsExcludingThisPair,
            [
              ...currentPairs,
              pair.tokenA.address === prevToken ? pair : reverseTokens(pair)
            ],
            bestTrades
          );
        }
      }
    };

    loop(pools, [], paths);

    return paths;
  }

  private getAmountOut({ pair, inputAmount }: any) {
    if (pair.stable) {
      const _inputAmountWithFee = this.feeIn
        ? BigNumber(inputAmount)
            .multipliedBy(1 - this.stableFee / 1000)
            .toFixed(0)
        : inputAmount;

      return BigNumber(
        getStableAmountOut({ pair, inputAmount: _inputAmountWithFee }) || 0
      );
    }
    if (this.amountOutType === 1) {
      const k = BigNumber(pair.reserve0).multipliedBy(pair.reserve1);
      const x = BigNumber(pair.reserve0);
      const y = BigNumber(pair.reserve1);

      return x.minus(
        k.div(y.plus(BigNumber(inputAmount).multipliedBy(1 - this.fee / 1000)))
      );
    }
    if (this.amountOutType === 2) {
      const [reserveA, reserveB] = pair.isReserved
        ? [pair.reserve1, pair.reserve0]
        : [pair.reserve0, pair.reserve1];
      const _inputAmountWithFee = this.feeIn
        ? BigNumber(inputAmount)
            .multipliedBy(1 - this.fee / 1000)
            .toFixed(0)
        : inputAmount;

      return reserveB
        .multipliedBy(_inputAmountWithFee)
        .div(reserveA.plus(_inputAmountWithFee));
    }
  }
}
