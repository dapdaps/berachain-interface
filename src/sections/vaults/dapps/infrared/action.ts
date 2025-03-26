import { Contract } from "ethers";
import vaultAbi from "./abi";

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
  if (actionType === "Deposit") {
    return await VaultContract.stake(amount);
  } else if (actionType === "Withdraw") {
    return await VaultContract.withdraw(amount);
  }

  throw new Error("Invalid action type");
}
