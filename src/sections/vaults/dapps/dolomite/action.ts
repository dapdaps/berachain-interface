import { ethers } from 'ethers';
import { BERA_DEPOSIT_ABI } from '@/sections/Lending/handlers/dolomite';
import Big from 'big.js';

export default async function onDolomiteAction(actionParams: any) {
  const {
    currentRecord,
    signer,
    amount,
    actionType
  } = actionParams;

  console.log("actionParams: %o", actionParams);

  const isNative = currentRecord.token.isNative;

  let options: any = {};
  let params: any = [];
  let method: any = "";
  let contract: any = null;

  // const parsedAmount = ethers.utils.parseUnits(
  //   amount,
  //   currentRecord.token.decimals
  // );
  const parsedAmount = amount;
  options = {
    value: (isNative && actionType === "Deposit") ? parsedAmount : 0,
    gasLimit: 4000000
  };

  if (["Deposit", "Withdraw"].includes(actionType)) {
    contract = new ethers.Contract(
      currentRecord.config.depositWithdrawalProxy,
      BERA_DEPOSIT_ABI,
      signer
    );

    if (actionType === "Deposit") {
      method = isNative
        ? "depositPayableIntoDefaultAccount"
        : "depositWeiIntoDefaultAccount";
      params = isNative ? [] : [currentRecord.token.marketId, parsedAmount];
    }

    if (actionType === "Withdraw") {
      method = isNative
        ? "withdrawPayableFromDefaultAccount"
        : "withdrawWeiFromDefaultAccount";
      params = isNative
        ? [parsedAmount, 1]
        : [currentRecord.token.marketId, parsedAmount, 1];
    }
  }

  return new Promise((resolve) => {
    const createTx = (gas?: any) => {
      const _gas = gas ? Big(gas.toString()).mul(1.2).toFixed(0) : 4000000;
      contract[method](...params, {
        ...options,
        gasLimit: _gas
      }).then((tx: any) => {
        resolve(tx);
      }) .catch((err: any) => {
        console.log("%s failed: %o", actionType, err);
        resolve(false);
      });
    };

    contract.estimateGas[method](...params, options)
      .then((gas: any) => {
        createTx(gas);
      })
      .catch((err: any) => {
        console.log("estimateGas", err);
        createTx();
      });
  });
}
