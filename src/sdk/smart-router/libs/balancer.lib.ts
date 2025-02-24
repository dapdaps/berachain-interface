import { Contract, providers } from "ethers";
import BigNumber from "bignumber.js";
import { nativeToWNative } from "../utils/token";
import chains from "../config/chains";
import routerAbi from "../config/abi/router-balancer";

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
    const provider = new providers.JsonRpcProvider(
      chains[inputCurrency.chainId].rpcUrls[0]
    );
    const RouterContract = new Contract(
      this.routerAddress,
      routerAbi,
      provider.getSigner(account)
    );
    const finalPool = this.pools
      ?.filter(
        (poolData: any) =>
          poolData[0].includes(_inputCurrency.address.toLowerCase()) &&
          poolData[0].includes(_outputCurrency.address.toLowerCase())
      )
      .map((poolData: any) => poolData[1]);

    if (finalPool.length === 0)
      return {
        outputCurrencyAmount: "",
        noPair: true
      };

    const assets = [_inputCurrency.address, _outputCurrency.address];
    const funds = [account, false, account, false];

    const swap_steps = [
      {
        poolId: finalPool[0],
        assetIn: _inputCurrency.address,
        assetOut: _outputCurrency.address,
        amount: _amount
      }
    ];

    const token_indices: { [key: string]: number } = {};
    for (let i = 0; i < assets.length; i++) {
      token_indices[assets[i]] = i;
    }

    const swap_steps_struct = [];
    for (const step of swap_steps) {
      const swap_step_struct = [
        step["poolId"],
        token_indices[step["assetIn"]],
        token_indices[step["assetOut"]],
        step["amount"],
        "0x"
      ];
      swap_steps_struct.push(swap_step_struct);
    }
    const quoterQarams = [
      0,
      swap_steps_struct,
      [
        inputCurrency.isNative
          ? "0x0000000000000000000000000000000000000000"
          : inputCurrency.address,
        outputCurrency.isNative
          ? "0x0000000000000000000000000000000000000000"
          : outputCurrency.address
      ],
      funds
    ];

    const result = await RouterContract.callStatic.queryBatchSwap(
      ...quoterQarams
    );

    const _amountOut =
      new BigNumber(result[1]?.abs().toString()) || new BigNumber(0);

    if (_amountOut.eq(0)) {
      return {
        outputCurrencyAmount: "",
        noPair: true
      };
    }

    const deadline = Math.ceil(Date.now() / 1000) + 120;

    const _amountOutMin = _amountOut.multipliedBy(1 - slippage).toFixed(0);

    const options = {
      value: inputCurrency.isNative ? _amount : "0"
    };

    const params = [
      ...quoterQarams,
      [_amount, _amountOutMin],
      deadline.toFixed()
    ];

    const outputCurrencyAmount = _amountOut
      .div(10 ** outputCurrency.decimals)
      .toFixed(outputCurrency.decimals)
      .replace(/\.?0+$/, "");

    const returnData = {
      outputCurrencyAmount,
      noPair: false,
      routerAddress: this.routerAddress
    };

    let estimateGas;
    try {
      estimateGas = await RouterContract.estimateGas.batchSwap(
        ...params,
        options
      );
    } catch (err) {
      // console.log('estimateGas err', err);
    }

    const txn = await RouterContract.populateTransaction.batchSwap(...params, {
      ...options,
      gasLimit: estimateGas
        ? BigNumber(estimateGas.toString()).multipliedBy(1.2).toFixed(0)
        : 5000000
    });

    return { ...returnData, txn };
  }
}
