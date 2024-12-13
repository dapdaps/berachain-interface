import { providers } from "ethers";
import { RPC_STATUS, RPC_TIMEOUT } from "@/configs/rpc";

export async function getRpcPing(url: string): Promise<number> {
  const start = new Date().getTime();
  const provider = new providers.JsonRpcProvider(url);
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(-1);
    }, RPC_TIMEOUT);
  });
  return new Promise((resolve) => {
    Promise.race([provider.getNetwork(), timeoutPromise])
      .then(() => {
        const end = new Date().getTime();
        resolve(end - start);
      })
      .catch(() => {
        resolve(-1);
      });
  });
}

export function renderPing(ping?: number) {
  if (!ping) return "-ms";
  if (ping < 0) {
    return "off";
  }
  return ping + "ms";
}

export function renderPingConfig(ping?: number) {
  if (!ping) return RPC_STATUS.FAST;
  if (ping < RPC_STATUS.FAST.lt && ping >= RPC_STATUS.FAST.gte) {
    return RPC_STATUS.FAST;
  }
  if (ping < RPC_STATUS.SLOW.lt && ping >= RPC_STATUS.SLOW.gte) {
    return RPC_STATUS.SLOW;
  }
  return RPC_STATUS.STOP;
}
