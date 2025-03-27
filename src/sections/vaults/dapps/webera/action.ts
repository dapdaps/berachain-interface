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

  console.log("WeBera actionParams: %o", actionParams);

  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  let estimateGas;

  const method = actionType === "Deposit" ? "deposit" : "withdraw";

  const params = [
    // assets
    amount,
    // vault
    currentRecord.extra_data?.vault_token?.address,
    // fromAsset
    currentRecord.pool_address,
  ];
  const options: any = {};
  if (currentRecord.token.address === "native") {
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
