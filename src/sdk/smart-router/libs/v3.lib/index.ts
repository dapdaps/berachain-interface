import { utils } from "ethers";
import { multicall } from "../../utils/multicall";
import multicallAddresses from "../../config/multicall";
import { providers } from "ethers";
import chains from "../../config/chains";
import { nativeToWNative } from "../../utils/token";
import defaultQuoterAbi from "../../config/abi/quoter-v2-1";
import BigNumber from "bignumber.js";

export class V3 {
  private factoryAddress: string;
  private quoterAddress: string;
  private midTokens: any[] = [];
  private fees: any[] = [];
  private maxHops: number = 3;
  private provider: any;
  private chainId: number;
  private type: string = "";
  private quoterAbi: any = defaultQuoterAbi;
  private needFilter: boolean = true;
  private feeType: string = "uint24";
  private name: string = "";

  constructor({
    factoryAddress,
    quoterAddress,
    midTokens,
    fees,
    chainId,
    quoterAbi,
    type,
    feeType,
    name
  }: any) {
    this.factoryAddress = factoryAddress;
    this.quoterAddress = quoterAddress;
    this.midTokens = midTokens;
    this.fees = fees ?? [];
    this.chainId = chainId;
    const rpcUrl = chains[chainId].rpcUrls[0];
    this.provider = new providers.JsonRpcProvider(rpcUrl);
    this.type = type;
    if (quoterAbi) this.quoterAbi = quoterAbi;
    if (feeType) this.feeType = feeType;
    this.name = name;
  }

  private getPriceByTick({ tick, tokenA, tokenB, isReserved }: any) {
    const [token0, token1] = isReserved ? [tokenB, tokenA] : [tokenA, tokenB];
    const decimals = token1.decimals - token0.decimals;
    const price = new BigNumber(1.0001 ** tick).div(10 ** decimals).toString();
    return price;
  }

  private getPriceByReverse({
    reverse0,
    reverse1,
    tokenA,
    tokenB,
    isReserved
  }: any) {
    const [token0, token1] = isReserved ? [tokenB, tokenA] : [tokenA, tokenB];
    const _amount0 = BigNumber(reverse0.toString()).div(10 ** token0.decimals);
    const _amount1 = BigNumber(reverse1.toString()).div(10 ** token1.decimals);

    return _amount1.div(_amount0).toString();
  }

  private async getPools({ inputCurrency, outputCurrency }: any) {
    const tokens = [inputCurrency, ...this.midTokens, outputCurrency];
    const pairs: any[] = [];
    const existsPairs: { [key: string]: boolean } = {};
    const hasFee = !!this.fees.length;

    while (tokens.length) {
      const token = tokens.shift();
      for (let i = 0; i < tokens.length; i++) {
        if (token.address === tokens[i].address) continue;
        if (
          existsPairs[`${token.address}-${tokens[i].address}`] ||
          existsPairs[`${tokens[i].address}-${token.address}`]
        )
          continue;

        if (hasFee) {
          for (let j = 0; j < this.fees.length; j++) {
            pairs.push({
              tokenA: token,
              tokenB: tokens[i],
              fee: this.fees[j]
            });
          }
        } else {
          pairs.push({
            tokenA: token,
            tokenB: tokens[i]
          });
        }

        existsPairs[`${token.address}-${tokens[i].address}`] = true;
        existsPairs[`${tokens[i].address}-${token.address}`] = true;
      }
    }

    const calls = pairs.map((pair: any) => ({
      address: this.factoryAddress,
      name: !this.type ? "getPool" : "poolByPair",
      params: hasFee
        ? [pair.tokenA.address, pair.tokenB.address, pair.fee]
        : [pair.tokenA.address, pair.tokenB.address]
    }));

    const inputs = [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" }
    ];

    if (hasFee) {
      inputs.push({ internalType: this.feeType, name: "", type: this.feeType });
    }

    let multicallResults = [];

    try {
      multicallResults = await multicall({
        abi: [
          {
            inputs,
            name: !this.type ? "getPool" : "poolByPair",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        calls,
        options: {
          requireSuccess: false
        },
        multicallAddress: multicallAddresses[inputCurrency.chainId],
        provider: this.provider
      });
    } catch (err) {
      console.error("get pool failed");
    }

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

    this.needFilter = _pairs.length > 5;

    if (!this.needFilter) return _pairs;

    const slotCalls = _pairs.map((pair: any) => ({
      address: pair.address,
      name: !this.type ? "slot0" : "getReserves"
    }));

    let slotResults = [];

    try {
      slotResults = await multicall({
        abi: [
          !this.type
            ? {
                inputs: [],
                name: "slot0",
                outputs: [
                  {
                    internalType: "uint160",
                    name: "sqrtPriceX96",
                    type: "uint160"
                  },
                  { internalType: "int24", name: "tick", type: "int24" },
                  {
                    internalType: "uint16",
                    name: "observationIndex",
                    type: "uint16"
                  },
                  {
                    internalType: "uint16",
                    name: "observationCardinality",
                    type: "uint16"
                  },
                  {
                    internalType: "uint16",
                    name: "observationCardinalityNext",
                    type: "uint16"
                  },
                  { internalType: "uint8", name: "feeProtocol", type: "uint8" },
                  { internalType: "bool", name: "unlocked", type: "bool" }
                ],
                stateMutability: "view",
                type: "function"
              }
            : {
                inputs: [],
                name: "getReserves",
                outputs: [
                  {
                    internalType: "uint128",
                    name: "",
                    type: "uint128"
                  },
                  {
                    internalType: "uint128",
                    name: "",
                    type: "uint128"
                  }
                ],
                stateMutability: "view",
                type: "function"
              }
        ],
        calls: slotCalls,
        options: {},
        multicallAddress: multicallAddresses[inputCurrency.chainId],
        provider: this.provider
      });
    } catch (err) {
      console.error("get pool information failed");
    }

    return _pairs.map((pair: any, i: number) => ({
      ...pair,
      price: !this.type
        ? this.getPriceByTick({
            tokenA: pair.tokenA,
            tokenB: pair.tokenB,
            isReserved: pair.isReserved,
            tick: slotResults[i].tick
          })
        : this.getPriceByReverse({
            tokenA: pair.tokenA,
            tokenB: pair.tokenB,
            isReserved: pair.isReserved,
            reverse0: slotResults[i][0],
            reverse1: slotResults[i][1]
          })
    }));
  }

  public async bestTrade({ inputCurrency, outputCurrency, inputAmount }: any) {
    const _inputCurrency = nativeToWNative(inputCurrency);
    const _outputCurrency = nativeToWNative(outputCurrency);
    const pools = await this.getPools({
      inputCurrency: _inputCurrency,
      outputCurrency: _outputCurrency
    });

    if (pools.length === 0) return null;

    const filterdPools = this.needFilter
      ? pools.filter((pool: any) => BigNumber(pool.price).gt(0))
      : pools;

    const paths = this.getPaths({
      inputCurrency: _inputCurrency,
      outputCurrency: _outputCurrency,
      pools: filterdPools,
      inputAmount,
      maxHops: this.maxHops
    });

    if (paths.length === 0) return null;

    return this.getAmounts(paths, inputAmount);
  }
  private async getAmounts(paths: any, amount: any) {
    let _paths: any = [];
    const hasFee = !!this.fees.length;
    if (this.needFilter) {
      while (paths.length) {
        const path = paths.pop();
        const pathAmountOut = this.getPathAmountOut(path, amount);
        if (pathAmountOut > 0)
          _paths.push({ pairs: path, amountOut: pathAmountOut });
      }
      // _paths = _paths.sort((a: any, b: any) => b.amountOut - a.amountOut).filter((path: any, i: number) => i < 50);

      if (_paths.length > 20) {
        _paths = _paths
          .sort((a: any, b: any) => a.pairs.length - b.pairs.length)
          .filter((path: any, i: number) => i < 20);
      }
    } else {
      _paths = paths.map((path: any) => ({ pairs: path }));
    }

    const calls = _paths.map((path: any) => {
      let pathBytes: any = [];

      path.pairs.forEach((pool: any, i: number) => {
        if (i === 0) {
          pathBytes = utils.arrayify(pool.tokenA.address);
        }
        if (hasFee) {
          let fee: any = utils.arrayify(pool.fee);
          if (fee.length === 1) {
            fee = [0, 0, fee[0]];
          }
          if (fee.length === 2) {
            fee = [0, fee[0], fee[1]];
          }
          pathBytes = [
            ...pathBytes,
            ...fee,
            // @ts-ignore
            ...utils.arrayify(pool.tokenB.address)
          ];
        } else {
          if (this.name === "Scribe") {
            pathBytes = [
              ...pathBytes,
              // @ts-ignore
              ...utils.arrayify("0x0000000000000000000000000000000000000000"),
              // @ts-ignore
              ...utils.arrayify(pool.tokenB.address)
            ];
          } else {
            // @ts-ignore
            pathBytes = [...pathBytes, ...utils.arrayify(pool.tokenB.address)];
          }
        }
      });
      return {
        address: this.quoterAddress,
        name: "quoteExactInput",
        params: [pathBytes, amount]
      };
    });

    let results = [];

    try {
      results = await multicall({
        abi: this.quoterAbi,
        calls: calls,
        options: { requireSuccess: false },
        multicallAddress: multicallAddresses[this.chainId],
        provider: this.provider
      });
    } catch (err) {
      console.error("get quoter data failed");
    }

    let bestPath: any = {};

    results.forEach((result: any, i: number) => {
      if (result && result.amountOut.gt(bestPath.amountOut || 0)) {
        bestPath = {
          routes: [
            { percentage: 100, routes: this.getRoutes(_paths[i].pairs) }
          ],
          amountOut: result.amountOut.toString(),
          path: calls[i].params[0]
        };
      }
    });

    return bestPath.amountOut ? bestPath : null;
  }
  private getPathAmountOut(path: any, amount: any) {
    let amountOut = amount;
    const _path = JSON.parse(JSON.stringify(path));
    while (_path.length) {
      const pair = _path.pop();
      amountOut = this.getPairAmountOut(pair, amount);
    }

    return amountOut;
  }
  private getPairAmountOut(pair: any, amount: any) {
    const price = pair.isReserved ? 1 / pair.price : pair.price;

    const _amount = BigNumber(amount)
      .div(10 ** pair.tokenA.decimals)
      .multipliedBy(1 - (pair.fee ? pair.fee / 1e6 : 0));
    return _amount.multipliedBy(price).toNumber();
  }
  private getRoutes(path: any) {
    const routes: any = [];
    path.forEach((pair: any) => {
      routes.push({
        token0: {
          ...pair.tokenA
        },
        token1: {
          ...pair.tokenB
        },
        fee: pair.fee
      });
    });
    return routes;
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
}
