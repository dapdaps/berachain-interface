import { Contract } from "ethers";
import vaultAbi from "./abi";
import Big from "big.js";

export default async function onAction(actionParams: any) {
  const {
    currentRecord,
    signer,
    amount,
    actionType
  } = actionParams;

  const VaultContract = new Contract(
    currentRecord.extra_data?.vault_router,
    vaultAbi,
    signer
  );
  let estimateGas;

  const method = actionType === "Deposit" ? "deposit" : "withdraw";

  const params = [
    // assets(deposit) / toAssetAmount(withdraw)
    amount,
    // vault
    currentRecord.vault_address,
    // fromAsset(deposit) / toAsset(withdraw)
    currentRecord.pool_address,
  ];
  const options: any = {};
  if (currentRecord.token.address === "native" && actionType === "Deposit") {
    options.value = amount;
  }

  console.log("WeBera params: %o", params);

  try {
    estimateGas = await VaultContract.estimateGas[method](...params, options);
  } catch (err) {
    console.log("estimateGas error: %o", err);
  }

  console.log("estimateGas: %o", estimateGas?.toString());
  options.gasLimit = estimateGas ? Big(estimateGas.toString()).mul(1.2).toFixed(0) : 5000000;

  return await VaultContract[method](...params, options);
}
