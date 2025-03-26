import { Contract } from "ethers";
import vaultAbi from "@/sections/pools/kodiak/island/abi/farm";

export default async function onClaim({ currentRecord, signer }: any) {
  const VaultContract = new Contract(
    currentRecord.vaultAddress,
    vaultAbi,
    signer
  );
  return await VaultContract.getReward();
}
