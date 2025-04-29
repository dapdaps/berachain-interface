import { Contract } from 'ethers';
import { STLBGT_ABI } from './abi';
import { getEstimateGas } from '@/sections/vaults/v2/components/action/union/berapaw/utils';

export default async function onAction(params: any) {
  const {
    currentRecord,
    signer,
    amount,
    account,
    actionType
  } = params;

  let method: string = "";
  let contractParams: any = [];
  if (actionType === "Deposit") {
    method = "deposit";
    contractParams = [amount, account];
  }
  if (actionType === "Withdraw") {
    method = "withdraw";
    contractParams = [amount, account, account];
  }
  const contract = new Contract(
    currentRecord.vaultAddress,
    STLBGT_ABI,
    signer
  );
  const options = await getEstimateGas(contract, method, contractParams);
  return contract[method](...contractParams, options);
}
