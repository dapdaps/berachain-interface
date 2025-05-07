import { Contract } from 'ethers';
import { LPSTAKING_ABI } from './abi';
import { getEstimateGas } from '@/sections/vaults/v2/components/action/union/berapaw/utils';

export default async function onClaim(params: any) {
  const {
    currentRecord,
    signer,
    account,
    token = "all",
  } = params;

  let contract: any;
  let method: string = "";
  let contractParams: any = [];

  if (["all", "pPAW"].includes(token)) {
    contract = new Contract(
      currentRecord.vaultAddress,
      LPSTAKING_ABI,
      signer
    );
    method = "getAllRewards";
    if (token === "pPAW") {
      method = "getReward";
    }
    contractParams = [account];
  }

  if (token === "LBGT") {
    contract = new Contract(
      "0xF0422bC37f1d2D1B57596cCA5A64E30c71D10170",
      LPSTAKING_ABI,
      signer
    );
    method = "getReward";
    contractParams = [account];
  }

  const options = await getEstimateGas(contract, method, contractParams);
  return contract[method](...contractParams, options);
}
