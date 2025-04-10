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

  const params = [currentRecord.pool_address];
  try {
    estimateGas = await VaultContract.estimateGas.claim(...params);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract.claim(...params, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
