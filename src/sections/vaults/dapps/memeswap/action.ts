import { Contract } from "ethers";
import vaultAbi from "./abi";
import Big from "big.js";

export default async function onAction({
  currentRecord,
  signer,
  amount,
  actionType
}: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;
  const method =
    actionType === "Deposit"
      ? "stake"
      : actionType === "Exit"
      ? "enqueue"
      : "withdraw";

  const params =
    actionType === "Deposit"
      ? [currentRecord.pool_address]
      : actionType === "Exit"
      ? [amount, currentRecord.pool_address]
      : [amount];

  const options = actionType === "Deposit" ? { value: amount } : {};

  try {
    estimateGas = await VaultContract.estimateGas[method](...params, options);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract[method](...params, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000,
    ...options
  });
}
