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
  const method = actionType === "Deposit" ? "depositFor" : "withdrawTo";

  try {
    estimateGas = await VaultContract.estimateGas[method](account, amount);
  } catch (err) {}
  console.log("estimateGas", estimateGas?.toString());
  return await VaultContract[method](account, amount, {
    gasLimit: estimateGas
      ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
      : 5000000
  });
}
