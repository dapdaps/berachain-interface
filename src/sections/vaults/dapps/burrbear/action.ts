import { Contract } from "ethers";
import vaultAbi from "./abi";
import Big from "big.js";

export default async function onAction({
  currentRecord,
  signer,
  amount,
  account,
  actionType
}: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;
  const method = actionType === "Deposit" ? "deposit" : "withdraw";

  const params = [currentRecord.extra_data.pool_index, amount, account];

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
