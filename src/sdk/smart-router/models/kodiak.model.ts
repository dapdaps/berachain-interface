import BigNumber from "bignumber.js";
import { utils, providers, Contract } from "ethers";
import { V3 } from "../libs/v3.lib";
import { V2 } from "../libs/v2.lib";
import chains from "../config/chains";
import routerAbi from "../config/abi/router-v3-4";
import routerV2Abi from "../config/abi/router-v2-1";

export class Kodiak {
  private v3: V3;
  private v2: V2;
  private ROUTER_ABI = routerAbi;
  private FACTORY: { [key: number]: string } = {
    80094: "0xD84CBf0B02636E7f53dB9E5e45A616E05d710990"
  };
  private QUOTER: { [key: number]: string } = {
    80094: "0x644C8D6E501f7C994B74F5ceA96abe65d0BA662B"
  };
  private ROUTER_V3: { [key: number]: string } = {
    80094: "0xe301E48F77963D3F7DbD2a4796962Bd7f3867Fb4"
  };
  private ROUTER_V2: { [key: number]: string } = {
    80094: "0xd91dd58387Ccd9B66B390ae2d7c66dBD46BC6022"
  };
  private FEES: { [key: number]: number[] } = {
    80094: [500, 3000, 10000, 20000]
  };
  private MID_TOKENS: { [key: number]: any } = {
    80094: [
      {
        address: "0x6969696969696969696969696969696969696969",
        decimals: 18,
        symbol: "WBERA"
      },
      {
        address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce",
        decimals: 18,
        symbol: "HONEY"
      }
    ]
  };
  constructor(chainId: number) {
    this.v3 = new V3({
      fees: this.FEES[chainId],
      chainId,
      factoryAddress: this.FACTORY[chainId],
      quoterAddress: this.QUOTER[chainId],
      midTokens: this.MID_TOKENS[chainId]
    });
    this.v2 = new V2({
      midTokens: this.MID_TOKENS[chainId],
      factoryAddress: "0x5e705e184d233ff2a7cb1553793464a9d0c3028f",
      computablePairAddress: false,
      hasStable: false,
      includeStable: false,
      feeIn: true,
      fee: 3,
      amountOutType: 2
    });
  }
  public async quoter({
    inputCurrency,
    outputCurrency,
    inputAmount,
    slippage,
    account
  }: any) {
    const _amount = BigNumber(inputAmount)
      .multipliedBy(10 ** inputCurrency.decimals)
      .toFixed(0);
    const [bestTradeV3, bestTradeV2] = await Promise.all([
      this.v3.bestTrade({
        inputCurrency,
        outputCurrency,
        inputAmount: _amount
      }),
      this.v2.bestTrade({
        inputCurrency,
        outputCurrency,
        inputAmount: _amount
      })
    ]);

    let bestTrade = bestTradeV3;
    let routerAddress = this.ROUTER_V3[inputCurrency.chainId];
    let type = "v3";

    if (BigNumber(bestTrade?.amountOut || 0).lt(bestTradeV2?.amountOut)) {
      bestTrade = bestTradeV2;
      routerAddress = this.ROUTER_V2[inputCurrency.chainId];
      type = "v2";
    }

    if (!bestTrade) {
      return {
        outputCurrencyAmount: "",
        noPair: true
      };
    }

    return this[type === "v3" ? "handleV3" : "handleV2"]({
      bestTrade,
      outputCurrency,
      inputCurrency,
      _amount,
      slippage,
      account,
      routerAddress
    });
  }

  private async handleV2({
    bestTrade,
    outputCurrency,
    inputCurrency,
    _amount,
    slippage,
    account,
    routerAddress
  }: any) {
    const outputCurrencyAmount = new BigNumber(bestTrade.amountOut)
      .div(10 ** outputCurrency.decimals)
      .toFixed(outputCurrency.decimals)
      .replace(/\.?0+$/, "");

    const returnData = {
      outputCurrencyAmount,
      noPair: false,
      routerAddress,
      routes: bestTrade.routes
    };

    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const RouterContract = new Contract(
      routerAddress,
      routerV2Abi,
      provider.getSigner(account)
    );

    const _amountOut = BigNumber(bestTrade.amountOut)
      .multipliedBy(1 - slippage)
      .toFixed(0);

    const deadline = Math.ceil(Date.now() / 1000) + 120;
    let method = "";
    const options: any = {};
    const path: string[] = [];

    bestTrade.pairs.forEach((pair: any, i: number) => {
      if (i === 0) {
        path.push(pair.tokenA.address);
        path.push(pair.tokenB.address);
      } else {
        path.push(pair.tokenB.address);
      }
    });

    const params = [_amountOut, path, account, deadline];

    if (inputCurrency.isNative) {
      method = "swapExactETHForTokens";
      options.value = _amount;
    } else if (outputCurrency.isNative) {
      method = "swapExactTokensForETH";
      params.unshift(_amount);
    } else {
      method = "swapExactTokensForTokens";
      params.unshift(_amount);
    }
    let estimateGas;
    try {
      estimateGas = await RouterContract.estimateGas[method](
        ...params,
        options
      );
    } catch (err) {
      // console.log("estimateGas err", err);
    }

    const txn = await RouterContract.populateTransaction[method](...params, {
      ...options,
      gasLimit: estimateGas
        ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
        : 5000000
    });
    return { ...returnData, txn };
  }
  private async handleV3({
    bestTrade,
    outputCurrency,
    inputCurrency,
    _amount,
    slippage,
    account
  }: any) {
    const outputCurrencyAmount = new BigNumber(bestTrade.amountOut)
      .div(10 ** outputCurrency.decimals)
      .toFixed(outputCurrency.decimals)
      .replace(/\.?0+$/, "");

    const returnData = {
      outputCurrencyAmount,
      noPair: false,
      routerAddress: this.ROUTER_V3[inputCurrency.chainId],
      routes: bestTrade.routes
    };

    const RouterIface = new utils.Interface(this.ROUTER_ABI);
    const options = {
      value: inputCurrency.isNative ? _amount : "0"
    };

    const _amountOut = BigNumber(bestTrade.amountOut)
      .multipliedBy(1 - slippage)
      .toFixed(0);

    const multicallParams = [];

    const inputs = {
      path: bestTrade.path,
      recipient: outputCurrency.isNative
        ? this.ROUTER_V3[inputCurrency.chainId]
        : account,
      amountIn: _amount,
      amountOutMinimum: _amountOut
    };

    multicallParams.push(
      RouterIface.encodeFunctionData("exactInput", [inputs])
    );

    if (outputCurrency.isNative) {
      multicallParams.push(
        RouterIface.encodeFunctionData("unwrapWETH9", ["0", account])
      );
    }

    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const multicallContract = new Contract(
      this.ROUTER_V3[inputCurrency.chainId],
      this.ROUTER_ABI,
      provider.getSigner(account)
    );

    let estimateGas;

    try {
      estimateGas = await multicallContract.estimateGas.multicall(
        multicallParams,
        options
      );
    } catch (err) {
      console.log("estimateGas err", err);
    }
    console.log("estimateGas", estimateGas);
    const txn = await multicallContract.populateTransaction.multicall(
      multicallParams,
      {
        ...options,
        gasLimit: estimateGas
          ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
          : 5000000
      }
    );

    return { ...returnData, txn };
  }
}
