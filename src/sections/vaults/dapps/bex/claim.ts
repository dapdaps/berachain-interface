import { Contract } from "ethers";
import vaultAbi from "./bex-vault";
import Big from "big.js";

export default async function onClaim({ currentRecord, signer, account }: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;
  try {
    estimateGas = await VaultContract.estimateGas.getReward(account, account);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract.getReward(account, account, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
