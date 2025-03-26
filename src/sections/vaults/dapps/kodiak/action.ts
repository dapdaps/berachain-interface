import { Contract } from "ethers";
import vaultAbi from "@/sections/pools/kodiak/island/abi/farm";

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
  if (actionType === "Deposit") {
    const secs = (dappParams?.days || 0) * 86400;
    return await VaultContract.stakeLocked(amount, secs);
  } else if (actionType === "Withdraw") {
    return await VaultContract.withdrawLockedMultiple(dappParams.kekIds);
  }

  throw new Error("Invalid action type");
}
