import { utils } from "ethers";

export function ellipsAccount(account: string, len?: number) {
  if (!account || !utils.isAddress(account)) return "-";
  return account.slice(0, len || 6) + "..." + account.slice(-4);
}
