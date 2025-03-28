import { Contract } from "ethers";
import vaultAbi from "./abi";
import Big from "big.js";

// const mockListData = [
//   {
//     "id": 182,
//     "name": "LEND/BORROW BERA",
//     "project": "WeBera",
//     "pool_project": "Dolomite",
//     "creator_project": "WeBera",
//     "pool_address": "0x0000000000000000000000000000000000000000",
//     "vault_address": "0xf44328d75638eec3E2f7075846c7596E92774aD2",
//     "tokens": [
//       {
//         "address": "0x0000000000000000000000000000000000000000",
//         "symbol": "BERA",
//         "decimals": 18
//       }
//     ],
//     "reward_tokens": [],
//     "extra_data": {
//       "withdraw_token": {
//         "address": "0x55a050f76541C2554e9dfA3A0b4e665914bF92EA",
//         "symbol": "WBERA",
//         "decimals": 18,
//         "vault_address": "0x55a050f76541C2554e9dfA3A0b4e665914bF92EA"
//       }
//     },
//     "tvl": "74150.82289882812",
//     "apr": {
//       "farm": "0",
//       "pool": "2.826716"
//     },
//     "user_stake": {
//       "amount": "0.09999999990000001",
//       "usd": "0.09999999990000001"
//     },
//     "user_reward": null
//   }
// ];

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
    // assets(deposit) / toAssetAmount(withdraw)
    amount,
    // vault
    currentRecord.extra_data?.withdraw_token?.vault_address,
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
