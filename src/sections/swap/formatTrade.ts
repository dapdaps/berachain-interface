import Big from 'big.js';

import chains from '@/configs/chains';

import checkGas from './checkGas';

const formatTrade = ({
  rawBalance,
  gasPrice,
  market,
  prices,
  inputCurrency,
  outputCurrency,
  inputCurrencyAmount
}: any) => {
  const _gas = !market.txn?.gasLimit
    ? market.gas
    : market.txn?.gasLimit.type === 'BigNumber'
    ? Number(market.txn?.gasLimit.hex)
    : market.txn?.gasLimit;

  const { isGasEnough, gas } = checkGas({
    rawBalance,
    gasPrice,
    gasLimit: _gas || 0
  });

  const inputCurrencyPrice =
    prices[inputCurrency.priceKey || inputCurrency.symbol] || 0;
  const outputCurrencyPrice =
    prices[outputCurrency.priceKey || outputCurrency.symbol] || 0;
  let priceImpact = null;
  let priceImpactType = 0;

  if (inputCurrencyPrice && outputCurrencyPrice) {

    const usdBefore = Big(inputCurrencyAmount).mul(inputCurrencyPrice)
    const calculatedPriceImpact = Big(market.outputCurrencyAmount).mul(outputCurrencyPrice)
      .minus(usdBefore)
      .div(usdBefore)
      .mul(100)
      .toFixed(2);

    // const poolPrice = Big(inputCurrencyPrice).div(outputCurrencyPrice);
    // const amountoutPrice = Big(market.outputCurrencyAmount).div(
    //   inputCurrencyAmount
    // );
    // priceImpact = poolPrice
    //   .minus(amountoutPrice)
    //   .div(poolPrice)
    //   .mul(100)
    //   .abs()
    //   .toFixed(2);

    const processedPriceImpact = processPriceImpact(calculatedPriceImpact);
    priceImpact = processedPriceImpact.priceImpact;
    priceImpactType = processedPriceImpact.priceImpactType;
  }

  const nativeToken = chains[inputCurrency.chainId].nativeCurrency;

  const nativeTokenPrice = prices[nativeToken.symbol];

  let routerStr = '';

  if (market.routes?.length) {
    market.routes[0].routes.forEach((route: any, i: number) => {
      if (i === 0) {
        routerStr += route.token0.symbol + ' > ' + route.token1.symbol;
      } else {
        routerStr += ' > ' + route.token1.symbol;
      }
    });
  } else {
    routerStr = inputCurrency.symbol + ' > ' + outputCurrency.symbol;
  }

  return {
    inputCurrency,
    outputCurrency,
    inputCurrencyAmount,
    name: market.template,
    txn: market.txn,
    routerAddress: market.routerAddress,
    noPair: market.noPair,
    outputCurrencyAmount: market.outputCurrencyAmount,
    routerStr,
    isGasEnough,
    priceImpact,
    priceImpactType,
    gasUsd: nativeTokenPrice
      ? Big(nativeTokenPrice)
          .mul(gas)
          .div(10 ** nativeToken.decimals)
          .toString()
      : '-'
  };
};

function processPriceImpact(priceImpact: string | number | null): { priceImpact: string | null; priceImpactType: number } {
  if (!priceImpact) {
    return { priceImpact: null, priceImpactType: 0 };
  }

  const priceImpactValue = Big(priceImpact || 0);
  const absPriceImpact = priceImpactValue.abs();
  let priceImpactType = 0;

  if (absPriceImpact.gt(1)) {
    priceImpactType = 1;
  }
  if (absPriceImpact.gt(5)) {
    priceImpactType = 2;
  }
  if (absPriceImpact.gt(15)) {
    priceImpactType = 3;
  }

  let finalPriceImpact: string;
  if (absPriceImpact.gt(100)) {
    finalPriceImpact = priceImpactType > 0 ? "100" : "-100";
  } else {
    finalPriceImpact = priceImpactValue.toFixed(2);
  }

  return {
    priceImpact: new Big(finalPriceImpact || 0).toFixed(2),
    priceImpactType
  };
}

export default formatTrade;
