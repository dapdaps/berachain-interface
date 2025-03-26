import { Contract } from "ethers";
import vaultAbi from "./abi";

export default async function onClaim({ currentRecord, signer, account }: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  return await VaultContract.getReward(account, account);
}
