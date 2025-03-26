import { Contract } from "ethers";
import vaultAbi from "@/sections/pools/kodiak/island/abi/farm";
import Big from "big.js";

export default async function onAction({
  currentRecord,
  signer,
  amount,
  dappParams,
  actionType
}: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;
  const method =
    actionType === "Deposit" ? "stakeLocked" : "withdrawLockedMultiple";
  const params =
    actionType === "Deposit"
      ? [amount, (dappParams?.days || 0) * 86400]
      : [dappParams.kekIds];

  try {
    estimateGas = await VaultContract.estimateGas[method](...params);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract[method](...params, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
