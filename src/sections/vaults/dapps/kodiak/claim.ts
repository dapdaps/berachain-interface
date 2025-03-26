import { Contract } from "ethers";
import vaultAbi from "@/sections/pools/kodiak/island/abi/farm";
import Big from "big.js";

export default async function onClaim({ currentRecord, signer }: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;
  try {
    estimateGas = await VaultContract.estimateGas.getReward();
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract.getReward({
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
