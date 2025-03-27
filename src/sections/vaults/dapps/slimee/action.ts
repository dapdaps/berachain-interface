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
  if (actionType !== "Deposit") return;

  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;
  const method = "deposit";

  try {
    estimateGas = await VaultContract.estimateGas[method](account, {
      value: amount
    });
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract[method](account, {
    value: amount,
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
