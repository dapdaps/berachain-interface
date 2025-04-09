import { Contract } from "ethers";
import vaultAbi from "./abi";
import Big from "big.js";

export default async function onClaim({ currentRecord, signer, account }: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;

  const params = [currentRecord.extra_data.pool_index, account];
  try {
    estimateGas = await VaultContract.estimateGas.harvest(...params);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract.harvest(...params, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
