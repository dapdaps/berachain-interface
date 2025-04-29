import { Contract } from 'ethers';
import { LPSTAKING_ABI, STLBGT_ABI } from './abi';
import { getEstimateGas } from '@/sections/vaults/v2/components/action/union/berapaw/utils';

export default async function onAction(params: any) {
  const {
    currentRecord,
    signer,
    amount,
    account,
    actionType
  } = params;

  let contract: any;
  let method: string = "";
  let contractParams: any = [];

  // WBERA_LBGT
  if (currentRecord.vaultAddress === "0xa77dee7bc36c463bb3e39804c9c7b13427d712b0") {
    contract = new Contract(
      currentRecord.vaultAddress,
      LPSTAKING_ABI,
      signer
    );
    if (actionType === "Deposit") {
      method = "stake";
      contractParams = [amount];
    }
    if (actionType === "Withdraw") {
      method = "withdraw";
      contractParams = [amount];
    }
  } else {
    contract = new Contract(
      currentRecord.vaultAddress,
      STLBGT_ABI,
      signer
    );
    if (actionType === "Deposit") {
      method = "deposit";
      contractParams = [amount, account];
    }
    if (actionType === "Withdraw") {
      method = "withdraw";
      contractParams = [amount, account, account];
    }
  }

  const options = await getEstimateGas(contract, method, contractParams);
  return contract[method](...contractParams, options);
}
