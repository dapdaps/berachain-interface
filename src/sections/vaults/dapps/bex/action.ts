import { Contract } from "ethers";
import vaultAbi from "./bex-vault";
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
  const method = actionType === "Deposit" ? "stake" : "withdraw";

  try {
    estimateGas = await VaultContract.estimateGas[method](amount);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract[method](amount, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
